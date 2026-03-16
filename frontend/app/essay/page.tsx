'use client';
import PromptTool, { PromptToolConfig } from '@/components/PromptTool';
import { Icon } from '@chakra-ui/react';
import { MdEdit } from 'react-icons/md';

const config: PromptToolConfig = {
  title: 'Essay Generator',
  description: 'Generate well-structured essays on any topic in seconds.',
  icon: <Icon as={MdEdit} color="white" w="24px" h="24px" />,
  gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  fields: [
    { key: 'topic', label: 'Essay Topic', placeholder: 'e.g. The impact of AI on modern society', type: 'input' },
    {
      key: 'length', label: 'Essay Length', type: 'select',
      options: [
        { value: 'short (300 words)', label: 'Short (~300 words)' },
        { value: 'medium (600 words)', label: 'Medium (~600 words)' },
        { value: 'long (1000 words)', label: 'Long (~1000 words)' },
      ],
    },
    {
      key: 'style', label: 'Writing Style', type: 'select',
      options: [
        { value: 'academic', label: 'Academic' },
        { value: 'persuasive', label: 'Persuasive' },
        { value: 'descriptive', label: 'Descriptive' },
        { value: 'narrative', label: 'Narrative' },
        { value: 'casual', label: 'Casual / Blog' },
      ],
    },
    { key: 'extra', label: 'Additional Instructions (optional)', placeholder: 'e.g. Include statistics, use subheadings...', type: 'textarea', rows: 2, required: false },
  ],
  buildPrompt: (v) =>
    `Write a ${v.length || 'medium (600 words)'} ${v.style || 'academic'} essay on the topic: "${v.topic}".
${v.extra ? `Additional instructions: ${v.extra}` : ''}
Use clear structure with introduction, body paragraphs, and conclusion. Format using markdown.`,
};

export default function EssayPage() {
  return <PromptTool config={config} />;
}

