from pathlib import Path
import sys

from dataclasses import dataclass
import logging
from typing import Optional
import hashlib
import json
from functools import lru_cache

from haystack import Pipeline
from haystack.components.embedders import SentenceTransformersTextEmbedder
from haystack.components.embedders import OpenAITextEmbedder
from haystack.components.joiners import DocumentJoiner
from haystack.components.builders import PromptBuilder
from haystack.components.generators.openai import OpenAIGenerator
from haystack.components.builders.answer_builder import AnswerBuilder
from haystack_integrations.components.retrievers.opensearch import OpenSearchBM25Retriever, OpenSearchEmbeddingRetriever
from haystack_integrations.document_stores.opensearch import OpenSearchDocumentStore

from common.config import settings
from common.pipeline_loader import load_pipeline
from query.serializer import serialize_query_result


logger = logging.getLogger(__name__)

@dataclass
class QueryConfig:
    document_store: OpenSearchDocumentStore
    pipeline_filename: str = "query.yml"
    embedder_model: str = "intfloat/multilingual-e5-base"
    llm_name: str = "gpt-4o"
    prompt_template: str = """
    Given the following conversation history and context, answer the question.
    
    Conversation History:
    {% for message in conversation_history %}
    {{ message.role }}: {{ message.content }}
    {% endfor %}
    
    Context:
    {% for document in documents %}
        {{ document.content }}
    {% endfor %}
    
    Question: {{query}}
    Answer:
    """

def create_query_pipeline(config: QueryConfig) -> Pipeline:
    p = Pipeline()

    if settings.use_openai_embedder:
        p.add_component(
            instance=OpenAITextEmbedder(),
            name="query_embedder"
        )
    else:
        p.add_component(
            instance=SentenceTransformersTextEmbedder(model=config.embedder_model),
            name="query_embedder"
        )

    p.add_component(
        instance=OpenSearchBM25Retriever(document_store=config.document_store), 
        name="bm25_retriever"
    )  # BM25 Retriever

    p.add_component(
        instance=OpenSearchEmbeddingRetriever(document_store=config.document_store), 
        name="embedding_retriever"
    )  # Embedding Retriever (OpenSearch)

    p.add_component(
        instance=DocumentJoiner(join_mode="concatenate"), 
        name="document_joiner"
    )  # Document Joiner

    p.add_component(
        instance=PromptBuilder(template=config.prompt_template), 
        name="prompt_builder"
    )  # Prompt Builder

    p.add_component(
        instance=AnswerBuilder(), 
        name="answer_builder"
    )  # Answer Builder

    if settings.generator == "openai":
        p.add_component(
            instance=OpenAIGenerator(model=config.llm_name, streaming_callback=None),
            name="llm"
        )
    else:
        raise ValueError(f"Invalid generator: {settings.generator}")

    # Connect components to each other
    p.connect("bm25_retriever.documents", "document_joiner.documents")
    p.connect("query_embedder.embedding", "embedding_retriever.query_embedding")
    p.connect("embedding_retriever.documents", "document_joiner.documents")
    p.connect("document_joiner.documents", "prompt_builder.documents")
    p.connect("prompt_builder.prompt", "llm.prompt")
    p.connect("embedding_retriever.documents", "answer_builder.documents")
    p.connect("llm.replies", "answer_builder.replies")

    return p

class QueryService:
    def __init__(self, document_store):
        self.config = QueryConfig(document_store=document_store)
        self.pipeline = None
        self.cache = {}  # Simple in-memory cache

        if settings.pipelines_from_yaml:
            try:
                self.pipeline = load_pipeline(settings.pipelines_dir, self.config.pipeline_filename)
            except Exception as e:
                logger.warning(f"Failed to load pipeline from YAML: {e}. Falling back to default pipeline.")

        if self.pipeline is None:
            self.pipeline = create_query_pipeline(self.config)

        #print(f"\n--- Query Pipeline ---\n{self.pipeline.dumps()}")

    def _get_cache_key(self, query: str, filters: Optional[dict] = None, conversation_history: Optional[list] = None):
        """Generate a cache key for the query."""
        key_data = {
            "query": query,
            "filters": filters or {},
            "history": conversation_history or []
        }
        key_str = json.dumps(key_data, sort_keys=True)
        return hashlib.md5(key_str.encode()).hexdigest()

    def search(self, query: str, filters: Optional[dict] = None, conversation_history: Optional[list] = None):
        if self.pipeline is None:
            raise ValueError("Query pipeline has not been initialized")

        # Check cache first
        cache_key = self._get_cache_key(query, filters, conversation_history)
        if cache_key in self.cache:
            logger.info("Returning cached result")
            return self.cache[cache_key]

        # Component names here should match pipeline definition!
        pipeline_params = {
            "bm25_retriever": {"query": query, "filters": filters},
            "query_embedder": {"text": query},
            "answer_builder": {"query": query},
            "prompt_builder": {"query": query, "conversation_history": conversation_history or []}
        }

        logger.info("Running query pipeline...")

        # Run the query pipeline
        results = self.pipeline.run(pipeline_params)

        logger.debug(f"Query pipeline.run() results:\n{results}")

        answer = results['answer_builder']['answers'][0]

        # Cache the result (simple cache, no expiration)
        self.cache[cache_key] = answer

        return answer

    def search_streaming(self, query: str, filters: Optional[dict] = None, conversation_history: Optional[list] = None):
        """
        Search with streaming response.
        Returns a generator that yields chunks of the response.
        """
        if self.pipeline is None:
            raise ValueError("Query pipeline has not been initialized")

        # Create a streaming generator
        streaming_generator = OpenAIGenerator(model=self.config.llm_name)
        
        # Temporarily replace the non-streaming generator
        original_generator = self.pipeline.get_component("llm")
        self.pipeline.remove_component("llm")
        self.pipeline.add_component(streaming_generator, name="llm")
        
        # Reconnect
        self.pipeline.connect("prompt_builder.prompt", "llm.prompt")
        self.pipeline.connect("llm.replies", "answer_builder.replies")

        try:
            # Component names here should match pipeline definition!
            pipeline_params = {
                "bm25_retriever": {"query": query, "filters": filters},
                "query_embedder": {"text": query},
                "answer_builder": {"query": query},
                "prompt_builder": {"query": query, "conversation_history": conversation_history or []}
            }

            logger.info("Running streaming query pipeline...")

            # Run the query pipeline
            results = self.pipeline.run(pipeline_params)

            logger.debug(f"Streaming query pipeline.run() results:\n{results}")

            answer = results['answer_builder']['answers'][0]

            return answer
        finally:
            # Restore original generator
            self.pipeline.remove_component("llm")
            self.pipeline.add_component(original_generator, name="llm")
            self.pipeline.connect("prompt_builder.prompt", "llm.prompt")
            self.pipeline.connect("llm.replies", "answer_builder.replies")
