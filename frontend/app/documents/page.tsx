'use client';

import React, { useEffect, useState, useRef } from 'react';
import {
  Box,
  Text,
  VStack,
  HStack,
  Badge,
  Button,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
// import { UploadIcon } from '@chakra-ui/icons';

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/auth/documents', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setDocuments(data);
      } else {
        console.error('Failed to fetch documents:', response.status);
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const token = localStorage.getItem('token');
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));

    try {
      const response = await fetch('/api/files', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const results = await response.json();
      const successful = results.filter((r: any) => r.status === 'success');
      const failed = results.filter((r: any) => r.status === 'failed');

      if (successful.length > 0) {
        toast({
          title: `${successful.length} file(s) uploaded successfully`,
          status: 'success',
          duration: 3000,
        });
      }
      if (failed.length > 0) {
        toast({
          title: `${failed.length} file(s) failed`,
          status: 'error',
          duration: 5000,
        });
      }

      // Refresh documents list
      fetchDocuments();
      // Reset input
      e.target.value = '';
    } catch (error) {
      toast({
        title: 'Upload failed',
        description: 'Please try again',
        status: 'error',
        duration: 3000,
      });
    }
  };

  if (loading) {
    return <Box p={6}>Loading documents...</Box>;
  }

  return (
    <Box p={6}>
      <Text fontSize="2xl" fontWeight="bold" mb={6}>
        My Documents
      </Text>
      <HStack mb={6}>
        <Button 
          colorScheme="blue" 
          onClick={handleUploadClick}
        >
          📁 Upload Files
        </Button>
        <input
          id="file-upload"
          type="file"
          multiple
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileUpload}
          accept=".pdf,.txt,.doc,.docx,.md"
        />
      </HStack>
      <VStack spacing={4} align="stretch">
        {documents.length === 0 ? (
          <Text>No documents available. Upload files to get started.</Text>
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