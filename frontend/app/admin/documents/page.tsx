'use client';
import {
  Box,
  Heading,
  Text,
  Flex,
  SimpleGrid,
  useColorModeValue,
  Button,
  Input,
  VStack,
  HStack,
  useToast,
  Spinner,
  Center,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react';
import { MdFileUpload, MdDelete, MdMoreVert, MdFilePresent } from 'react-icons/md';
import { useState, useEffect, useRef } from 'react';
import Card from '@/components/card/Card';

interface Document {
  filename: string;
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const textColor = useColorModeValue('navy.700', 'white');
  const secondaryText = useColorModeValue('gray.500', 'gray.400');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/files', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setDocuments(data.files.map((f: string) => ({ filename: f })));
      } else {
        toast({ title: 'Failed to load documents', status: 'error', duration: 3000, isClosable: true });
      }
    } catch (error) {
      toast({ title: 'Error loading documents', status: 'error', duration: 3000, isClosable: true });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/files', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        toast({ title: 'Files uploaded successfully', status: 'success', duration: 3000, isClosable: true });
        fetchDocuments(); // Refresh the list
      } else {
        toast({ title: 'Failed to upload files', status: 'error', duration: 3000, isClosable: true });
      }
    } catch (error) {
      toast({ title: 'Error uploading files', status: 'error', duration: 3000, isClosable: true });
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDelete = async (docId: number) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/auth/admin/documents/${docId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        toast({ title: 'Document deleted', status: 'success', duration: 2000, isClosable: true });
        fetchDocuments();
      } else {
        toast({ title: 'Failed to delete document', status: 'error', duration: 3000, isClosable: true });
      }
    } catch (error) {
      toast({ title: 'Error deleting document', status: 'error', duration: 3000, isClosable: true });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <Center h="400px">
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <Box pt={{ base: '10px', md: '20px' }}>
      <Flex mb="28px" align="center" justify="space-between" flexWrap="wrap" gap="12px">
        <Box>
          <Heading fontSize="2xl" color={textColor} fontWeight="700">
            Document Management
          </Heading>
          <Text color={secondaryText} fontSize="sm" mt="4px">
            Upload and manage documents for the RAG system
          </Text>
        </Box>
        <Button
          leftIcon={<MdFileUpload />}
          colorScheme="brand"
          onClick={() => fileInputRef.current?.click()}
          isLoading={uploading}
          loadingText="Uploading..."
        >
          Upload Documents
        </Button>
        <Input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          multiple
          accept=".pdf,.txt,.md,.doc,.docx"
          display="none"
        />
      </Flex>

      <Card p="24px">
        <Text fontSize="lg" fontWeight="700" color={textColor} mb="20px">
          All Documents ({documents.length})
        </Text>
        {documents.length === 0 ? (
          <Center py="40px">
            <VStack spacing="16px">
              <MdFilePresent size="48px" color="#A0AEC0" />
              <Text color={secondaryText}>No documents uploaded yet</Text>
              <Button
                leftIcon={<MdFileUpload />}
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
              >
                Upload Your First Document
              </Button>
            </VStack>
          </Center>
        ) : (
          <Box overflowX="auto">
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th color={secondaryText}>Filename</Th>
                  <Th color={secondaryText}>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {documents.map((doc, index) => (
                  <Tr key={index}>
                    <Td>
                      <HStack>
                        <MdFilePresent />
                        <Text fontWeight="500" color={textColor}>
                          {doc.filename}
                        </Text>
                      </HStack>
                    </Td>
                    <Td>
                      {/* No actions for now */}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        )}
      </Card>
    </Box>
  );
}