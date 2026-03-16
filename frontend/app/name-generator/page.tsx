'use client';
import PromptTool, { PromptToolConfig } from '@/components/PromptTool';
import { Icon } from '@chakra-ui/react';
import { MdLightbulb } from 'react-icons/md';

const config: PromptToolConfig = {
  title: 'Product Name Generator',
  description: 'Generate creative, memorable product names that stand out in the market.',
  icon: <Icon as={MdLightbulb} color="white" w="24px" h="24px" />,
  gradient: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
  fields: [
    { key: 'description', label: 'Product Description', placeholder: 'Describe what your product does, its purpose and value...', type: 'textarea', rows: 3 },
    { key: 'industry', label: 'Industry / Category', placeholder: 'e.g. Health & Wellness, B2B SaaS, Fashion, Food & Beverage', type: 'input' },
    {
      key: 'style', label: 'Naming Style', type: 'select',
      options: [
        { value: 'catchy and memorable', label: 'Catchy & Memorable' },
        { value: 'professional and corporate', label: 'Professional & Corporate' },
        { value: 'creative and unique', label: 'Creative & Unique (invented words)' },
        { value: 'descriptive', label: 'Descriptive (tells what it does)' },
        { value: 'acronym-based', label: 'Acronym-based' },
      ],
    },
    {
      key: 'count', label: 'Number of Names', type: 'select',
      options: [
        { value: '5', label: '5 names' },
        { value: '10', label: '10 names' },
        { value: '15', label: '15 names' },
        { value: '20', label: '20 names' },
      ],
    },
    { key: 'avoid', label: 'Words / Themes to Avoid (optional)', placeholder: 'e.g. anything with "tech", no hyphens, avoid generic terms', type: 'input', required: false },
  ],
  buildPrompt: (v) =>
    `Generate ${v.count || '10'} ${v.style || 'catchy and memorable'} product name ideas for:

Product: ${v.description}
Industry: ${v.industry}
${v.avoid ? `Avoid: ${v.avoid}` : ''}

For each name provide:
- **Name**
- One-line explanation of why it works
- Domain availability hint (is it likely .com available?)

Format as a numbered list in markdown.`,
};

export default function NameGeneratorPage() {
  return <PromptTool config={config} />;
}

