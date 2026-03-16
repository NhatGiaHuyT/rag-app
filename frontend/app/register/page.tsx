'use client';
import {
  Box, Button, Flex, FormControl, FormLabel, Heading, Input,
  Text, useColorModeValue, Icon, VStack, useToast, Divider,
} from '@chakra-ui/react';
import { MdPerson } from 'react-icons/md';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import NextLink from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();
  const toast = useToast();
  const bg = useColorModeValue('gray.50', 'navy.900');
  const cardBg = useColorModeValue('white', 'navy.800');
  const textColor = useColorModeValue('navy.700', 'white');
  const subText = useColorModeValue('gray.500', 'gray.400');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');
  const handleRegister = async () => {
    if (!name || !email || !password || !confirm) {
      toast({ title: 'Please fill in all fields.', status: 'warning', duration: 3000, isClosable: true });
      return;
    }
    if (password !== confirm) {
      toast({ title: 'Passwords do not match.', status: 'error', duration: 3000, isClosable: true });
      return;
    }
    if (password.length < 6) {
      toast({ title: 'Password must be at least 6 characters.', status: 'warning', duration: 3000, isClosable: true });
      return;
    }
    setLoading(true);
    const result = await register(name, email, password);
    setLoading(false);
    if (result.success) {
      toast({ title: 'Account created! Welcome.', status: 'success', duration: 2500, isClosable: true });
      router.push('/');
    } else {
      toast({ title: result.error || 'Registration failed.', status: 'error', duration: 3000, isClosable: true });
    }
  };
  return (
    <Flex minH="100vh" align="center" justify="center" bg={bg} p="20px">
      <Box bg={cardBg} borderRadius="24px" p={{ base: '32px', md: '40px' }} w="100%" maxW="440px"
        boxShadow="14px 17px 40px 4px rgba(112, 144, 176, 0.12)">
        <Flex align="center" gap="12px" mb="32px" justify="center" direction="column">
          <Flex w="56px" h="56px" borderRadius="16px"
            bg="linear-gradient(15.46deg, #4A25E1 26.3%, #7B5AFF 86.4%)"
            align="center" justify="center">
            <Icon as={MdPerson} color="white" w="28px" h="28px" />
          </Flex>
          <Heading fontSize="2xl" color={textColor} fontWeight="800">Create Account</Heading>
          <Text color={subText} fontSize="sm" textAlign="center">
            Sign up to get started with AI Chat App.
          </Text>
        </Flex>
        <VStack spacing="16px" mb="24px">
          <FormControl>
            <FormLabel fontSize="sm" fontWeight="600" color={textColor}>Display Name</FormLabel>
            <Input value={name} onChange={(e) => setName(e.target.value)}
              placeholder="Your name" borderRadius="14px" borderColor={borderColor} fontSize="sm" h="48px" />
          </FormControl>
          <FormControl>
            <FormLabel fontSize="sm" fontWeight="600" color={textColor}>Email</FormLabel>
            <Input value={email} onChange={(e) => setEmail(e.target.value)}
              type="email" placeholder="you@example.com" borderRadius="14px" borderColor={borderColor} fontSize="sm" h="48px" />
          </FormControl>
          <FormControl>
            <FormLabel fontSize="sm" fontWeight="600" color={textColor}>Password</FormLabel>
            <Input value={password} onChange={(e) => setPassword(e.target.value)}
              type="password" placeholder="Min. 6 characters" borderRadius="14px" borderColor={borderColor} fontSize="sm" h="48px" />
          </FormControl>
          <FormControl>
            <FormLabel fontSize="sm" fontWeight="600" color={textColor}>Confirm Password</FormLabel>
            <Input value={confirm} onChange={(e) => setConfirm(e.target.value)}
              type="password" placeholder="Repeat password" borderRadius="14px" borderColor={borderColor} fontSize="sm" h="48px"
              onKeyDown={(e) => e.key === 'Enter' && handleRegister()} />
          </FormControl>
        </VStack>
        <Button variant="primary" w="100%" h="52px" borderRadius="14px" fontSize="sm"
          isLoading={loading} loadingText="Creating account..." onClick={handleRegister}
          _hover={{ boxShadow: '0px 21px 27px -10px rgba(96,60,255,0.48)', bg: 'linear-gradient(15.46deg, #4A25E1 26.3%, #7B5AFF 86.4%)' }}>
          Create Account
        </Button>
        <Divider my="20px" />
        <Flex justify="center" gap="6px">
          <Text fontSize="sm" color={subText}>Already have an account?</Text>
          <NextLink href="/sign-in">
            <Text fontSize="sm" color="brand.500" fontWeight="600" cursor="pointer"
              _hover={{ textDecoration: 'underline' }}>
              Sign In
            </Text>
          </NextLink>
        </Flex>
      </Box>
    </Flex>
  );
}
