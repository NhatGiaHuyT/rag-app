'use client';
import {
  Box,
  Heading,
  Text,
  Flex,
  SimpleGrid,
  useColorModeValue,
} from '@chakra-ui/react';
import { MdChat, MdToken, MdTimer, MdBolt } from 'react-icons/md';
import Card from '@/components/card/Card';
import StatsCard from '@/components/admin/StatsCard';
import ChatLogTable from '@/components/admin/ChatLogTable';
import { mockChatLogs } from '@/utils/adminData';

export default function ChatHistoryPage() {
  const textColor = useColorModeValue('navy.700', 'white');
  const secondaryText = useColorModeValue('gray.500', 'gray.400');

  const totalTokens = mockChatLogs.reduce((s, l) => s + l.tokensUsed, 0);
  const avgDuration = Math.round(
    mockChatLogs.reduce((s, l) => s + l.duration, 0) / mockChatLogs.length,
  );
  const gpt4Count = mockChatLogs.filter((l) => l.model === 'gpt-4o').length;

  return (
    <Box pt={{ base: '10px', md: '20px' }}>
      <Flex mb="28px" align="center" justify="space-between" flexWrap="wrap" gap="12px">
        <Box>
          <Heading fontSize="2xl" color={textColor} fontWeight="700">
            Chat History
          </Heading>
          <Text color={secondaryText} fontSize="sm" mt="4px">
            Full log of all conversations on the platform
          </Text>
        </Box>
      </Flex>

      <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing="20px" mb="28px">
        <StatsCard
          title="Total Chats"
          value={mockChatLogs.length}
          change={8.3}
          icon={<MdChat />}
          iconBg="linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)"
        />
        <StatsCard
          title="Total Tokens"
          value={`${(totalTokens / 1000).toFixed(1)}K`}
          change={12.1}
          icon={<MdToken />}
          iconBg="linear-gradient(135deg, #43E97B 0%, #38F9D7 100%)"
        />
        <StatsCard
          title="Avg Response Time"
          value={`${avgDuration}ms`}
          change={-5.4}
          changeLabel="faster"
          icon={<MdTimer />}
          iconBg="linear-gradient(135deg, #868CFF 0%, #4318FF 100%)"
        />
        <StatsCard
          title="GPT-4o Chats"
          value={gpt4Count}
          icon={<MdBolt />}
          iconBg="linear-gradient(135deg, #FA709A 0%, #FEE140 100%)"
        />
      </SimpleGrid>

      <Card p="24px">
        <Text fontSize="lg" fontWeight="700" color={textColor} mb="20px">
          Conversation Logs
        </Text>
        <ChatLogTable logs={mockChatLogs} />
      </Card>
    </Box>
  );
}

