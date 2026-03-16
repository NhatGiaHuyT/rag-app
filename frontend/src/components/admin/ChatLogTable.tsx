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
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Button,
  useColorModeValue,
  Divider,
} from '@chakra-ui/react';
import { SearchIcon, ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import { ChatLog } from '@/types/types';
import { useState } from 'react';

interface ChatLogTableProps {
  logs: ChatLog[];
}

export default function ChatLogTable({ logs }: ChatLogTableProps) {
  const [search, setSearch] = useState('');
  const [modelFilter, setModelFilter] = useState('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const perPage = 5;

  const textColor = useColorModeValue('navy.700', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
  const secondaryText = useColorModeValue('gray.500', 'gray.400');
  const codeBg = useColorModeValue('gray.50', 'navy.900');

  const filtered = logs.filter((l) => {
    const matchSearch =
      l.userName.toLowerCase().includes(search.toLowerCase()) ||
      l.prompt.toLowerCase().includes(search.toLowerCase());
    const matchModel = modelFilter === 'all' || l.model === modelFilter;
    return matchSearch && matchModel;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <Box>
      {/* Filters */}
      <Flex gap="12px" mb="20px" flexWrap="wrap" align="center">
        <InputGroup maxW="300px">
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.400" />
          </InputLeftElement>
          <Input
            placeholder="Search by user or prompt..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            borderRadius="10px"
          />
        </InputGroup>
        <Select
          maxW="200px"
          borderRadius="10px"
          value={modelFilter}
          onChange={(e) => { setModelFilter(e.target.value); setPage(1); }}
        >
          <option value="all">All Models</option>
          <option value="gpt-4o">GPT-4o</option>
          <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
        </Select>
        <Text ms="auto" color={secondaryText} fontSize="sm">
          {filtered.length} result{filtered.length !== 1 ? 's' : ''}
        </Text>
      </Flex>

      {/* Table */}
      <Box overflowX="auto">
        <Table variant="simple" size="sm">
          <Thead>
            <Tr>
              <Th borderColor={borderColor} color={secondaryText}>User</Th>
              <Th borderColor={borderColor} color={secondaryText}>Model</Th>
              <Th borderColor={borderColor} color={secondaryText}>Prompt (preview)</Th>
              <Th borderColor={borderColor} color={secondaryText} isNumeric>Tokens</Th>
              <Th borderColor={borderColor} color={secondaryText}>Time</Th>
              <Th borderColor={borderColor} color={secondaryText}>Duration</Th>
              <Th borderColor={borderColor}></Th>
            </Tr>
          </Thead>
          <Tbody>
            {paginated.map((log) => (
              <>
                <Tr
                  key={log.id}
                  cursor="pointer"
                  onClick={() => toggleExpand(log.id)}
                  _hover={{ bg: useColorModeValue('gray.50', 'whiteAlpha.50') }}
                >
                  <Td borderColor={borderColor}>
                    <Text fontSize="sm" fontWeight="600" color={textColor}>{log.userName}</Text>
                  </Td>
                  <Td borderColor={borderColor}>
                    <Badge
                      colorScheme={log.model === 'gpt-4o' ? 'purple' : 'blue'}
                      borderRadius="8px" px="8px"
                    >
                      {log.model}
                    </Badge>
                  </Td>
                  <Td borderColor={borderColor} maxW="220px">
                    <Text fontSize="sm" color={textColor} noOfLines={1}>
                      {log.prompt}
                    </Text>
                  </Td>
                  <Td borderColor={borderColor} isNumeric>
                    <Text fontSize="sm" color={textColor}>{log.tokensUsed}</Text>
                  </Td>
                  <Td borderColor={borderColor}>
                    <Text fontSize="xs" color={secondaryText}>{log.timestamp}</Text>
                  </Td>
                  <Td borderColor={borderColor}>
                    <Text fontSize="xs" color={secondaryText}>{log.duration}ms</Text>
                  </Td>
                  <Td borderColor={borderColor}>
                    {expandedId === log.id ? <ChevronUpIcon /> : <ChevronDownIcon />}
                  </Td>
                </Tr>
                {expandedId === log.id && (
                  <Tr key={`${log.id}-detail`}>
                    <Td colSpan={7} borderColor={borderColor} p="0">
                      <Box p="16px" bg={codeBg} borderRadius="8px" m="8px">
                        <Text fontSize="xs" fontWeight="700" color={secondaryText} mb="6px">
                          PROMPT
                        </Text>
                        <Text fontSize="sm" color={textColor} mb="12px">{log.prompt}</Text>
                        <Divider mb="12px" />
                        <Text fontSize="xs" fontWeight="700" color={secondaryText} mb="6px">
                          RESPONSE
                        </Text>
                        <Text fontSize="sm" color={textColor}>{log.response}</Text>
                      </Box>
                    </Td>
                  </Tr>
                )}
              </>
            ))}
          </Tbody>
        </Table>
        {paginated.length === 0 && (
          <Flex justify="center" py="40px">
            <Text color={secondaryText}>No logs found</Text>
          </Flex>
        )}
      </Box>

      {/* Pagination */}
      {totalPages > 1 && (
        <Flex justify="center" align="center" gap="8px" mt="20px">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            isDisabled={page === 1}
            borderRadius="8px"
          >
            Previous
          </Button>
          <Text fontSize="sm" color={secondaryText}>
            Page {page} of {totalPages}
          </Text>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            isDisabled={page === totalPages}
            borderRadius="8px"
          >
            Next
          </Button>
        </Flex>
      )}
    </Box>
  );
}


