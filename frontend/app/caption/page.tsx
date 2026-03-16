'use client';
import PromptTool, { PromptToolConfig } from '@/components/PromptTool';
import { Icon } from '@chakra-ui/react';
import { MdCameraAlt } from 'react-icons/md';

const config: PromptToolConfig = {
  title: 'Instagram Caption',
  description: 'Generate engaging Instagram captions with hashtags that boost reach.',
  icon: <Icon as={MdCameraAlt} color="white" w="24px" h="24px" />,
  gradient: 'linear-gradient(135deg, #f77062 0%, #fe5196 100%)',
  fields: [
    { key: 'description', label: 'Describe Your Photo / Post', placeholder: 'e.g. Sunset at the beach, golden hour, solo travel...', type: 'textarea', rows: 3 },
    { key: 'brand', label: 'Your Brand / Account Name (optional)', placeholder: 'e.g. @travelwithjane, FoodieCorner', type: 'input', required: false },
    {
      key: 'tone', label: 'Caption Tone', type: 'select',
      options: [
        { value: 'inspirational', label: 'Inspirational' },
        { value: 'funny and witty', label: 'Funny & Witty' },
        { value: 'casual and relatable', label: 'Casual & Relatable' },
        { value: 'professional', label: 'Professional' },
        { value: 'emotional / heartfelt', label: 'Emotional / Heartfelt' },
        { value: 'educational', label: 'Educational' },
      ],
    },
    {
      key: 'hashtags', label: 'Number of Hashtags', type: 'select',
      options: [
        { value: '5', label: '5 hashtags' },
        { value: '10', label: '10 hashtags' },
        { value: '15', label: '15 hashtags' },
        { value: '20', label: '20 hashtags' },
        { value: '30', label: '30 hashtags (maximum reach)' },
      ],
    },
    { key: 'cta', label: 'Call-to-Action (optional)', placeholder: 'e.g. Follow for more, Save this post, Drop a 🔥', type: 'input', required: false },
  ],
  buildPrompt: (v) =>
    `Write an Instagram caption for the following:

Post description: ${v.description}
${v.brand ? `Account/Brand: ${v.brand}` : ''}
Tone: ${v.tone || 'casual and relatable'}
${v.cta ? `Include this CTA: ${v.cta}` : ''}

Provide:
1. **Caption** (engaging, ${v.tone || 'casual'} tone, with emojis)
2. **${v.hashtags || '15'} relevant hashtags** (mix of popular and niche)

The caption should feel authentic and stop the scroll.`,
};

export default function CaptionPage() {
  return <PromptTool config={config} />;
}

