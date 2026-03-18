'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  IconButton,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  useToast,
  Spinner,
  Center,
} from '@chakra-ui/react';
import { MdAdd, MdEdit, MdDelete, MdChat } from 'react-icons/md';

interface Conversation {
  id: number;
  title: string;
  created_at: string;
  updated_at: string;
}

interface ConversationSidebarProps {
  onConversationSelect: (conversationId: number | null) => void;
  selectedConversationId: number | null;
  onNewConversation: () => void;
}

export default function ConversationSidebar({
  onConversationSelect,
  selectedConversationId,
  onNewConversation,
}: ConversationSidebarProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [conversationToDelete, setConversationToDelete] = useState<number | null>(null);
  const toast = useToast();

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/auth/conversations', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setConversations(data);
      } else {
        toast({
          title: 'Failed to load conversations',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: 'Error loading conversations',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRename = async (id: number, newTitle: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/auth/conversations/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: newTitle }),
      });
      if (response.ok) {
        await fetchConversations();
        setEditingId(null);
        setEditTitle('');
        toast({
          title: 'Conversation renamed',
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
      } else {
        toast({
          title: 'Failed to rename conversation',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: 'Error renaming conversation',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/auth/conversations/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        await fetchConversations();
        if (selectedConversationId === id) {
          onConversationSelect(null);
        }
        onClose();
        toast({
          title: 'Conversation deleted',
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
      } else {
        toast({
          title: 'Failed to delete conversation',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: 'Error deleting conversation',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const startEdit = (conversation: Conversation) => {
    setEditingId(conversation.id);
    setEditTitle(conversation.title);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle('');
  };

  const confirmEdit = () => {
    if (editingId && editTitle.trim()) {
      handleRename(editingId, editTitle.trim());
    }
  };

  if (loading) {
    return (
      <Box w="300px" h="100%" borderRight="1px" borderColor="gray.200" p={4}>
        <Center h="100%">
          <Spinner size="lg" />
        </Center>
      </Box>
    );
  }

  return (
    <>
      <Box w="300px" h="100%" borderRight="1px" borderColor="gray.200" p={4}>
        <VStack spacing={4} align="stretch" h="100%">
          <HStack justify="space-between">
            <Text fontSize="lg" fontWeight="bold">
              Conversations
            </Text>
            <IconButton
              aria-label="New conversation"
              icon={<MdAdd />}
              size="sm"
              onClick={onNewConversation}
            />
          </HStack>

          <VStack spacing={2} flex={1} overflowY="auto">
            {conversations.map((conversation) => (
              <Box
                key={conversation.id}
                p={3}
                borderRadius="md"
                bg={selectedConversationId === conversation.id ? 'blue.50' : 'gray.50'}
                cursor="pointer"
                w="100%"
                onClick={() => onConversationSelect(conversation.id)}
                _hover={{ bg: 'blue.100' }}
              >
                {editingId === conversation.id ? (
                  <VStack spacing={2} align="stretch">
                    <Input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      size="sm"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') confirmEdit();
                        if (e.key === 'Escape') cancelEdit();
                      }}
                    />
                    <HStack spacing={2}>
                      <Button size="xs" colorScheme="blue" onClick={confirmEdit}>
                        Save
                      </Button>
                      <Button size="xs" variant="ghost" onClick={cancelEdit}>
                        Cancel
                      </Button>
                    </HStack>
                  </VStack>
                ) : (
                  <HStack justify="space-between">
                    <VStack align="start" spacing={1} flex={1}>
                      <Text fontSize="sm" fontWeight="medium" noOfLines={2}>
                        {conversation.title}
                      </Text>
                      <Text fontSize="xs" color="gray.500">
                        {new Date(conversation.updated_at).toLocaleDateString()}
                      </Text>
                    </VStack>
                    <VStack spacing={1}>
                      <IconButton
                        aria-label="Edit conversation"
                        icon={<MdEdit />}
                        size="xs"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          startEdit(conversation);
                        }}
                      />
                      <IconButton
                        aria-label="Delete conversation"
                        icon={<MdDelete />}
                        size="xs"
                        variant="ghost"
                        colorScheme="red"
                        onClick={(e) => {
                          e.stopPropagation();
                          setConversationToDelete(conversation.id);
                          onOpen();
                        }}
                      />
                    </VStack>
                  </HStack>
                )}
              </Box>
            ))}
            {conversations.length === 0 && (
              <Center py={8}>
                <VStack spacing={2}>
                  <MdChat size="48px" color="#A0AEC0" />
                  <Text color="gray.500" textAlign="center">
                    No conversations yet
                  </Text>
                  <Button size="sm" onClick={onNewConversation}>
                    Start a conversation
                  </Button>
                </VStack>
              </Center>
            )}
          </VStack>
        </VStack>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Conversation</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Are you sure you want to delete this conversation? This action cannot be undone.</Text>
            <HStack spacing={4} mt={4}>
              <Button colorScheme="red" onClick={() => handleDelete(conversationToDelete!)}>
                Delete
              </Button>
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
            </HStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}