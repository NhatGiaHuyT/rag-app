'use client';
import PromptTool, { PromptToolConfig } from '@/components/PromptTool';
import { Icon } from '@chakra-ui/react';
import { MdStar } from 'react-icons/md';

const config: PromptToolConfig = {
  title: 'Review Responder',
  description: 'Generate professional, empathetic responses to customer reviews.',
  icon: <Icon as={MdStar} color="white" w="24px" h="24px" />,
  gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
  fields: [
    { key: 'review', label: 'Customer Review', placeholder: 'Paste the customer review here...', type: 'textarea', rows: 4 },
    { key: 'business', label: 'Business Name', placeholder: 'e.g. The Coffee Corner, TechSupport Pro', type: 'input' },
    {
      key: 'rating', label: 'Review Rating', type: 'select',
      options: [
        { value: '5 stars (positive)', label: '⭐⭐⭐⭐⭐ 5 Stars (Positive)' },
        { value: '4 stars (mostly positive)', label: '⭐⭐⭐⭐ 4 Stars (Mostly Positive)' },
        { value: '3 stars (mixed)', label: '⭐⭐⭐ 3 Stars (Mixed)' },
        { value: '2 stars (negative)', label: '⭐⭐ 2 Stars (Negative)' },
        { value: '1 star (very negative)', label: '⭐ 1 Star (Very Negative)' },
      ],
    },
    {
      key: 'tone', label: 'Response Tone', type: 'select',
      options: [
        { value: 'professional and empathetic', label: 'Professional & Empathetic' },
        { value: 'formal', label: 'Formal' },
        { value: 'warm and personal', label: 'Warm & Personal' },
        { value: 'apologetic and solution-focused', label: 'Apologetic & Solution-focused' },
      ],
    },
    { key: 'context', label: 'Additional Context (optional)', placeholder: 'e.g. The issue was resolved, we offer a refund, this is for Google Maps...', type: 'textarea', rows: 2, required: false },
  ],
  buildPrompt: (v) =>
    `Write a ${v.tone || 'professional and empathetic'} response to this ${v.rating || ''} customer review for "${v.business}".

Customer Review:
"""
${v.review}
"""
${v.context ? `\nContext: ${v.context}` : ''}

Requirements:
- Thank the customer (adapt based on rating)
- Address specific points mentioned in the review
- If negative: acknowledge issue, apologize sincerely, offer a solution
- If positive: express genuine gratitude, reinforce their experience
- Keep it concise (50-100 words)
- End with an invitation to return or contact

Also provide a **shorter version** (under 50 words) as an alternative.`,
};

export default function ReviewResponderPage() {
  return <PromptTool config={config} />;
}

