'use client';
import {
  Box,
  Heading,
  Text,
  Flex,
  Grid,
  useColorModeValue,
  Select,
  HStack,
} from '@chakra-ui/react';
import { MdTrendingUp, MdPeople, MdBarChart } from 'react-icons/md';
import Card from '@/components/card/Card';
import { AdminLineChart, AdminBarChart } from '@/components/admin/Charts';
import { mockUsageData } from '@/utils/adminData';
import { useState } from 'react';

export default function AnalyticsPage() {
  const textColor = useColorModeValue('navy.700', 'white');
  const secondaryText = useColorModeValue('gray.500', 'gray.400');
  const [range, setRange] = useState('15');

  const data = mockUsageData.slice(-parseInt(range));

  const totalTokens = data.reduce((s, d) => s + d.tokens, 0);
  const totalConversations = data.reduce((s, d) => s + d.conversations, 0);
  const avgUsers = Math.round(data.reduce((s, d) => s + d.users, 0) / data.length);

  return (
    <Box pt={{ base: '10px', md: '20px' }}>
      <Flex mb="28px" align="center" justify="space-between" flexWrap="wrap" gap="12px">
        <Box>
          <Heading fontSize="2xl" color={textColor} fontWeight="700">
            Analytics & Usage
          </Heading>
          <Text color={secondaryText} fontSize="sm" mt="4px">
            Detailed insights into platform activity
          </Text>
        </Box>
        <HStack>
          <Text fontSize="sm" color={secondaryText}>Period:</Text>
          <Select
            maxW="160px"
            borderRadius="10px"
            size="sm"
            value={range}
            onChange={(e) => setRange(e.target.value)}
          >
            <option value="7">Last 7 days</option>
            <option value="10">Last 10 days</option>
            <option value="15">Last 15 days</option>
          </Select>
        </HStack>
      </Flex>

      {/* Summary Cards */}
      <Grid templateColumns={{ base: '1fr', sm: 'repeat(3, 1fr)' }} gap="20px" mb="28px">
        <Card p="20px">
          <Flex align="center" gap="12px">
            <Flex
              w="48px" h="48px" borderRadius="12px"
              bg="linear-gradient(135deg, #868CFF 0%, #4318FF 100%)"
              align="center" justify="center" flexShrink={0}
            >
              <MdTrendingUp color="white" size="22px" />
            </Flex>
            <Box>
              <Text fontSize="xs" color={secondaryText} fontWeight="500">Total Tokens</Text>
              <Text fontSize="xl" fontWeight="700" color={textColor}>
                {(totalTokens / 1000).toFixed(0)}K
              </Text>
            </Box>
          </Flex>
        </Card>
        <Card p="20px">
          <Flex align="center" gap="12px">
            <Flex
              w="48px" h="48px" borderRadius="12px"
              bg="linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)"
              align="center" justify="center" flexShrink={0}
            >
              <MdBarChart color="white" size="22px" />
            </Flex>
            <Box>
              <Text fontSize="xs" color={secondaryText} fontWeight="500">Conversations</Text>
              <Text fontSize="xl" fontWeight="700" color={textColor}>{totalConversations}</Text>
            </Box>
          </Flex>
        </Card>
        <Card p="20px">
          <Flex align="center" gap="12px">
            <Flex
              w="48px" h="48px" borderRadius="12px"
              bg="linear-gradient(135deg, #43E97B 0%, #38F9D7 100%)"
              align="center" justify="center" flexShrink={0}
            >
              <MdPeople color="white" size="22px" />
            </Flex>
            <Box>
              <Text fontSize="xs" color={secondaryText} fontWeight="500">Avg Daily Users</Text>
              <Text fontSize="xl" fontWeight="700" color={textColor}>{avgUsers}</Text>
            </Box>
          </Flex>
        </Card>
      </Grid>

      {/* Token Usage Chart */}
      <Card p="24px" mb="20px">
        <Text fontSize="lg" fontWeight="700" color={textColor} mb="20px">
          Token Usage Over Time
        </Text>
        <AdminLineChart
          data={data}
          dataKeys={[
            { key: 'tokens', color: '#4318FF', name: 'Tokens Used' },
          ]}
          height={280}
        />
      </Card>

      {/* Conversations & Users Charts */}
      <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap="20px">
        <Card p="24px">
          <Text fontSize="lg" fontWeight="700" color={textColor} mb="20px">
            Daily Conversations
          </Text>
          <AdminBarChart
            data={data}
            dataKeys={[
              { key: 'conversations', color: '#00F2FE', name: 'Conversations' },
            ]}
            height={240}
          />
        </Card>
        <Card p="24px">
          <Text fontSize="lg" fontWeight="700" color={textColor} mb="20px">
            Active Users per Day
          </Text>
          <AdminBarChart
            data={data}
            dataKeys={[
              { key: 'users', color: '#43E97B', name: 'Active Users' },
            ]}
            height={240}
          />
        </Card>
      </Grid>
    </Box>
  );
}

