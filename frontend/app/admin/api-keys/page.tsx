'use client';
import {
  Box,
  Heading,
  Text,
  Flex,
  SimpleGrid,
  useColorModeValue,
} from '@chakra-ui/react';
import { MdKey, MdCheckCircle, MdBlock, MdSend } from 'react-icons/md';
import Card from '@/components/card/Card';
import StatsCard from '@/components/admin/StatsCard';
import ApiKeyManager from '@/components/admin/ApiKeyManager';
import { mockApiKeys } from '@/utils/adminData';

export default function ApiKeysPage() {
  const textColor = useColorModeValue('navy.700', 'white');
  const secondaryText = useColorModeValue('gray.500', 'gray.400');

  const activeKeys = mockApiKeys.filter((k) => k.status === 'active').length;
  const revokedKeys = mockApiKeys.filter((k) => k.status === 'revoked').length;
  const totalRequests = mockApiKeys.reduce((s, k) => s + k.totalRequests, 0);

  return (
    <Box pt={{ base: '10px', md: '20px' }}>
      <Flex mb="28px" align="center" justify="space-between" flexWrap="wrap" gap="12px">
        <Box>
          <Heading fontSize="2xl" color={textColor} fontWeight="700">
            API Key Management
          </Heading>
          <Text color={secondaryText} fontSize="sm" mt="4px">
            Manage and monitor your OpenAI API keys
          </Text>
        </Box>
      </Flex>

      <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing="20px" mb="28px">
        <StatsCard
          title="Total Keys"
          value={mockApiKeys.length}
          icon={<MdKey />}
          iconBg="linear-gradient(135deg, #868CFF 0%, #4318FF 100%)"
        />
        <StatsCard
          title="Active Keys"
          value={activeKeys}
          icon={<MdCheckCircle />}
          iconBg="linear-gradient(135deg, #43E97B 0%, #38F9D7 100%)"
        />
        <StatsCard
          title="Revoked Keys"
          value={revokedKeys}
          icon={<MdBlock />}
          iconBg="linear-gradient(135deg, #FA709A 0%, #FEE140 100%)"
        />
        <StatsCard
          title="Total Requests"
          value={totalRequests.toLocaleString()}
          change={23.4}
          icon={<MdSend />}
          iconBg="linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)"
        />
      </SimpleGrid>

      <Card p="24px">
        <Text fontSize="lg" fontWeight="700" color={textColor} mb="20px">
          API Keys
        </Text>
        <ApiKeyManager apiKeys={mockApiKeys} />
      </Card>
    </Box>
  );
}

