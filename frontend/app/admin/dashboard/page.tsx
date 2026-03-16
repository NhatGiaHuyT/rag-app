'use client';
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
} from '@chakra-ui/react';
import {
  MdPeople,
  MdChat,
  MdToken,
  MdSpeed,
  MdTrendingUp,
  MdBarChart,
} from 'react-icons/md';
import Card from '@/components/card/Card';
import StatsCard from '@/components/admin/StatsCard';
import { AdminLineChart } from '@/components/admin/Charts';
import {
  mockUsers,
  mockChatLogs,
  mockUsageData,
  getDashboardStats,
} from '@/utils/adminData';

export default function AdminDashboardPage() {
  const stats = getDashboardStats();
  const textColor = useColorModeValue('navy.700', 'white');
  const secondaryText = useColorModeValue('gray.500', 'gray.400');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');

  const recentLogs = mockChatLogs.slice(0, 5);
  const topUsers = [...mockUsers]
    .sort((a, b) => b.tokensUsed - a.tokensUsed)
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
            Overview of your AI platform — March 15, 2026
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
          value={stats.totalUsers}
          change={12.5}
          changeLabel="vs last month"
          icon={<MdPeople />}
          iconBg="linear-gradient(135deg, #868CFF 0%, #4318FF 100%)"
        />
        <StatsCard
          title="Total Conversations"
          value={stats.totalChats}
          change={8.3}
          changeLabel="vs last month"
          icon={<MdChat />}
          iconBg="linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)"
        />
        <StatsCard
          title="Tokens Used"
          value={`${(stats.totalTokens / 1000).toFixed(1)}K`}
          change={15.2}
          changeLabel="vs last month"
          icon={<MdToken />}
          iconBg="linear-gradient(135deg, #43E97B 0%, #38F9D7 100%)"
        />
        <StatsCard
          title="System Uptime"
          value={stats.uptime}
          change={0.2}
          changeLabel="this month"
          icon={<MdSpeed />}
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
              Token Usage (Last 15 Days)
            </Text>
          </Flex>
          <AdminLineChart
            data={mockUsageData}
            dataKeys={[
              { key: 'tokens', color: '#4318FF', name: 'Tokens' },
              { key: 'conversations', color: '#00F2FE', name: 'Conversations' },
            ]}
          />
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
              const maxTokens = topUsers[0].tokensUsed;
              const pct = Math.round((user.tokensUsed / maxTokens) * 100);
              return (
                <Box key={user.id}>
                  <Flex align="center" justify="space-between" mb="6px">
                    <HStack spacing="8px">
                      <Avatar src={user.avatar} name={user.name} size="xs" />
                      <Text fontSize="sm" fontWeight="500" color={textColor} noOfLines={1}>
                        {user.name}
                      </Text>
                    </HStack>
                    <Text fontSize="xs" color={secondaryText}>
                      {(user.tokensUsed / 1000).toFixed(1)}K
                    </Text>
                  </Flex>
                  <Progress
                    value={pct}
                    size="xs"
                    borderRadius="full"
                    colorScheme={i === 0 ? 'brand' : 'blue'}
                  />
                </Box>
              );
            })}
          </VStack>
        </Card>
      </Grid>

      {/* Recent Activity */}
      <Card p="24px">
        <Text fontSize="lg" fontWeight="700" color={textColor} mb="20px">
          Recent Conversations
        </Text>
        <VStack spacing="0" align="stretch">
          {recentLogs.map((log, i) => (
            <Flex
              key={log.id}
              py="12px"
              align="center"
              gap="12px"
              borderBottom={i < recentLogs.length - 1 ? '1px solid' : 'none'}
              borderColor={borderColor}
            >
              <Avatar name={log.userName} size="sm" />
              <Box flex="1" minW="0">
                <Flex align="center" gap="8px" flexWrap="wrap">
                  <Text fontSize="sm" fontWeight="600" color={textColor}>
                    {log.userName}
                  </Text>
                  <Badge
                    colorScheme={log.model === 'gpt-4o' ? 'purple' : 'blue'}
                    borderRadius="8px"
                    px="6px"
                    fontSize="xs"
                  >
                    {log.model}
                  </Badge>
                </Flex>
                <Text fontSize="sm" color={secondaryText} noOfLines={1}>
                  {log.prompt}
                </Text>
              </Box>
              <Box textAlign="right" flexShrink={0}>
                <Text fontSize="xs" color={secondaryText}>{log.timestamp}</Text>
                <Text fontSize="xs" color="brand.500" fontWeight="600">
                  {log.tokensUsed} tokens
                </Text>
              </Box>
            </Flex>
          ))}
        </VStack>
      </Card>
    </Box>
  );
}

