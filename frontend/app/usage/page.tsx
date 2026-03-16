'use client';
import {
  Box, Flex, Heading, Text, Icon, useColorModeValue,
  SimpleGrid, Stat, StatLabel, StatNumber, StatHelpText,
  Progress, VStack, HStack,
} from '@chakra-ui/react';
import { MdInsights, MdToken, MdChat, MdAutoAwesome, MdBolt } from 'react-icons/md';
import { useEffect, useState } from 'react';
import { getUsageStats } from '@/utils/storage';
interface UsageStats {
  totalTokens: number;
  totalRequests: number;
  byModel: Record<string, number>;
  byTool: Record<string, number>;
  days: { date: string; tokens: number; requests: number }[];
}
const FREE_LIMIT = 10000;
export default function UsagePage() {
  const [stats, setStats] = useState<UsageStats>({
    totalTokens: 0, totalRequests: 0, byModel: {}, byTool: {}, days: [],
  });
  const textColor = useColorModeValue('navy.700', 'white');
  const subText = useColorModeValue('gray.500', 'gray.400');
  const cardBg = useColorModeValue('white', 'navy.800');
  const sectionBg = useColorModeValue('gray.50', 'navy.900');
  const barBg = useColorModeValue('gray.100', 'whiteAlpha.100');
  const barColor = 'brand.500';
  useEffect(() => { setStats(getUsageStats()); }, []);
  const usedPct = Math.min((stats.totalTokens / FREE_LIMIT) * 100, 100);
  const topTools = Object.entries(stats.byTool).sort((a, b) => b[1] - a[1]).slice(0, 6);
  const maxDayTokens = Math.max(...stats.days.map((d) => d.tokens), 1);
  return (
    <Box pt={{ base: '10px', md: '20px' }}>
      <Flex align="center" gap="12px" mb="28px">
        <Flex w="44px" h="44px" borderRadius="12px" bg="linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)" align="center" justify="center">
          <Icon as={MdInsights} color="white" w="22px" h="22px" />
        </Flex>
        <Box>
          <Heading fontSize={{ base: 'xl', md: '2xl' }} color={textColor} fontWeight="700">Usage</Heading>
          <Text color={subText} fontSize="sm">Your API usage statistics (estimated from local history).</Text>
        </Box>
      </Flex>
      <SimpleGrid columns={{ base: 1, md: 2, xl: 4 }} spacing="16px" mb="24px">
        {[
          { label: 'Total Requests', value: stats.totalRequests, icon: MdChat, color: '#667eea' },
          { label: 'Tokens Used', value: stats.totalTokens.toLocaleString(), icon: MdToken, color: '#43e97b' },
          { label: 'GPT-4o Calls', value: stats.byModel['gpt-4o'] || 0, icon: MdAutoAwesome, color: '#f093fb' },
          { label: 'GPT-3.5 Calls', value: stats.byModel['gpt-3.5-turbo'] || 0, icon: MdBolt, color: '#fda085' },
        ].map((s) => (
          <Box key={s.label} bg={cardBg} borderRadius="20px" p="20px" boxShadow="14px 17px 40px 4px rgba(112,144,176,0.08)">
            <Flex justify="space-between" align="center" mb="10px">
              <Text fontSize="sm" color={subText} fontWeight="500">{s.label}</Text>
              <Flex w="36px" h="36px" borderRadius="10px" bg={s.color + '22'} align="center" justify="center">
                <Icon as={s.icon} color={s.color} w="18px" h="18px" />
              </Flex>
            </Flex>
            <Stat>
              <StatNumber fontSize="2xl" fontWeight="700" color={textColor}>{s.value}</StatNumber>
              <StatHelpText fontSize="xs" color={subText} mb="0">All time</StatHelpText>
            </Stat>
          </Box>
        ))}
      </SimpleGrid>
      <Flex gap="20px" direction={{ base: 'column', lg: 'row' }} mb="20px">
        {/* Token quota */}
        <Box bg={cardBg} borderRadius="20px" p="24px" boxShadow="14px 17px 40px 4px rgba(112,144,176,0.08)" flex="1">
          <Text fontWeight="700" fontSize="md" color={textColor} mb="16px">Token Usage</Text>
          <Flex justify="space-between" mb="8px">
            <Text fontSize="sm" color={subText}>Used</Text>
            <Text fontSize="sm" fontWeight="600" color={textColor}>{stats.totalTokens.toLocaleString()} / {FREE_LIMIT.toLocaleString()}</Text>
          </Flex>
          <Progress value={usedPct} borderRadius="full" colorScheme={usedPct > 80 ? 'red' : usedPct > 60 ? 'orange' : 'brand'} size="lg" mb="8px" />
          <Text fontSize="xs" color={subText}>{usedPct.toFixed(1)}% of estimated local limit used</Text>
          <Text fontSize="xs" color={subText} mt="4px">Note: Actual costs depend on your OpenAI account plan.</Text>
        </Box>
        {/* Last 7 days */}
        <Box bg={cardBg} borderRadius="20px" p="24px" boxShadow="14px 17px 40px 4px rgba(112,144,176,0.08)" flex="1">
          <Text fontWeight="700" fontSize="md" color={textColor} mb="16px">Last 7 Days</Text>
          <VStack spacing="10px" align="stretch">
            {stats.days.map((d) => (
              <Flex key={d.date} align="center" gap="12px">
                <Text fontSize="xs" color={subText} minW="60px">{new Date(d.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</Text>
                <Box flex="1" bg={barBg} borderRadius="full" h="8px" overflow="hidden">
                  <Box bg={barColor} borderRadius="full" h="100%" w={d.tokens > 0 ? ((d.tokens / maxDayTokens) * 100) + '%' : '0%'} transition="width 0.5s" />
                </Box>
                <Text fontSize="xs" color={subText} minW="50px" textAlign="right">{d.tokens > 0 ? d.tokens.toLocaleString() + ' tk' : '—'}</Text>
              </Flex>
            ))}
          </VStack>
        </Box>
      </Flex>
      {/* By tool */}
      {topTools.length > 0 && (
        <Box bg={cardBg} borderRadius="20px" p="24px" boxShadow="14px 17px 40px 4px rgba(112,144,176,0.08)">
          <Text fontWeight="700" fontSize="md" color={textColor} mb="16px">Usage by Tool</Text>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing="12px">
            {topTools.map(([tool, count]) => (
              <Flex key={tool} align="center" gap="12px" bg={sectionBg} borderRadius="12px" p="12px">
                <Box flex="1">
                  <Text fontSize="sm" fontWeight="600" color={textColor} noOfLines={1}>{tool}</Text>
                  <Text fontSize="xs" color={subText}>{count} {count === 1 ? 'request' : 'requests'}</Text>
                </Box>
                <Progress value={(count / stats.totalRequests) * 100} borderRadius="full" colorScheme="brand" size="sm" w="80px" />
              </Flex>
            ))}
          </SimpleGrid>
        </Box>
      )}
    </Box>
  );
}
