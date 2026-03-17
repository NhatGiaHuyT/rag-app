'use client';
import {
  Box,
  Heading,
  Text,
  Flex,
  SimpleGrid,
  useColorModeValue,
  Spinner,
  Center,
} from '@chakra-ui/react';
import { MdChat, MdToken, MdTimer, MdBolt } from 'react-icons/md';
import Card from '@/components/card/Card';
import StatsCard from '@/components/admin/StatsCard';
import ChatLogTable from '@/components/admin/ChatLogTable';
import { useState, useEffect } from 'react';
import { OpenAIModel } from '@/types/types';

interface Conversation {
  id: number;
  title: string;
  created_at: string;
  updated_at: string;
}

interface Message {
  id: number;
  role: string;
  content: string;
  created_at: string;
  rating?: number;
  feedback?: string;
  is_manual: boolean;
}

interface ChatLog {
  id: string;
  userId: string;
  userName: string;
  model: OpenAIModel;
  prompt: string;
  response: string;
  tokensUsed: number;
  timestamp: string;
  duration: number;
}

export default function ChatHistoryPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [chatLogs, setChatLogs] = useState<ChatLog[]>([]);
  const [loading, setLoading] = useState(true);
  const textColor = useColorModeValue('navy.700', 'white');
  const secondaryText = useColorModeValue('gray.500', 'gray.400');

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/auth/admin/conversations', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setConversations(data);
        await fetchAllMessages(data);
      }
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
    }
    setLoading(false);
  };

  const fetchAllMessages = async (convs: Conversation[]) => {
    const logs: ChatLog[] = [];
    for (const conv of convs) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/auth/admin/conversations/${conv.id}/messages`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const messages: Message[] = await response.json();
          // Group messages into user-assistant pairs
          for (let i = 0; i < messages.length; i += 2) {
            const userMsg = messages[i];
            const assistantMsg = messages[i + 1];
            if (userMsg && userMsg.role === 'user' && assistantMsg && assistantMsg.role === 'assistant') {
              logs.push({
                id: `${conv.id}-${userMsg.id}`,
                userId: conv.id.toString(),
                userName: `User ${conv.id}`,
                model: 'RAG Model',
                prompt: userMsg.content,
                response: assistantMsg.content,
                tokensUsed: Math.floor((userMsg.content.length + assistantMsg.content.length) / 4), // rough estimate
                timestamp: userMsg.created_at,
                duration: 1000, // placeholder
              });
            }
          }
        }
      } catch (error) {
        console.error(`Failed to fetch messages for conversation ${conv.id}:`, error);
      }
    }
    setChatLogs(logs);
  };

  if (loading) {
    return (
      <Center h="400px">
        <Spinner size="xl" />
      </Center>
    );
  }

  const totalTokens = chatLogs.reduce((s, l) => s + l.tokensUsed, 0);
  const avgDuration = chatLogs.length > 0 ? Math.round(
    chatLogs.reduce((s, l) => s + l.duration, 0) / chatLogs.length,
  ) : 0;
  const gpt4Count = chatLogs.filter((l) => l.model === 'RAG Model').length;

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
          value={chatLogs.length}
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
        <ChatLogTable logs={chatLogs} />
      </Card>
    </Box>
  );
}

