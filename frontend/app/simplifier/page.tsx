'use client';
import PromptTool, { PromptToolConfig } from '@/components/PromptTool';
import { Icon } from '@chakra-ui/react';
import { MdAutoFixHigh } from 'react-icons/md';

const config: PromptToolConfig = {
  title: 'Content Simplifier',
  description: 'Rewrite complex content into clear, easy-to-understand language.',
  icon: <Icon as={MdAutoFixHigh} color="white" w="24px" h="24px" />,
  gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  fields: [
    { key: 'content', label: 'Content to Simplify', placeholder: 'Paste your complex text here...', type: 'textarea', rows: 6 },
    {
      key: 'audience', label: 'Target Audience', type: 'select',
      options: [
        { value: 'general public', label: 'General Public' },
        { value: 'children (age 10-12)', label: 'Children (10-12)' },
        { value: 'teenagers', label: 'Teenagers' },
        { value: 'non-native English speakers', label: 'Non-native Speakers' },
        { value: 'experts', label: 'Experts / Professionals' },
      ],
    },
    {
      key: 'level', label: 'Reading Level', type: 'select',
      options: [
        { value: 'very simple (Grade 5)', label: 'Very Simple (Grade 5)' },
        { value: 'simple (Grade 8)', label: 'Simple (Grade 8)' },
        { value: 'standard (Grade 10)', label: 'Standard (Grade 10)' },
        { value: 'advanced', label: 'Advanced' },
      ],
    },
  ],
  buildPrompt: (v) =>
    `Simplify the following content for a ${v.audience || 'general public'} at a ${v.level || 'standard'} reading level.
Keep the core meaning intact. Use plain language, short sentences, and avoid jargon.

Content:
"""
${v.content}
"""

Provide the simplified version in clear markdown format.`,
};

export default function SimplifierPage() {
  return <PromptTool config={config} />;
}

