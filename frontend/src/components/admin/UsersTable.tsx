'use client';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Avatar,
  Text,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  useColorModeValue,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useToast,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { MdMoreVert, MdBlock, MdCheckCircle, MdDelete } from 'react-icons/md';
import { AdminUser } from '@/types/types';
import { useState } from 'react';

interface UsersTableProps {
  users: AdminUser[];
}

const roleColors: Record<AdminUser['role'], string> = {
  admin: 'purple',
  moderator: 'blue',
  user: 'gray',
};

const statusColors: Record<AdminUser['status'], string> = {
  active: 'green',
  inactive: 'yellow',
  suspended: 'red',
};

export default function UsersTable({ users: initialUsers }: UsersTableProps) {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const toast = useToast();

  const textColor = useColorModeValue('navy.700', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
  const secondaryText = useColorModeValue('gray.500', 'gray.400');

  const filtered = users.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    const matchStatus = statusFilter === 'all' || u.status === statusFilter;
    return matchSearch && matchRole && matchStatus;
  });

  const handleStatusChange = (
    userId: string,
    newStatus: AdminUser['status'],
  ) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u)),
    );
    toast({
      title: 'User updated',
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
  };

  const handleDelete = (userId: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    toast({
      title: 'User removed',
      status: 'info',
      duration: 2000,
      isClosable: true,
    });
  };

  return (
    <Box>
      {/* Filters */}
      <Flex gap="12px" mb="20px" flexWrap="wrap">
        <InputGroup maxW="300px">
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.400" />
          </InputLeftElement>
          <Input
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            borderRadius="10px"
          />
        </InputGroup>
        <Select
          maxW="160px"
          borderRadius="10px"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="all">All Roles</option>
          <option value="admin">Admin</option>
          <option value="moderator">Moderator</option>
          <option value="user">User</option>
        </Select>
        <Select
          maxW="160px"
          borderRadius="10px"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="suspended">Suspended</option>
        </Select>
        <Text
          ms="auto"
          color={secondaryText}
          fontSize="sm"
          alignSelf="center"
        >
          {filtered.length} user{filtered.length !== 1 ? 's' : ''}
        </Text>
      </Flex>

      {/* Table */}
      <Box overflowX="auto">
        <Table variant="simple" size="sm">
          <Thead>
            <Tr>
              <Th borderColor={borderColor} color={secondaryText}>User</Th>
              <Th borderColor={borderColor} color={secondaryText}>Role</Th>
              <Th borderColor={borderColor} color={secondaryText}>Status</Th>
              <Th borderColor={borderColor} color={secondaryText} isNumeric>Chats</Th>
              <Th borderColor={borderColor} color={secondaryText} isNumeric>Tokens</Th>
              <Th borderColor={borderColor} color={secondaryText}>Last Active</Th>
              <Th borderColor={borderColor} color={secondaryText}>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filtered.map((user) => (
              <Tr key={user.id} _hover={{ bg: useColorModeValue('gray.50', 'whiteAlpha.50') }}>
                <Td borderColor={borderColor}>
                  <Flex align="center" gap="10px">
                    <Avatar src={user.avatar} name={user.name} size="sm" />
                    <Box>
                      <Text fontSize="sm" fontWeight="600" color={textColor}>
                        {user.name}
                      </Text>
                      <Text fontSize="xs" color={secondaryText}>
                        {user.email}
                      </Text>
                    </Box>
                  </Flex>
                </Td>
                <Td borderColor={borderColor}>
                  <Badge
                    colorScheme={roleColors[user.role]}
                    borderRadius="8px"
                    px="8px"
                    textTransform="capitalize"
                  >
                    {user.role}
                  </Badge>
                </Td>
                <Td borderColor={borderColor}>
                  <Badge
                    colorScheme={statusColors[user.status]}
                    borderRadius="8px"
                    px="8px"
                    textTransform="capitalize"
                  >
                    {user.status}
                  </Badge>
                </Td>
                <Td borderColor={borderColor} isNumeric>
                  <Text fontSize="sm" color={textColor}>{user.totalChats}</Text>
                </Td>
                <Td borderColor={borderColor} isNumeric>
                  <Text fontSize="sm" color={textColor}>{user.tokensUsed.toLocaleString()}</Text>
                </Td>
                <Td borderColor={borderColor}>
                  <Text fontSize="sm" color={secondaryText}>{user.lastActive}</Text>
                </Td>
                <Td borderColor={borderColor}>
                  <Menu>
                    <MenuButton
                      as={IconButton}
                      icon={<MdMoreVert />}
                      variant="ghost"
                      size="sm"
                      aria-label="Actions"
                    />
                    <MenuList>
                      {user.status !== 'active' && (
                        <MenuItem
                          icon={<MdCheckCircle />}
                          onClick={() => handleStatusChange(user.id, 'active')}
                        >
                          Activate
                        </MenuItem>
                      )}
                      {user.status !== 'suspended' && (
                        <MenuItem
                          icon={<MdBlock />}
                          onClick={() => handleStatusChange(user.id, 'suspended')}
                          color="red.400"
                        >
                          Suspend
                        </MenuItem>
                      )}
                      <MenuItem
                        icon={<MdDelete />}
                        onClick={() => handleDelete(user.id)}
                        color="red.400"
                      >
                        Delete
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
        {filtered.length === 0 && (
          <Flex justify="center" py="40px">
            <Text color={secondaryText}>No users found</Text>
          </Flex>
        )}
      </Box>
    </Box>
  );
}



