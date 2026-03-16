'use client';
import {
  Box, Flex, Heading, Text, Icon, useColorModeValue, Button,
  VStack, HStack, Badge, Input, InputGroup, InputLeftElement, useToast,
} from '@chakra-ui/react';
import { MdSearch, MdDelete, MdFolderOpen, MdAdd, MdContentCopy } from 'react-icons/md';
import { useState, useEffect } from 'react';
import NextLink from 'next/link';
import { getSavedProjects, deleteProject, SavedProject } from '@/utils/storage';
const toolColors: Record<string, string> = {
  'Essay Generator': 'purple', 'Content Simplifier': 'pink',
  'Article Generator': 'blue', 'Product Description': 'cyan',
  'Email Enhancer': 'green', 'LinkedIn Message': 'teal',
  'Instagram Caption': 'red', 'FAQs Content': 'orange',
  'Product Name Generator': 'yellow', 'SEO Keywords': 'teal',
  'Review Responder': 'orange', 'Business Idea Generator': 'purple',
};
export default function MyProjectsPage() {
  const [projects, setProjects] = useState<SavedProject[]>([]);
  const [search, setSearch] = useState('');
  const toast = useToast();
  const textColor = useColorModeValue('navy.700', 'white');
  const subText = useColorModeValue('gray.500', 'gray.400');
  const cardBg = useColorModeValue('white', 'navy.800');
  const borderColor = useColorModeValue('gray.100', 'whiteAlpha.100');
  const emptyBg = useColorModeValue('gray.50', 'navy.900');
  useEffect(() => { setProjects(getSavedProjects()); }, []);
  const filtered = projects.filter(
    (p) => p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.tool.toLowerCase().includes(search.toLowerCase()),
  );
  const handleDelete = (id: string) => {
    if (!window.confirm('Delete this project?')) return;
    deleteProject(id);
    setProjects(getSavedProjects());
    toast({ title: 'Project deleted', status: 'info', duration: 2000, isClosable: true });
  };
  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({ title: 'Copied!', status: 'success', duration: 2000, isClosable: true });
  };
  return (
    <Box pt={{ base: '10px', md: '20px' }}>
      <Flex mb="28px" align={{ base: 'start', md: 'center' }} direction={{ base: 'column', md: 'row' }} gap="16px">
        <Box flex="1">
          <Flex align="center" gap="12px" mb="6px">
            <Flex w="44px" h="44px" borderRadius="12px" bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)" align="center" justify="center">
              <Icon as={MdFolderOpen} color="white" w="22px" h="22px" />
            </Flex>
            <Heading fontSize={{ base: 'xl', md: '2xl' }} color={textColor} fontWeight="700">My Projects</Heading>
          </Flex>
          <Text color={subText} fontSize="sm">{projects.length} saved {projects.length === 1 ? 'project' : 'projects'}</Text>
        </Box>
        <HStack gap="10px">
          <InputGroup maxW="220px">
            <InputLeftElement pointerEvents="none"><Icon as={MdSearch} color={subText} /></InputLeftElement>
            <Input placeholder="Search..." borderRadius="14px" fontSize="sm" value={search} onChange={(e) => setSearch(e.target.value)} />
          </InputGroup>
          <NextLink href="/all-templates">
            <Button leftIcon={<Icon as={MdAdd} />} variant="primary" borderRadius="14px" fontSize="sm" h="42px" px="16px">New</Button>
          </NextLink>
        </HStack>
      </Flex>
      {filtered.length > 0 ? (
        <VStack spacing="14px" align="stretch">
          {filtered.map((p) => (
            <Box key={p.id} bg={cardBg} border="1px solid" borderColor={borderColor} borderRadius="16px" p="20px" boxShadow="14px 17px 40px 4px rgba(112,144,176,0.06)">
              <Flex align="start" justify="space-between" gap="12px">
                <Box flex="1" minW={0}>
                  <Flex align="center" gap="10px" mb="6px" wrap="wrap">
                    <Text fontWeight="700" fontSize="md" color={textColor} noOfLines={1}>{p.title}</Text>
                    <Badge colorScheme={toolColors[p.tool] || 'gray'} borderRadius="20px" fontSize="10px" px="8px" textTransform="none">{p.tool}</Badge>
                  </Flex>
                  <Text fontSize="xs" color={subText} mb="10px">
                    {new Date(p.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </Text>
                  <Text fontSize="sm" color={subText} noOfLines={3} lineHeight="1.6" bg={emptyBg} borderRadius="10px" p="10px">{p.content}</Text>
                </Box>
                <Flex direction="column" gap="8px" flexShrink={0}>
                  <Button size="sm" variant="outline" borderRadius="10px" leftIcon={<Icon as={MdContentCopy} />} onClick={() => handleCopy(p.content)}>Copy</Button>
                  <Button size="sm" colorScheme="red" variant="ghost" borderRadius="10px" leftIcon={<Icon as={MdDelete} />} onClick={() => handleDelete(p.id)}>Delete</Button>
                </Flex>
              </Flex>
            </Box>
          ))}
        </VStack>
      ) : (
        <Flex direction="column" align="center" justify="center" h="300px" bg={emptyBg} borderRadius="20px" color={subText}>
          <Icon as={MdFolderOpen} w="48px" h="48px" mb="16px" opacity={0.3} />
          <Text fontWeight="600" mb="6px" color={textColor}>{search ? ('No projects match "' + search + '"') : 'No saved projects yet'}</Text>
          <Text fontSize="sm" mb="20px" textAlign="center" maxW="280px">Use any AI tool and click Save to store outputs here.</Text>
          {!search && (
            <NextLink href="/all-templates">
              <Button variant="primary" borderRadius="14px" fontSize="sm">Browse Templates</Button>
            </NextLink>
          )}
        </Flex>
      )}
    </Box>
  );
}
