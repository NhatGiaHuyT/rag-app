'use client';
import PromptTool, { PromptToolConfig } from '@/components/PromptTool';
import { Icon } from '@chakra-ui/react';
import { MdQuestionAnswer } from 'react-icons/md';

const config: PromptToolConfig = {
  title: 'FAQs Content',
  description: 'Generate comprehensive FAQ sections for your product, service, or website.',
  icon: <Icon as={MdQuestionAnswer} color="white" w="24px" h="24px" />,
  gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  fields: [
    { key: 'topic', label: 'Product / Service / Topic', placeholder: 'e.g. Online project management SaaS for remote teams', type: 'textarea', rows: 2 },
    {
      key: 'count', label: 'Number of FAQs', type: 'select',
      options: [
        { value: '5', label: '5 FAQs' },
        { value: '8', label: '8 FAQs' },
        { value: '10', label: '10 FAQs' },
        { value: '15', label: '15 FAQs' },
        { value: '20', label: '20 FAQs' },
      ],
    },
    {
      key: 'style', label: 'Answer Style', type: 'select',
      options: [
        { value: 'concise (1-2 sentences)', label: 'Concise (1-2 sentences)' },
        { value: 'detailed (3-5 sentences)', label: 'Detailed (3-5 sentences)' },
        { value: 'conversational', label: 'Conversational' },
        { value: 'technical', label: 'Technical' },
      ],
    },
    { key: 'audience', label: 'Target Audience (optional)', placeholder: 'e.g. Small business owners, developers, parents...', type: 'input', required: false },
  ],
  buildPrompt: (v) =>
    `Generate ${v.count || '10'} frequently asked questions (FAQs) with ${v.style || 'concise'} answers for:

Topic/Product: ${v.topic}
${v.audience ? `Target audience: ${v.audience}` : ''}

Requirements:
- Cover common concerns, pricing, how-it-works, support, and edge cases
- Questions should reflect what real users actually ask
- Format each FAQ as **Q:** and **A:** in markdown
- Number each FAQ`,
};

export default function FaqPage() {
  return <PromptTool config={config} />;
}

