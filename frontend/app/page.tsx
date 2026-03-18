'use client';
/*eslint-disable*/

import React, { useState } from 'react';
import {
  Box,
  Flex,
  useColorModeValue,
} from '@chakra-ui/react';
import ConversationSidebar from '@/components/ConversationSidebar';
import ChatInterface from '@/components/ChatInterface';

export default function Chat() {
  const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null);
  const bgColor = useColorModeValue('gray.50', 'gray.900');

  const handleNewConversation = () => {
    setSelectedConversationId(null);
    // This will trigger a refresh of conversations in the sidebar
  };

  return (
    <Box minH="100vh" bg={bgColor}>
      <Flex h="100vh">
        <ConversationSidebar
          onConversationSelect={setSelectedConversationId}
          selectedConversationId={selectedConversationId}
          onNewConversation={handleNewConversation}
        />
        <ChatInterface
          conversationId={selectedConversationId}
          onNewConversation={handleNewConversation}
        />
      </Flex>
    </Box>
  );
}
