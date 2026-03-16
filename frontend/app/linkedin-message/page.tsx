'use client';
import PromptTool, { PromptToolConfig } from '@/components/PromptTool';
import { Icon } from '@chakra-ui/react';
import { MdPeople } from 'react-icons/md';

const config: PromptToolConfig = {
  title: 'LinkedIn Message',
  description: 'Craft personalized LinkedIn connection requests and outreach messages.',
  icon: <Icon as={MdPeople} color="white" w="24px" h="24px" />,
  gradient: 'linear-gradient(135deg, #0077B5 0%, #00A0DC 100%)',
  fields: [
    { key: 'recipientName', label: "Recipient's Name", placeholder: 'e.g. John Smith', type: 'input' },
    { key: 'recipientRole', label: "Recipient's Role / Company", placeholder: 'e.g. Senior Engineer at Google', type: 'input' },
    {
      key: 'purpose', label: 'Message Purpose', type: 'select',
      options: [
        { value: 'connection request', label: 'Connection Request' },
        { value: 'job opportunity', label: 'Job Opportunity' },
        { value: 'collaboration proposal', label: 'Collaboration Proposal' },
        { value: 'mentorship request', label: 'Mentorship Request' },
        { value: 'sales / business pitch', label: 'Sales / Business Pitch' },
        { value: 'informational interview', label: 'Informational Interview' },
      ],
    },
    { key: 'senderBackground', label: 'Your Background (brief)', placeholder: 'e.g. Full-stack developer with 5 years experience in React and Node.js', type: 'textarea', rows: 2 },
    { key: 'commonGround', label: 'Common Ground / Why Them (optional)', placeholder: 'e.g. I saw your talk on AI, we both worked at startup X...', type: 'textarea', rows: 2, required: false },
  ],
  buildPrompt: (v) =>
    `Write a personalized LinkedIn message for a ${v.purpose || 'connection request'}.

Recipient: ${v.recipientName} (${v.recipientRole})
My background: ${v.senderBackground}
${v.commonGround ? `Common ground / reason for reaching out: ${v.commonGround}` : ''}

Requirements:
- Keep it concise (under 300 characters for connection note, 100-150 words for InMail)
- Be genuine and personal, avoid sounding like a template
- Clear purpose and subtle call-to-action
- Professional yet conversational tone

Provide 2 variations: one shorter, one slightly longer.`,
};

export default function LinkedInMessagePage() {
  return <PromptTool config={config} />;
}

