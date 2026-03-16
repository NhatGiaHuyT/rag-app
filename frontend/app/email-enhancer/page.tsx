'use client';
import PromptTool, { PromptToolConfig } from '@/components/PromptTool';
import { Icon } from '@chakra-ui/react';
import { MdEmail } from 'react-icons/md';

const config: PromptToolConfig = {
  title: 'Email Enhancer',
  description: 'Transform your draft emails into polished, professional messages.',
  icon: <Icon as={MdEmail} color="white" w="24px" h="24px" />,
  gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  fields: [
    { key: 'email', label: 'Your Draft Email', placeholder: 'Paste your email draft here...', type: 'textarea', rows: 6 },
    {
      key: 'tone', label: 'Desired Tone', type: 'select',
      options: [
        { value: 'professional', label: 'Professional' },
        { value: 'formal', label: 'Formal' },
        { value: 'friendly and warm', label: 'Friendly & Warm' },
        { value: 'concise and direct', label: 'Concise & Direct' },
        { value: 'persuasive', label: 'Persuasive' },
      ],
    },
    {
      key: 'purpose', label: 'Email Purpose', type: 'select',
      options: [
        { value: 'business communication', label: 'Business Communication' },
        { value: 'sales / outreach', label: 'Sales / Outreach' },
        { value: 'follow-up', label: 'Follow-up' },
        { value: 'apology', label: 'Apology' },
        { value: 'job application', label: 'Job Application' },
        { value: 'customer support', label: 'Customer Support' },
      ],
    },
    { key: 'extra', label: 'Additional Notes (optional)', placeholder: 'e.g. Keep it under 150 words, add a clear subject line...', type: 'textarea', rows: 2, required: false },
  ],
  buildPrompt: (v) =>
    `Enhance the following email draft. Make it more ${v.tone || 'professional'} and suitable for ${v.purpose || 'business communication'}.
${v.extra ? `Additional instructions: ${v.extra}` : ''}

Provide:
1. A suggested **Subject Line**
2. The **Enhanced Email Body**

Keep the original intent but improve clarity, tone, grammar, and impact.

Original draft:
"""
${v.email}
"""`,
};

export default function EmailEnhancerPage() {
  return <PromptTool config={config} />;
}

