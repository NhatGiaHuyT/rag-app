'use client';
import {
  Box, Flex, Heading, Text, Icon, useColorModeValue, Button,
  FormControl, FormLabel, Input, Textarea, Select, Avatar,
  VStack, HStack, useToast, Divider,
} from '@chakra-ui/react';
import { MdOutlineManageAccounts, MdSave, MdKey } from 'react-icons/md';
import { useState, useEffect } from 'react';
import { getUserProfile, saveUserProfile, UserProfile, defaultProfile } from '@/utils/storage';
export default function SettingsPage() {
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [apiKey, setApiKeyState] = useState('');
  const [saving, setSaving] = useState(false);
  const toast = useToast();
  const textColor = useColorModeValue('navy.700', 'white');
  const subText = useColorModeValue('gray.500', 'gray.400');
  const cardBg = useColorModeValue('white', 'navy.800');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');
  const sectionBg = useColorModeValue('gray.50', 'navy.900');
  useEffect(() => {
    setProfile(getUserProfile());
    setApiKeyState(localStorage.getItem('apiKey') || '');
  }, []);
  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    saveUserProfile(profile);
    if (apiKey) localStorage.setItem('apiKey', apiKey);
    setSaving(false);
    toast({ title: 'Settings saved!', status: 'success', duration: 2500, isClosable: true });
  };
  return (
    <Box pt={{ base: '10px', md: '20px' }} maxW="800px">
      <Flex align="center" gap="12px" mb="28px">
        <Flex w="44px" h="44px" borderRadius="12px" bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)" align="center" justify="center">
          <Icon as={MdOutlineManageAccounts} color="white" w="22px" h="22px" />
        </Flex>
        <Box>
          <Heading fontSize={{ base: 'xl', md: '2xl' }} color={textColor} fontWeight="700">Profile Settings</Heading>
          <Text color={subText} fontSize="sm">Manage your account preferences and API key.</Text>
        </Box>
      </Flex>
      <VStack spacing="20px" align="stretch">
        {/* Profile */}
        <Box bg={cardBg} borderRadius="20px" p="24px" boxShadow="14px 17px 40px 4px rgba(112,144,176,0.08)">
          <Flex align="center" gap="16px" mb="20px">
            <Avatar size="lg" name={profile.name} bg="brand.500" color="white" />
            <Box>
              <Text fontWeight="700" color={textColor}>{profile.name || 'Your Name'}</Text>
              <Text fontSize="sm" color={subText}>{profile.email || 'your@email.com'}</Text>
            </Box>
          </Flex>
          <Divider mb="20px" />
          <VStack spacing="16px" align="stretch">
            <HStack spacing="16px">
              <FormControl>
                <FormLabel fontSize="sm" fontWeight="600" color={textColor}>Display Name</FormLabel>
                <Input value={profile.name} onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
                  borderRadius="14px" borderColor={borderColor} fontSize="sm" h="46px" placeholder="Your name" />
              </FormControl>
              <FormControl>
                <FormLabel fontSize="sm" fontWeight="600" color={textColor}>Email</FormLabel>
                <Input value={profile.email} onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
                  type="email" borderRadius="14px" borderColor={borderColor} fontSize="sm" h="46px" placeholder="you@example.com" />
              </FormControl>
            </HStack>
            <FormControl>
              <FormLabel fontSize="sm" fontWeight="600" color={textColor}>Bio</FormLabel>
              <Textarea value={profile.bio} onChange={(e) => setProfile((p) => ({ ...p, bio: e.target.value }))}
                borderRadius="14px" borderColor={borderColor} fontSize="sm" placeholder="Tell us about yourself..." rows={3} resize="none" />
            </FormControl>
            <HStack spacing="16px">
              <FormControl>
                <FormLabel fontSize="sm" fontWeight="600" color={textColor}>Language</FormLabel>
                <Select value={profile.language} onChange={(e) => setProfile((p) => ({ ...p, language: e.target.value }))}
                  borderRadius="14px" borderColor={borderColor} fontSize="sm" h="46px">
                  <option value="en">English</option>
                  <option value="vi">Vietnamese</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                  <option value="ja">Japanese</option>
                  <option value="zh">Chinese</option>
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel fontSize="sm" fontWeight="600" color={textColor}>Theme</FormLabel>
                <Select value={profile.theme} onChange={(e) => setProfile((p) => ({ ...p, theme: e.target.value }))}
                  borderRadius="14px" borderColor={borderColor} fontSize="sm" h="46px">
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="system">System</option>
                </Select>
              </FormControl>
            </HStack>
          </VStack>
        </Box>
        {/* API Key */}
        <Box bg={cardBg} borderRadius="20px" p="24px" boxShadow="14px 17px 40px 4px rgba(112,144,176,0.08)">
          <Flex align="center" gap="10px" mb="16px">
            <Icon as={MdKey} color="brand.500" w="20px" h="20px" />
            <Text fontWeight="700" fontSize="md" color={textColor}>OpenAI API Key</Text>
          </Flex>
          <Box bg={sectionBg} borderRadius="12px" p="14px" mb="16px">
            <Text fontSize="xs" color={subText} lineHeight="1.6">
              Your API key is stored locally in your browser and never sent to our servers.
              Get your key at <strong>platform.openai.com</strong>.
            </Text>
          </Box>
          <FormControl>
            <FormLabel fontSize="sm" fontWeight="600" color={textColor}>API Key</FormLabel>
            <Input value={apiKey} onChange={(e) => setApiKeyState(e.target.value)}
              type="password" borderRadius="14px" borderColor={borderColor} fontSize="sm" h="46px"
              placeholder="sk-..." fontFamily="mono" />
          </FormControl>
        </Box>
        <Button variant="primary" h="52px" borderRadius="14px" fontSize="sm"
          leftIcon={<Icon as={MdSave} />} isLoading={saving} loadingText="Saving..."
          onClick={handleSave}
          _hover={{ boxShadow: '0px 21px 27px -10px rgba(96,60,255,0.48) !important', bg: 'linear-gradient(15.46deg, #4A25E1 26.3%, #7B5AFF 86.4%) !important' }}>
          Save Changes
        </Button>
      </VStack>
    </Box>
  );
}
