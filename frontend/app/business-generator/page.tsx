'use client';
import PromptTool, { PromptToolConfig } from '@/components/PromptTool';
import { Icon } from '@chakra-ui/react';
import { MdBusiness } from 'react-icons/md';

const config: PromptToolConfig = {
  title: 'Business Idea Generator',
  description: 'Generate validated business ideas tailored to your skills, budget, and market.',
  icon: <Icon as={MdBusiness} color="white" w="24px" h="24px" />,
  gradient: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
  fields: [
    { key: 'industry', label: 'Industry / Domain of Interest', placeholder: 'e.g. EdTech, Healthcare, Sustainability, E-commerce', type: 'input' },
    {
      key: 'budget', label: 'Startup Budget', type: 'select',
      options: [
        { value: 'zero (bootstrapped / no-code)', label: 'Zero / Bootstrapped' },
        { value: 'low ($500 - $5,000)', label: 'Low ($500 - $5,000)' },
        { value: 'medium ($5,000 - $50,000)', label: 'Medium ($5k - $50k)' },
        { value: 'high ($50,000+)', label: 'High ($50k+)' },
      ],
    },
    { key: 'skills', label: 'Your Key Skills', placeholder: 'e.g. Programming, Marketing, Design, Teaching, Sales...', type: 'input' },
    { key: 'market', label: 'Target Market', placeholder: 'e.g. Gen Z, remote workers, small businesses, parents', type: 'input' },
    { key: 'problem', label: 'Problem You Want to Solve (optional)', placeholder: 'e.g. People waste too much food, students struggle to find tutors...', type: 'textarea', rows: 2, required: false },
  ],
  buildPrompt: (v) =>
    `Generate 5 detailed business ideas based on the following criteria:

Industry: ${v.industry}
Budget: ${v.budget || 'low'}
Skills: ${v.skills}
Target Market: ${v.market}
${v.problem ? `Problem to solve: ${v.problem}` : ''}

For each business idea provide:
1. **Business Name** (suggested)
2. **Concept** (2-3 sentences explaining what it is)
3. **Revenue Model** (how it makes money)
4. **Startup Steps** (3-4 first steps to launch)
5. **Estimated Time to First Revenue**
6. **Risk Level** (Low / Medium / High) with brief reason

Format nicely in markdown. Focus on practical, achievable ideas.`,
};

export default function BusinessGeneratorPage() {
  return <PromptTool config={config} />;
}

