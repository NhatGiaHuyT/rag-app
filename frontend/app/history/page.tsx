'use client';
import {
  Box, Flex, Heading, Text, Icon, useColorModeValue, Button,
  VStack, Badge, Input, InputGroup, InputLeftElement, useToast,
  Select, HStack,
} from '@chakra-ui/react';
import { MdHistory, MdDelete, MdSearch, MdDeleteSweep } from 'react-icons/md';
import { useState, useEffect } from 'react';
import { getChatHistory, deleteChatHistory, clearAllChatHistory, SavedChat } from '@/utils/storage';
export default function HistoryPage() {
  const [history, setHistory] = useState<SavedChat[]>([]);
  const [search, setSearch] = useState('');
  const [filterModel, setFilterModel] = useState('all');
  const toast = useToast();
  const textColor = useColorModeValue('navy.700', 'white');
  const subText = useColorModeValue('gray.500', 'gray.400');
  const cardBg = useColorModeValue('white', 'navy.800');
  const borderColor = useColorModeValue('gray.100', 'whiteAlpha.100');
  const emptyBg = useColorModeValue('gray.50', 'navy.900');
  const codeBg = useColorModeValue('gray.50', 'navy.900');
  useEffect(() => { setHistory(getChatHistory()); }, []);
  const filtered = history.filter((h) => {
    const matchSearch = h.message.toLowerCase().includes(search.toLowerCase()) ||
      h.response.toLowerCase().includes(search.toLowerCase()) ||
      (h.tool || '').toLowerCase().includes(search.toLowerCase());
    const matchModel = filterModel === 'all' || h.model === filterModel;
    return matchSearch && matchModel;
  });
  const handleDelete = (id: string) => {
    deleteChatHistory(id);
    setHistory(getChatHistory());
    toast({ title: 'Entry deleted', status: 'info', duration: 2000, isClosable: true });
  };
  const handleClearAll = () => {
    if (!window.confirm('Clear all chat history? This cannot be undone.')) return;
    clearAllChatHistory();
    setHistory([]);
    toast({ title: 'History cleared', status: 'info', duration: 2500, isClosable: true });
  };
  return (
    <Box pt={{ base: '10px', md: '20px' }}>
      <Flex mb="28px" align={{ base: 'start', md: 'center' }} direction={{ base: 'column', md: 'row' }} gap="16px">
        <Box flex="1">
          <Flex align="center" gap="12px" mb="6px">
            <Flex w="44px" h="44px" borderRadius="12px" bg="linear-gradient(135deg, #30cfd0 0%, #330867 100%)" align="center" justify="center">
              <Icon as={MdHistory} color="white" w="22px" h="22px" />
            </Flex>
            <Heading fontSize={{ base: 'xl', md: '2xl' }} color={textColor} fontWeight="700">Chat History</Heading>
          </Flex>
          <Text color={subText} fontSize="sm">{history.length} total {history.length === 1 ? 'conversation' : 'conversations'} recorded.</Text>
        </Box>
        <HStack gap="10px" wrap="wrap">
          <InputGroup maxW="200px">
            <InputLeftElement pointerEvents="none"><Icon as={MdSearch} color={subText} /></InputLeftElement>
            <Input placeholder="Search..." borderRadius="14px" fontSize="sm" value={search} onChange={(e) => setSearch(e.target.value)} />
          </InputGroup>
          <Select value={filterModel} onChange={(e) => setFilterModel(e.target.value)} borderRadius="14px" fontSize="sm" h="42px" maxW="160px">
            <option value="all">All Models</option>
            <option value="gpt-4o">GPT-4o</option>
            <option value="gpt-3.5-turbo">GPT-3.5</option>
          </Select>
          {history.length > 0 && (
            <Button leftIcon={<Icon as={MdDeleteSweep} />} colorScheme="red" variant="ghost" borderRadius="14px" fontSize="sm" h="42px" onClick={handleClearAll}>
              Clear All
            </Button>
          )}
        </HStack>
      </Flex>
      {filtered.length > 0 ? (
        <VStack spacing="12px" align="stretch">
          {filtered.map((item) => (
            <Box key={item.id} bg={cardBg} border="1px solid" borderColor={borderColor} borderRadius="16px" p="18px" boxShadow="14px 17px 40px 4px rgba(112,144,176,0.06)">
              <Flex align="start" justify="space-between" gap="12px">
                <Box flex="1" minW={0}>
                  <Flex align="center" gap="8px" mb="8px" wrap="wrap">
                    <Badge colorScheme="brand" borderRadius="20px" fontSize="10px" px="8px" textTransform="none">{item.model}</Badge>
                    {item.tool && <Badge colorScheme="purple" borderRadius="20px" fontSize="10px" px="8px" textTransform="none">{item.tool}</Badge>}
                    <Text fontSize="xs" color={subText}>
                      {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </Text>
                    <Text fontSize="xs" color={subText}>~{item.tokensEstimate} tokens</Text>
                  </Flex>
                  <Text fontSize="sm" fontWeight="600" color={textColor} mb="6px" noOfLines={2}>{item.message}</Text>
                  <Text fontSize="sm" color={subText} noOfLines={2} bg={codeBg} borderRadius="8px" p="8px">{item.response}</Text>
                </Box>
                <Button size="sm" colorScheme="red" variant="ghost" borderRadius="10px" onClick={() => handleDelete(item.id)}>
                  <Icon as={MdDelete} />
                </Button>
              </Flex>
            </Box>
          ))}
        </VStack>
      ) : (
        <Flex direction="column" align="center" justify="center" h="300px" bg={emptyBg} borderRadius="20px" color={subText}>
          <Icon as={MdHistory} w="48px" h="48px" mb="16px" opacity={0.3} />
          <Text fontWeight="600" mb="6px" color={textColor}>{search ? 'No results found' : 'No chat history yet'}</Text>
          <Text fontSize="sm" textAlign="center" maxW="280px">
            {search ? 'Try a different search term.' : 'Your conversations will appear here after you use the Chat UI or any AI tool.'}
          </Text>
        </Flex>
      )}
    </Box>
  );
}
