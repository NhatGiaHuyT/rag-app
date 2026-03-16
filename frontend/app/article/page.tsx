'use client';
import PromptTool, { PromptToolConfig } from '@/components/PromptTool';
import { Icon } from '@chakra-ui/react';
import { MdArticle } from 'react-icons/md';

const config: PromptToolConfig = {
  title: 'Article Generator',
  description: 'Generate full-length, SEO-optimized articles and blog posts instantly.',
  icon: <Icon as={MdArticle} color="white" w="24px" h="24px" />,
  gradient: 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)',
  fields: [
    { key: 'topic', label: 'Article Topic', placeholder: 'e.g. How to build a morning routine for productivity', type: 'input' },
    { key: 'audience', label: 'Target Audience', placeholder: 'e.g. Entrepreneurs, students, health-conscious adults', type: 'input' },
    {
      key: 'length', label: 'Article Length', type: 'select',
      options: [
        { value: 'short (~400 words)', label: 'Short (~400 words)' },
        { value: 'medium (~800 words)', label: 'Medium (~800 words)' },
        { value: 'long (~1500 words)', label: 'Long (~1500 words)' },
        { value: 'comprehensive (~2500 words)', label: 'Comprehensive (~2500 words)' },
      ],
    },
    {
      key: 'style', label: 'Writing Style', type: 'select',
      options: [
        { value: 'informative and educational', label: 'Informative & Educational' },
        { value: 'conversational / blog', label: 'Conversational / Blog' },
        { value: 'journalistic', label: 'Journalistic' },
        { value: 'how-to / tutorial', label: 'How-to / Tutorial' },
        { value: 'listicle', label: 'Listicle (Top 10, Best of...)' },
      ],
    },
    { key: 'keywords', label: 'SEO Keywords to Include (optional)', placeholder: 'e.g. morning routine, productivity tips, wake up early', type: 'input', required: false },
  ],
  buildPrompt: (v) =>
    `Write a ${v.length || 'medium (~800 words)'} ${v.style || 'informative and educational'} article on:

Topic: "${v.topic}"
Target Audience: ${v.audience}
${v.keywords ? `SEO keywords to include naturally: ${v.keywords}` : ''}

Requirements:
- Compelling headline (H1)
- Engaging introduction that hooks the reader
- Well-organized body with H2/H3 subheadings
- Practical, actionable information
- Strong conclusion with key takeaways
- Natural keyword integration (no keyword stuffing)
- Format entirely in markdown`,
};

export default function ArticlePage() {
  return <PromptTool config={config} />;
}

