'use client';
import PromptTool, { PromptToolConfig } from '@/components/PromptTool';
import { Icon } from '@chakra-ui/react';
import { MdShoppingBag } from 'react-icons/md';

const config: PromptToolConfig = {
  title: 'Product Description',
  description: 'Write compelling product descriptions that convert visitors into buyers.',
  icon: <Icon as={MdShoppingBag} color="white" w="24px" h="24px" />,
  gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  fields: [
    { key: 'productName', label: 'Product Name', placeholder: 'e.g. Wireless Noise-Cancelling Headphones Pro', type: 'input' },
    { key: 'features', label: 'Key Features', placeholder: 'e.g. 30hr battery, Bluetooth 5.0, foldable design, premium sound...', type: 'textarea', rows: 3 },
    { key: 'audience', label: 'Target Audience', placeholder: 'e.g. Music lovers, remote workers, gamers', type: 'input' },
    {
      key: 'tone', label: 'Tone', type: 'select',
      options: [
        { value: 'professional', label: 'Professional' },
        { value: 'enthusiastic', label: 'Enthusiastic' },
        { value: 'luxury / premium', label: 'Luxury / Premium' },
        { value: 'casual and friendly', label: 'Casual & Friendly' },
        { value: 'technical', label: 'Technical' },
      ],
    },
    {
      key: 'length', label: 'Description Length', type: 'select',
      options: [
        { value: 'short (50-80 words)', label: 'Short (50-80 words)' },
        { value: 'medium (100-150 words)', label: 'Medium (100-150 words)' },
        { value: 'long (200-300 words)', label: 'Long (200-300 words)' },
      ],
    },
  ],
  buildPrompt: (v) =>
    `Write a ${v.length || 'medium'} ${v.tone || 'professional'} product description for:

Product: ${v.productName}
Key Features: ${v.features}
Target Audience: ${v.audience || 'general consumers'}

The description should highlight benefits (not just features), create desire, and include a subtle call-to-action. Format with markdown (bold key phrases where appropriate).`,
};

export default function ProductDescriptionPage() {
  return <PromptTool config={config} />;
}

