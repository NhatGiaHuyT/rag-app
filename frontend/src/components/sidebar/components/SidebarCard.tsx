import { Flex, Text, useColorModeValue, Icon } from '@chakra-ui/react';
import { MdTipsAndUpdates, MdKey } from 'react-icons/md';
import NavLink from '@/components/link/NavLink';
export default function SidebarCard() {
  const bg = useColorModeValue('brand.50', 'whiteAlpha.50');
  const border = useColorModeValue('brand.100', 'whiteAlpha.100');
  const textColor = useColorModeValue('navy.700', 'white');
  const subColor = useColorModeValue('gray.500', 'gray.400');
  return (
    <Flex
      direction="column"
      bg={bg}
      border="1px solid"
      borderColor={border}
      borderRadius="16px"
      p="16px"
      w="100%"
      gap="10px"
    >
      <Flex align="center" gap="8px">
        <Icon as={MdTipsAndUpdates} color="brand.500" w="18px" h="18px" />
        <Text fontSize="sm" fontWeight="700" color={textColor}>
          Quick Start
        </Text>
      </Flex>
      <Text fontSize="xs" color={subColor} lineHeight="1.6">
        Start chatting with the RAG system or manage your documents.
      </Text>
      <NavLink href="/">
        <Flex
          align="center"
          justify="center"
          gap="6px"
          bg="brand.500"
          borderRadius="10px"
          px="12px"
          py="8px"
          cursor="pointer"
          _hover={{ opacity: 0.85 }}
          transition="0.2s"
        >
          <Icon as={MdTipsAndUpdates} color="white" w="14px" h="14px" />
          <Text fontSize="xs" fontWeight="600" color="white">
            Start Chatting
          </Text>
        </Flex>
      </NavLink>
    </Flex>
  );
}
