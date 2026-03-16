'use client';
import PromptTool, { PromptToolConfig } from '@/components/PromptTool';
import { Icon } from '@chakra-ui/react';
import { MdSearch } from 'react-icons/md';

const config: PromptToolConfig = {
  title: 'SEO Keywords',
  description: 'Research and generate high-impact SEO keywords to drive organic traffic.',
  icon: <Icon as={MdSearch} color="white" w="24px" h="24px" />,
  gradient: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
  fields: [
    { key: 'topic', label: 'Main Topic / Niche', placeholder: 'e.g. Vegan meal prep for busy professionals', type: 'input' },
    { key: 'industry', label: 'Industry / Business Type', placeholder: 'e.g. Health & fitness blog, E-commerce store', type: 'input' },
    {
      key: 'type', label: 'Keyword Type', type: 'select',
      options: [
        { value: 'mixed (short + long-tail)', label: 'Mixed (Short + Long-tail)' },
        { value: 'short-tail (1-2 words)', label: 'Short-tail (1-2 words)' },
        { value: 'long-tail (3-5 words)', label: 'Long-tail (3-5 words)' },
        { value: 'question-based', label: 'Question-based (how, what, why)' },
        { value: 'buyer-intent', label: 'Buyer Intent (best, buy, review)' },
      ],
    },
    {
      key: 'count', label: 'Number of Keywords', type: 'select',
      options: [
        { value: '10', label: '10 keywords' },
        { value: '20', label: '20 keywords' },
        { value: '30', label: '30 keywords' },
        { value: '50', label: '50 keywords' },
      ],
    },
    { key: 'competitor', label: 'Competitor Website (optional)', placeholder: 'e.g. healthline.com, nytimes.com', type: 'input', required: false },
  ],
  buildPrompt: (v) =>
    `Generate ${v.count || '20'} ${v.type || 'mixed'} SEO keywords for:

Topic: ${v.topic}
Industry: ${v.industry}
${v.competitor ? `Competing with: ${v.competitor}` : ''}

For each keyword provide:
- **Keyword**
- Search Intent (informational / navigational / commercial / transactional)
- Estimated difficulty (Low / Medium / High)
- Content idea suggestion

Format as a markdown table, then provide a summary of the best 5 keywords to target first.`,
};

export default function SeoKeywordsPage() {
  return <PromptTool config={config} />;
}

