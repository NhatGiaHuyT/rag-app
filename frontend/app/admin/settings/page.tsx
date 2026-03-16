'use client';
import {
  Box,
  Heading,
  Text,
  Flex,
  useColorModeValue,
} from '@chakra-ui/react';
import Card from '@/components/card/Card';
import SettingsForm from '@/components/admin/SettingsForm';
import { defaultAdminSettings } from '@/utils/adminData';

export default function SettingsPage() {
  const textColor = useColorModeValue('navy.700', 'white');
  const secondaryText = useColorModeValue('gray.500', 'gray.400');

  return (
    <Box pt={{ base: '10px', md: '20px' }}>
      <Flex mb="28px" align="center" justify="space-between" flexWrap="wrap" gap="12px">
        <Box>
          <Heading fontSize="2xl" color={textColor} fontWeight="700">
            Platform Settings
          </Heading>
          <Text color={secondaryText} fontSize="sm" mt="4px">
            Configure AI model behavior, rate limits, and more
          </Text>
        </Box>
      </Flex>

      <Card p="24px" maxW="780px">
        <SettingsForm settings={defaultAdminSettings} />
      </Card>
    </Box>
  );
}

