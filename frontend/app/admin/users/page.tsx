'use client';
import {
  Box, Heading, Text, Flex, useColorModeValue, Button, Input, useToast, Spinner, Center, Table, Thead, Tbody, Tr, Th, Td, IconButton, Menu, MenuButton, MenuList, MenuItem, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, FormControl, FormLabel, useDisclosure
} from '@chakra-ui/react';
import { MdAdd, MdDelete, MdEdit, MdMoreVert } from 'react-icons/md';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  is_active: boolean;
  created_at: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const { isAdmin } = useAuth();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const textColor = useColorModeValue('navy.700', 'white');
  const secondaryText = useColorModeValue('gray.500', 'gray.400');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/auth/admin/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch {}
    setLoading(false);
  };

  const deleteUser = async (id: number) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`/api/auth/admin/users/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      fetchUsers();
      toast({ title: 'User deleted', status: 'success' });
    } catch {
      toast({ title: 'Delete failed', status: 'error' });
    }
  };

  const saveUser = async (userData: any) => {
    const token = localStorage.getItem('token');
    const method = editingUser ? 'PUT' : 'POST';
    const url = editingUser ? `/api/auth/admin/users/${editingUser.id}` : '/api/auth/admin/users';
    try {
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(userData),
      });
      fetchUsers();
      toast({ title: editingUser ? 'User updated' : 'User created', status: 'success' });
      onClose();
    } catch {
      toast({ title: 'Save failed', status: 'error' });
    }
  };

  if (loading) return <Center h="400px"><Spinner /></Center>;
  if (!isAdmin) return <Text>Admin only</Text>;

  return (
    <Box pt="20px">
      <Flex mb="28px" justify="space-between">
        <Heading color={textColor}>Users</Heading>
        <Button leftIcon={<MdAdd />} onClick={onOpen}>Add User</Button>
      </Flex>

      <Table>
        <Thead>
          <Tr><Th>Username</Th><Th>Email</Th><Th>Role</Th><Th>Active</Th><Th>Actions</Th></Tr>
        </Thead>
        <Tbody>
          {users.map((user) => (
            <Tr key={user.id}>
              <Td>{user.username}</Td>
              <Td>{user.email}</Td>
              <Td>{user.role}</Td>
              <Td>{user.is_active ? 'Yes' : 'No'}</Td>
              <Td>
                <Menu>
                  <MenuButton as={IconButton} icon={<MdMoreVert />}>
                  </MenuButton>
                  <MenuList>
                    <MenuItem icon={<MdEdit />} onClick={() => { setEditingUser(user); onOpen(); }}>
                      Edit
                    </MenuItem>
                    <MenuItem icon={<MdDelete />} onClick={() => deleteUser(user.id)} color="red.500">
                      Delete
                    </MenuItem>
                  </MenuList>
                </Menu>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{editingUser ? 'Edit User' : 'Add User'}</ModalHeader>
          <ModalBody>
            <FormControl><FormLabel>Username</FormLabel><Input value={editingUser?.username || ''} onChange={(e) => setEditingUser({ ...editingUser!, username: e.target.value } as User)} /></FormControl>
            <FormControl mt="4"><FormLabel>Email</FormLabel><Input value={editingUser?.email || ''} onChange={(e) => setEditingUser({ ...editingUser!, email: e.target.value } as User)} /></FormControl>
            <FormControl mt="4"><FormLabel>Password</FormLabel><Input type="password" placeholder="Leave blank to keep current" /></FormControl>
            <FormControl mt="4"><FormLabel>Role</FormLabel><Input value={editingUser?.role || ''} onChange={(e) => setEditingUser({ ...editingUser!, role: e.target.value } as User)} /></FormControl>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose} mr="3">Cancel</Button>
            <Button onClick={() => saveUser(editingUser || { username: '', email: '', password: '', role: 'user' })}>Save</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

