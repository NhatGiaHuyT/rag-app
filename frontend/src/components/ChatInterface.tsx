'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Input,
  Button,
  IconButton,
  Spinner,
  Center,
  useToast,
  Textarea,
  Badge,
} from '@chakra-ui/react';
import { MdSend, MdThumbUp, MdThumbDown } from 'react-icons/md';
import MessageBox from '@/components/MessageBox';

interface Message {
  id: number;
  role: string;
  content: string;
  created_at: string;
  rating?: number;
  feedback?: string;
  is_manual: boolean;
}

interface ChatInterfaceProps {
  conversationId: number | null;
  onNewConversation: () => void;
}

export default function ChatInterface({ conversationId, onNewConversation }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentResponse, setCurrentResponse] = useState('');
  const [currentReferences, setCurrentReferences] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const toast = useToast();

  useEffect(() => {
    if (conversationId) {
      fetchMessages();
    } else {
      setMessages([]);
    }
  }, [conversationId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = async () => {
    if (!conversationId) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/auth/conversations/${conversationId}/messages`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      } else {
        toast({
          title: 'Failed to load messages',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: 'Error loading messages',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    let currentConversationId = conversationId;

    // If no conversation selected, create a new one
    if (!currentConversationId) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/auth/conversations', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ title: inputMessage.slice(0, 50) + '...' }),
        });
        if (response.ok) {
          const data = await response.json();
          currentConversationId = data.id;
          onNewConversation(); // This should trigger conversation list refresh
        } else {
          toast({
            title: 'Failed to create conversation',
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
          return;
        }
      } catch (error) {
        toast({
          title: 'Error creating conversation',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return;
      }
    }

    // Add user message to UI
    const userMessage: Message = {
      id: Date.now(),
      role: 'user',
      content: inputMessage,
      created_at: new Date().toISOString(),
      is_manual: false,
    };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      // First add message to conversation
      await fetch(`/api/auth/conversations/${currentConversationId}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: userMessage.content }),
      });

      // Then get AI response
      const searchResponse = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: userMessage.content,
          conversation_id: currentConversationId,
        }),
      });

      if (searchResponse.ok) {
        const searchData = await searchResponse.json();
        const answer = searchData.results[0]?.answers[0];
        const references = answer?.meta?._references || [];

        const aiMessage: Message = {
          id: Date.now() + 1,
          role: 'assistant',
          content: answer?.answer || 'No answer found.',
          created_at: new Date().toISOString(),
          is_manual: false,
        };

        setMessages(prev => [...prev, aiMessage]);
        setCurrentResponse(answer?.answer || 'No answer found.');
        setCurrentReferences(references);
      } else {
        toast({
          title: 'Failed to get response',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: 'Error sending message',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRating = async (messageId: number, rating: number) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`/api/auth/messages/${messageId}/feedback`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rating }),
      });
      toast({
        title: 'Feedback submitted',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error submitting feedback',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box flex={1} display="flex" flexDirection="column" h="100%">
      {/* Messages Area */}
      <Box flex={1} overflowY="auto" p={4}>
        <VStack spacing={4} align="stretch">
          {messages.map((message) => (
            <Box
              key={message.id}
              alignSelf={message.role === 'user' ? 'flex-end' : 'flex-start'}
              maxW="70%"
            >
              <HStack spacing={2} mb={1}>
                <Badge colorScheme={message.role === 'user' ? 'blue' : 'green'}>
                  {message.role === 'user' ? 'You' : message.is_manual ? 'Expert' : 'AI'}
                </Badge>
                <Text fontSize="xs" color="gray.500">
                  {new Date(message.created_at).toLocaleTimeString()}
                </Text>
              </HStack>
              <Box
                bg={message.role === 'user' ? 'blue.500' : 'gray.100'}
                color={message.role === 'user' ? 'white' : 'black'}
                p={3}
                borderRadius="lg"
                shadow="sm"
              >
                {message.role === 'assistant' ? (
                  <MessageBox output={message.content} references={[]} />
                ) : (
                  <Text>{message.content}</Text>
                )}
              </Box>
              {message.role === 'assistant' && (
                <HStack spacing={2} mt={2} justify="flex-start">
                  <IconButton
                    aria-label="Good answer"
                    icon={<MdThumbUp />}
                    size="sm"
                    variant="ghost"
                    colorScheme="green"
                    onClick={() => handleRating(message.id, 5)}
                  />
                  <IconButton
                    aria-label="Bad answer"
                    icon={<MdThumbDown />}
                    size="sm"
                    variant="ghost"
                    colorScheme="red"
                    onClick={() => handleRating(message.id, 1)}
                  />
                </HStack>
              )}
            </Box>
          ))}
          {loading && (
            <Box alignSelf="flex-start" maxW="70%">
              <HStack spacing={2} mb={1}>
                <Badge colorScheme="green">AI</Badge>
              </HStack>
              <Box bg="gray.100" p={3} borderRadius="lg" shadow="sm">
                <Spinner size="sm" mr={2} />
                <Text display="inline">Thinking...</Text>
              </Box>
            </Box>
          )}
          <div ref={messagesEndRef} />
        </VStack>
      </Box>

      {/* Input Area */}
      <Box p={4} borderTop="1px" borderColor="gray.200">
        <HStack spacing={2}>
          <Textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask a question about your documents..."
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            resize="none"
          />
          <IconButton
            aria-label="Send message"
            icon={<MdSend />}
            colorScheme="blue"
            onClick={handleSendMessage}
            isLoading={loading}
            disabled={!inputMessage.trim()}
          />
        </HStack>
      </Box>
    </Box>
  );
}