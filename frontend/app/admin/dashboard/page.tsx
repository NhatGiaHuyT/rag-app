'use client';
import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Heading,
  Text,
  Flex,
  SimpleGrid,
  useColorModeValue,
  Badge,
  VStack,
  HStack,
  Avatar,
  Progress,
  Spinner,
  Center,
  useToast,
} from '@chakra-ui/react';
import {
  MdPeople,
  MdChat,
  MdToken,
  MdSpeed,
  MdTrendingUp,
  MdBarChart,
  MdDescription,
  MdStar,
} from 'react-icons/md';
import Card from '@/components/card/Card';
import StatsCard from '@/components/admin/StatsCard';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<any[]>([]);
  const [conversations, setConversations] = useState<any[]>([]);
  const toast = useToast();

  const textColor = useColorModeValue('navy.700', 'white');
  const secondaryText = useColorModeValue('gray.500', 'gray.400');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');

      // Fetch system stats
      const statsResponse = await fetch('/api/auth/admin/stats', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }

      // Fetch users
      const usersResponse = await fetch('/api/auth/admin/users', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (usersResponse.ok) {
        const usersData = await usersResponse.json();
        setUsers(usersData);
      }

      // Fetch conversations
      const convResponse = await fetch('/api/auth/admin/conversations', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (convResponse.ok) {
        const convData = await convResponse.json();
        setConversations(convData);
      }
    } catch (error) {
      toast({
        title: 'Failed to load dashboard data',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Center h="400px">
        <Spinner size="xl" />
      </Center>
    );
  }

  if (!stats) {
    return (
      <Center h="400px">
        <Text>Failed to load dashboard data</Text>
      </Center>
    );
  }

  // Mock data for charts (since we don't have real time series data yet)
  const mockUsageData = [
    { date: '2024-01-01', tokens: 1200, conversations: 45 },
    { date: '2024-01-02', tokens: 1350, conversations: 52 },
    { date: '2024-01-03', tokens: 1180, conversations: 48 },
    { date: '2024-01-04', tokens: 1420, conversations: 61 },
    { date: '2024-01-05', tokens: 1380, conversations: 55 },
    { date: '2024-01-06', tokens: 1520, conversations: 67 },
    { date: '2024-01-07', tokens: 1480, conversations: 63 },
  ];

  const recentConversations = conversations.slice(0, 5);
  const topUsers = users
    .filter(u => u.role !== 'admin')
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  return (
    <Box pt={{ base: '10px', md: '20px' }}>
      {/* Header */}
      <Flex mb="28px" align="center" justify="space-between" flexWrap="wrap" gap="12px">
        <Box>
          <Heading fontSize="2xl" color={textColor} fontWeight="700">
            Admin Dashboard
          </Heading>
          <Text color={secondaryText} fontSize="sm" mt="4px">
            Overview of your RAG system — {new Date().toLocaleDateString()}
          </Text>
        </Box>
        <Badge colorScheme="green" borderRadius="20px" px="12px" py="4px" fontSize="sm">
          ● System Online
        </Badge>
      </Flex>

      {/* Stats Grid */}
      <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing="20px" mb="28px">
        <StatsCard
          title="Total Users"
          value={stats.total_users}
          change={12.5}
          changeLabel="vs last month"
          icon={<MdPeople />}
          iconBg="linear-gradient(135deg, #868CFF 0%, #4318FF 100%)"
        />
        <StatsCard
          title="Total Conversations"
          value={stats.total_conversations}
          change={8.3}
          changeLabel="vs last month"
          icon={<MdChat />}
          iconBg="linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)"
        />
        <StatsCard
          title="Total Questions"
          value={stats.total_questions}
          change={15.2}
          changeLabel="vs last month"
          icon={<MdDescription />}
          iconBg="linear-gradient(135deg, #43E97B 0%, #38F9D7 100%)"
        />
        <StatsCard
          title="Average Rating"
          value={`${stats.average_rating}/5`}
          change={0.2}
          changeLabel="this month"
          icon={<MdStar />}
          iconBg="linear-gradient(135deg, #FA709A 0%, #FEE140 100%)"
        />
      </SimpleGrid>

      {/* Charts Row */}
      <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap="20px" mb="28px">
        {/* Usage Line Chart */}
        <Card p="24px">
          <Flex align="center" mb="20px" gap="8px">
            <MdTrendingUp color="#4318FF" size="20px" />
            <Text fontSize="lg" fontWeight="700" color={textColor}>
              Activity Overview (Mock Data)
            </Text>
          </Flex>
          <Text>Chart coming soon...</Text>
        </Card>

        {/* Top Users */}
        <Card p="24px">
          <Flex align="center" mb="20px" gap="8px">
            <MdBarChart color="#4318FF" size="20px" />
            <Text fontSize="lg" fontWeight="700" color={textColor}>
              Top Users by Usage
            </Text>
          </Flex>
          <VStack spacing="14px" align="stretch">
            {topUsers.map((user, i) => {
              const maxTokens = topUsers[0]?.tokensUsed || 1;
              const pct = Math.round((user.tokensUsed / maxTokens) * 100);
              return (
                <Box key={user.id}>
                  <Flex align="center" justify="space-between" mb="6px">
                    <HStack spacing="8px">
                      <Avatar name={user.username} size="xs" />
                      <Text fontSize="sm" fontWeight="500" color={textColor} noOfLines={1}>
                        {user.username}
                      </Text>
                    </HStack>
                    <Text fontSize="xs" color={secondaryText}>
                      {new Date(user.created_at).toLocaleDateString()}
                    </Text>
                  </Flex>
                </Box>
              );
            })}
          </VStack>
        </Card>
      </Grid>

      {/* Recent Conversations */}
      <Card p="24px">
        <Flex align="center" mb="20px" gap="8px">
          <MdChat color="#4318FF" size="20px" />
          <Text fontSize="lg" fontWeight="700" color={textColor}>
            Recent Conversations
          </Text>
        </Flex>
        <VStack spacing="12px" align="stretch">
          {recentConversations.map((conv) => (
            <Box key={conv.id} p="12px" borderRadius="md" bg="gray.50" _dark={{ bg: 'gray.700' }}>
              <Flex justify="space-between" align="start">
                <VStack align="start" spacing="4px" flex={1}>
                  <Text fontSize="sm" fontWeight="600" color={textColor} noOfLines={2}>
                    {conv.title}
                  </Text>
                  <Text fontSize="xs" color={secondaryText}>
                    Updated: {new Date(conv.updated_at).toLocaleString()}
                  </Text>
                </VStack>
              </Flex>
            </Box>
          ))}
        </VStack>
      </Card>
    </Box>
  );
}

