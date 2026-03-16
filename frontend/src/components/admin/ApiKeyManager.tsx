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
  Text,
  Flex,
  Button,
  IconButton,
  Input,
  useColorModeValue,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  useDisclosure,
  HStack,
  Tooltip,
} from '@chakra-ui/react';
import { CopyIcon, ViewIcon, ViewOffIcon, DeleteIcon, AddIcon } from '@chakra-ui/icons';
import { MdKey } from 'react-icons/md';
import { ApiKeyEntry } from '@/types/types';
import { useState } from 'react';

interface ApiKeyManagerProps {
  apiKeys: ApiKeyEntry[];
}

export default function ApiKeyManager({ apiKeys: initial }: ApiKeyManagerProps) {
  const [keys, setKeys] = useState(initial);
  const [revealed, setRevealed] = useState<Set<string>>(new Set());
  const [newKeyName, setNewKeyName] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const textColor = useColorModeValue('navy.700', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
  const secondaryText = useColorModeValue('gray.500', 'gray.400');
  const codeBg = useColorModeValue('gray.100', 'navy.900');

  const toggleReveal = (id: string) => {
    setRevealed((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const copyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    toast({ title: 'Copied to clipboard', status: 'success', duration: 1500 });
  };

  const revokeKey = (id: string) => {
    setKeys((prev) =>
      prev.map((k) => (k.id === id ? { ...k, status: 'revoked' } : k)),
    );
    toast({ title: 'API key revoked', status: 'warning', duration: 2000 });
  };

  const deleteKey = (id: string) => {
    setKeys((prev) => prev.filter((k) => k.id !== id));
    toast({ title: 'API key deleted', status: 'info', duration: 2000 });
  };

  const addKey = () => {
    if (!newKeyName.trim()) return;
    const fake = `sk-new-${'x'.repeat(48)}`;
    const entry: ApiKeyEntry = {
      id: `key${Date.now()}`,
      name: newKeyName,
      key: fake,
      maskedKey: `sk-new-****...****xxxx`,
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
      lastUsed: '-',
      totalRequests: 0,
    };
    setKeys((prev) => [entry, ...prev]);
    setNewKeyName('');
    onClose();
    toast({ title: 'New API key created', status: 'success', duration: 2000 });
  };

  return (
    <Box>
      <Flex mb="20px" justify="flex-end">
        <Button
          leftIcon={<AddIcon />}
          colorScheme="brand"
          borderRadius="10px"
          size="sm"
          onClick={onOpen}
        >
          Add New Key
        </Button>
      </Flex>

      <Box overflowX="auto">
        <Table variant="simple" size="sm">
          <Thead>
            <Tr>
              <Th borderColor={borderColor} color={secondaryText}>Name</Th>
              <Th borderColor={borderColor} color={secondaryText}>Key</Th>
              <Th borderColor={borderColor} color={secondaryText}>Status</Th>
              <Th borderColor={borderColor} color={secondaryText} isNumeric>Requests</Th>
              <Th borderColor={borderColor} color={secondaryText}>Created</Th>
              <Th borderColor={borderColor} color={secondaryText}>Last Used</Th>
              <Th borderColor={borderColor} color={secondaryText}>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {keys.map((key) => (
              <Tr key={key.id}>
                <Td borderColor={borderColor}>
                  <HStack>
                    <Box color="brand.500"><MdKey size="16px" /></Box>
                    <Text fontSize="sm" fontWeight="600" color={textColor}>{key.name}</Text>
                  </HStack>
                </Td>
                <Td borderColor={borderColor}>
                  <Flex
                    align="center"
                    gap="8px"
                    bg={codeBg}
                    px="10px"
                    py="4px"
                    borderRadius="8px"
                    maxW="260px"
                  >
                    <Text
                      fontSize="xs"
                      fontFamily="mono"
                      color={textColor}
                      flex="1"
                      noOfLines={1}
                    >
                      {revealed.has(key.id) ? key.key : key.maskedKey}
                    </Text>
                    <Tooltip label={revealed.has(key.id) ? 'Hide' : 'Reveal'}>
                      <IconButton
                        icon={revealed.has(key.id) ? <ViewOffIcon /> : <ViewIcon />}
                        size="xs"
                        variant="ghost"
                        aria-label="toggle"
                        onClick={() => toggleReveal(key.id)}
                      />
                    </Tooltip>
                    <Tooltip label="Copy">
                      <IconButton
                        icon={<CopyIcon />}
                        size="xs"
                        variant="ghost"
                        aria-label="copy"
                        onClick={() => copyKey(key.key)}
                      />
                    </Tooltip>
                  </Flex>
                </Td>
                <Td borderColor={borderColor}>
                  <Badge
                    colorScheme={key.status === 'active' ? 'green' : 'red'}
                    borderRadius="8px"
                    px="8px"
                    textTransform="capitalize"
                  >
                    {key.status}
                  </Badge>
                </Td>
                <Td borderColor={borderColor} isNumeric>
                  <Text fontSize="sm" color={textColor}>{key.totalRequests.toLocaleString()}</Text>
                </Td>
                <Td borderColor={borderColor}>
                  <Text fontSize="sm" color={secondaryText}>{key.createdAt}</Text>
                </Td>
                <Td borderColor={borderColor}>
                  <Text fontSize="sm" color={secondaryText}>{key.lastUsed}</Text>
                </Td>
                <Td borderColor={borderColor}>
                  <HStack>
                    {key.status === 'active' && (
                      <Tooltip label="Revoke">
                        <Button
                          size="xs"
                          variant="outline"
                          colorScheme="orange"
                          borderRadius="8px"
                          onClick={() => revokeKey(key.id)}
                        >
                          Revoke
                        </Button>
                      </Tooltip>
                    )}
                    <Tooltip label="Delete">
                      <IconButton
                        icon={<DeleteIcon />}
                        size="xs"
                        colorScheme="red"
                        variant="ghost"
                        aria-label="delete"
                        onClick={() => deleteKey(key.id)}
                      />
                    </Tooltip>
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      {/* Add Key Modal */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent borderRadius="16px">
          <ModalHeader>Add New API Key</ModalHeader>
          <ModalBody>
            <FormControl>
              <FormLabel fontSize="sm">Key Name</FormLabel>
              <Input
                placeholder="e.g. Staging Key"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                borderRadius="10px"
                onKeyDown={(e) => e.key === 'Enter' && addKey()}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter gap="8px">
            <Button variant="ghost" borderRadius="10px" onClick={onClose}>Cancel</Button>
            <Button
              colorScheme="brand"
              borderRadius="10px"
              onClick={addKey}
              isDisabled={!newKeyName.trim()}
            >
              Create Key
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

