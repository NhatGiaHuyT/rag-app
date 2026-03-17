'use client';
import {
  Box, Button, Flex, FormControl, FormLabel, Heading, Input,
  Text, useColorModeValue, Icon, VStack, useToast, Divider, Badge,
} from '@chakra-ui/react';
import { MdAutoAwesome } from 'react-icons/md';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import NextLink from 'next/link';
import { useAuth, ADMIN_EMAIL } from '@/contexts/AuthContext';
export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();
  const toast = useToast();
  const bg = useColorModeValue('gray.50', 'navy.900');
  const cardBg = useColorModeValue('white', 'navy.800');
  const textColor = useColorModeValue('navy.700', 'white');
  const subText = useColorModeValue('gray.500', 'gray.400');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');
  const hintBg = useColorModeValue('blue.50', 'navy.700');
  const handleSignIn = async () => {
    if (!email || !password) {
      toast({ title: 'Please fill in all fields.', status: 'warning', duration: 3000, isClosable: true });
      return;
    }
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      toast({ title: 'Welcome back!', status: 'success', duration: 2000, isClosable: true });
      router.push('/');
    } else {
      toast({ title: result.error || 'Sign in failed.', status: 'error', duration: 3000, isClosable: true });
    }
  };
  return (
    <Flex minH="100vh" align="center" justify="center" bg={bg} p="20px">
      <Box bg={cardBg} borderRadius="24px" p={{ base: '32px', md: '40px' }} w="100%" maxW="440px"
        boxShadow="14px 17px 40px 4px rgba(112, 144, 176, 0.12)">
        <Flex align="center" gap="12px" mb="28px" justify="center" direction="column">
          <Flex w="56px" h="56px" borderRadius="16px"
            bg="linear-gradient(15.46deg, #4A25E1 26.3%, #7B5AFF 86.4%)"
            align="center" justify="center">
            <Icon as={MdAutoAwesome} color="white" w="28px" h="28px" />
          </Flex>
          <Heading fontSize="2xl" color={textColor} fontWeight="800">Sign In</Heading>
          <Text color={subText} fontSize="sm" textAlign="center">
            Enter your credentials to continue.
          </Text>
        </Flex>
        {/* Admin hint */}
        <Box bg={hintBg} borderRadius="12px" p="12px" mb="20px">
          <Text fontSize="xs" color={subText} lineHeight="1.7">
            <Badge colorScheme="purple" mr="6px" borderRadius="4px">Admin</Badge>
            Email: <strong>{ADMIN_EMAIL}</strong> &nbsp;·&nbsp; Password: <strong>admin</strong>
          </Text>
        </Box>
        <VStack spacing="16px" mb="24px">
          <FormControl>
            <FormLabel fontSize="sm" fontWeight="600" color={textColor}>Email</FormLabel>
            <Input value={email} onChange={(e) => setEmail(e.target.value)}
              type="email" placeholder="you@example.com" borderRadius="14px"
              borderColor={borderColor} fontSize="sm" h="48px"
              onKeyDown={(e) => e.key === 'Enter' && handleSignIn()} />
          </FormControl>
          <FormControl>
            <FormLabel fontSize="sm" fontWeight="600" color={textColor}>Password</FormLabel>
            <Input value={password} onChange={(e) => setPassword(e.target.value)}
              type="password" placeholder="••••••••" borderRadius="14px"
              borderColor={borderColor} fontSize="sm" h="48px"
              onKeyDown={(e) => e.key === 'Enter' && handleSignIn()} />
          </FormControl>
        </VStack>
        <Button variant="primary" w="100%" h="52px" borderRadius="14px" fontSize="sm"
          isLoading={loading} loadingText="Signing in..." onClick={handleSignIn}
          _hover={{ boxShadow: '0px 21px 27px -10px rgba(96,60,255,0.48)', bg: 'linear-gradient(15.46deg, #4A25E1 26.3%, #7B5AFF 86.4%)' }}>
          Sign In
        </Button>
        <Divider my="20px" />
        <Flex justify="center" gap="6px">
          <Text fontSize="sm" color={subText}>Don't have an account?</Text>
          <NextLink href="/register">
            <Text fontSize="sm" color="brand.500" fontWeight="600" cursor="pointer"
              _hover={{ textDecoration: 'underline' }}>
              Register
            </Text>
          </NextLink>
        </Flex>
      </Box>
    </Flex>
  );
}
