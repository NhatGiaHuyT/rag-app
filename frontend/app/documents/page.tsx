'use client';

import { useEffect, useState } from 'react';
import {
  Box,
  Text,
  VStack,
  HStack,
  Badge,
  useColorModeValue,
} from '@chakra-ui/react';

interface Document {
  id: number;
  filename: string;
  file_size: number;
  uploaded_by: number;
  uploaded_at: string;
  is_active: boolean;
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await fetch('/api/documents');
      if (response.ok) {
        const data = await response.json();
        setDocuments(data);
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  if (loading) {
    return <Box p={6}>Loading documents...</Box>;
  }

  return (
    <Box p={6}>
      <Text fontSize="2xl" fontWeight="bold" mb={6}>
        My Documents
      </Text>
      <VStack spacing={4} align="stretch">
        {documents.length === 0 ? (
          <Text>No documents available.</Text>
        ) : (
          documents.map((doc) => (
            <Box
              key={doc.id}
              p={4}
              bg={bgColor}
              borderRadius="md"
              border="1px solid"
              borderColor={borderColor}
            >
              <HStack justify="space-between">
                <VStack align="start" spacing={1}>
                  <Text fontWeight="semibold">{doc.filename}</Text>
                  <Text fontSize="sm" color="gray.500">
                    Size: {(doc.file_size / 1024).toFixed(2)} KB
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    Uploaded: {new Date(doc.uploaded_at).toLocaleDateString()}
                  </Text>
                </VStack>
                <Badge colorScheme={doc.is_active ? 'green' : 'red'}>
                  {doc.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </HStack>
            </Box>
          ))
        )}
      </VStack>
    </Box>
  );
}