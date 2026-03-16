'use client';
import {
  Box,
  Heading,
  Text,
  Flex,
  SimpleGrid,
  useColorModeValue,
} from '@chakra-ui/react';
import { MdPeople, MdPersonAdd, MdBlock, MdCheckCircle } from 'react-icons/md';
import Card from '@/components/card/Card';
import StatsCard from '@/components/admin/StatsCard';
import UsersTable from '@/components/admin/UsersTable';
import { mockUsers } from '@/utils/adminData';

export default function UsersPage() {
  const textColor = useColorModeValue('navy.700', 'white');
  const secondaryText = useColorModeValue('gray.500', 'gray.400');

  const activeUsers = mockUsers.filter((u) => u.status === 'active').length;
  const suspendedUsers = mockUsers.filter((u) => u.status === 'suspended').length;

  return (
    <Box pt={{ base: '10px', md: '20px' }}>
      <Flex mb="28px" align="center" justify="space-between" flexWrap="wrap" gap="12px">
        <Box>
          <Heading fontSize="2xl" color={textColor} fontWeight="700">
            User Management
          </Heading>
          <Text color={secondaryText} fontSize="sm" mt="4px">
            Manage all platform users and permissions
          </Text>
        </Box>
      </Flex>

      <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing="20px" mb="28px">
        <StatsCard
          title="Total Users"
          value={mockUsers.length}
          icon={<MdPeople />}
          iconBg="linear-gradient(135deg, #868CFF 0%, #4318FF 100%)"
        />
        <StatsCard
          title="Active Users"
          value={activeUsers}
          icon={<MdCheckCircle />}
          iconBg="linear-gradient(135deg, #43E97B 0%, #38F9D7 100%)"
        />
        <StatsCard
          title="Suspended"
          value={suspendedUsers}
          icon={<MdBlock />}
          iconBg="linear-gradient(135deg, #FA709A 0%, #FEE140 100%)"
        />
        <StatsCard
          title="New This Month"
          value={3}
          change={50}
          icon={<MdPersonAdd />}
          iconBg="linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)"
        />
      </SimpleGrid>

      <Card p="24px">
        <Text fontSize="lg" fontWeight="700" color={textColor} mb="20px">
          All Users
        </Text>
        <UsersTable users={mockUsers} />
      </Card>
    </Box>
  );
}

