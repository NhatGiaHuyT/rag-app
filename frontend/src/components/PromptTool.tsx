'use client';

import { useState } from 'react';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Icon,
  Input,
  Select,
  Text,
  Textarea,
  useColorModeValue,
  VStack,
  useToast,
} from '@chakra-ui/react';
import { MdAutoAwesome, MdBolt, MdSend, MdSave } from 'react-icons/md';
import MessageBoxChat from '@/components/MessageBox';
import { OpenAIModel } from '@/types/types';
import { saveChat, saveProject } from '@/utils/storage';

export interface PromptField {
  key: string;
  label: string;
  placeholder?: string;
  type: 'input' | 'textarea' | 'select';
  options?: { value: string; label: string }[];
  required?: boolean;
  rows?: number;
}

export interface PromptToolConfig {
  title: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
  fields: PromptField[];
  buildPrompt: (values: Record<string, string>) => string;
  outputLabel?: string;
}

export default function PromptTool({ config }: { config: PromptToolConfig }) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [model, setModel] = useState<OpenAIModel>('gpt-4o');
  const toast = useToast();

  const textColor = useColorModeValue('navy.700', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');
  const cardBg = useColorModeValue('white', 'navy.800');
  const gray = useColorModeValue('gray.500', 'gray.400');
  const buttonBg = useColorModeValue('white', 'whiteAlpha.100');
  const iconColor = useColorModeValue('brand.500', 'white');
  const bgIcon = useColorModeValue(
    'linear-gradient(180deg, #FBFBFF 0%, #CACAFF 100%)',
    'whiteAlpha.200',
  );
  const buttonShadow = useColorModeValue(
    '14px 27px 45px rgba(112, 144, 176, 0.2)',
    'none',
  );
  const emptyBg = useColorModeValue('gray.50', 'navy.900');

  const handleSubmit = async () => {
    const apiKey = localStorage.getItem('apiKey');

    for (const field of config.fields) {
      if (field.required !== false && !values[field.key]) {
        toast({
          title: `"${field.label}" is required`,
          status: 'warning',
          duration: 3000,
          isClosable: true,
        });
        return;
      }
    }

    if (!apiKey?.includes('sk-')) {
      toast({
        title: 'API Key required',
        description: 'Please enter your OpenAI API key (click the key icon in the navbar).',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
      return;
    }

    const prompt = config.buildPrompt(values);
    setOutput(' ');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/chatAPI', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ inputCode: prompt, model, apiKey }),
      });

      if (!response.ok) {
        setLoading(false);
        toast({
          title: 'API Error',
          description: 'Something went wrong. Please check your API key.',
          status: 'error',
          duration: 4000,
          isClosable: true,
        });
        return;
      }

      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let fullResponse = '';

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunk = decoder.decode(value);
        fullResponse += chunk;
        setOutput((prev) => prev + chunk);
      }

      // Auto-save to chat history
      saveChat({
        message: prompt.slice(0, 200) + (prompt.length > 200 ? '...' : ''),
        response: fullResponse,
        model,
        tool: config.title,
      });
    } catch {
      toast({
        title: 'Network error',
        description: 'Failed to connect to the API.',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    }

    setLoading(false);
  };

  const handleSave = () => {
    if (!output.trim()) return;
    const firstField = config.fields[0];
    const title = values[firstField?.key] || config.title;
    saveProject({
      title: title.slice(0, 60),
      tool: config.title,
      content: output.trim(),
    });
    toast({
      title: 'Saved to My Projects!',
      status: 'success',
      duration: 2500,
      isClosable: true,
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output.trim());
    toast({ title: 'Copied!', status: 'success', duration: 2000, isClosable: true });
  };

  return (
    <Box pt={{ base: '10px', md: '20px' }}>
      {/* Header */}
      <Flex mb="28px" align="center" gap="16px">
        <Flex
          w="56px"
          h="56px"
          borderRadius="16px"
          background={config.gradient}
          align="center"
          justify="center"
          flexShrink={0}
        >
          {config.icon}
        </Flex>
        <Box>
          <Heading fontSize={{ base: 'xl', md: '2xl' }} color={textColor} fontWeight="700">
            {config.title}
          </Heading>
          <Text color={gray} fontSize="sm" mt="2px">
            {config.description}
          </Text>
        </Box>
      </Flex>

      <Flex gap="24px" direction={{ base: 'column', lg: 'row' }}>
        {/* ── Left: Input Form ── */}
        <Box
          bg={cardBg}
          borderRadius="20px"
          p="24px"
          boxShadow="14px 17px 40px 4px rgba(112, 144, 176, 0.08)"
          flex="1"
          minW={0}
        >
          {/* Model selector */}
          <Flex mb="24px" gap="10px" wrap="wrap">
            {(['gpt-4o', 'gpt-3.5-turbo'] as OpenAIModel[]).map((m) => (
              <Flex
                key={m}
                cursor="pointer"
                transition="0.3s"
                justify="center"
                align="center"
                bg={model === m ? buttonBg : 'transparent'}
                px="16px"
                h="46px"
                boxShadow={model === m ? buttonShadow : 'none'}
                borderRadius="14px"
                color={textColor}
                fontSize="sm"
                fontWeight="700"
                border="1px solid"
                borderColor={model === m ? 'transparent' : borderColor}
                onClick={() => setModel(m)}
              >
                <Flex
                  borderRadius="full"
                  justify="center"
                  align="center"
                  bg={bgIcon}
                  me="8px"
                  h="28px"
                  w="28px"
                >
                  <Icon
                    as={m === 'gpt-4o' ? MdAutoAwesome : MdBolt}
                    width="14px"
                    height="14px"
                    color={iconColor}
                  />
                </Flex>
                {m === 'gpt-4o' ? 'GPT-4o' : 'GPT-3.5'}
              </Flex>
            ))}
          </Flex>

          <VStack spacing="18px" align="stretch">
            {config.fields.map((field) => (
              <FormControl key={field.key}>
                <FormLabel fontSize="sm" fontWeight="600" color={textColor} mb="6px">
                  {field.label}
                </FormLabel>

                {field.type === 'textarea' ? (
                  <Textarea
                    placeholder={field.placeholder}
                    value={values[field.key] || ''}
                    onChange={(e) =>
                      setValues((v) => ({ ...v, [field.key]: e.target.value }))
                    }
                    rows={field.rows || 4}
                    borderRadius="14px"
                    borderColor={borderColor}
                    fontSize="sm"
                    color={textColor}
                    _focus={{ borderColor: 'brand.500', boxShadow: 'none' }}
                    resize="vertical"
                  />
                ) : field.type === 'select' ? (
                  <Select
                    value={values[field.key] || ''}
                    onChange={(e) =>
                      setValues((v) => ({ ...v, [field.key]: e.target.value }))
                    }
                    borderRadius="14px"
                    borderColor={borderColor}
                    fontSize="sm"
                    color={textColor}
                    _focus={{ borderColor: 'brand.500', boxShadow: 'none' }}
                    h="46px"
                  >
                    <option value="">-- Select --</option>
                    {field.options?.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </Select>
                ) : (
                  <Input
                    placeholder={field.placeholder}
                    value={values[field.key] || ''}
                    onChange={(e) =>
                      setValues((v) => ({ ...v, [field.key]: e.target.value }))
                    }
                    borderRadius="14px"
                    borderColor={borderColor}
                    fontSize="sm"
                    color={textColor}
                    _focus={{ borderColor: 'brand.500', boxShadow: 'none' }}
                    h="46px"
                  />
                )}
              </FormControl>
            ))}
          </VStack>

          <Button
            mt="24px"
            variant="primary"
            w="100%"
            h="52px"
            borderRadius="14px"
            fontSize="sm"
            rightIcon={<Icon as={MdSend} />}
            isLoading={loading}
            loadingText="Generating..."
            onClick={handleSubmit}
            _hover={{
              boxShadow:
                '0px 21px 27px -10px rgba(96, 60, 255, 0.48) !important',
              bg: 'linear-gradient(15.46deg, #4A25E1 26.3%, #7B5AFF 86.4%) !important',
            }}
          >
            Generate
          </Button>
        </Box>

        {/* ── Right: Output ── */}
        <Box
          bg={cardBg}
          borderRadius="20px"
          p="24px"
          boxShadow="14px 17px 40px 4px rgba(112, 144, 176, 0.08)"
          flex="1"
          minW={0}
        >
          <Flex align="center" mb="16px" justify="space-between">
            <Text fontWeight="700" fontSize="md" color={textColor}>
              {config.outputLabel || '✨ Generated Output'}
            </Text>
            {output && output.trim() && (
              <Flex gap="8px">
                <Button
                  size="sm"
                  variant="outline"
                  borderRadius="10px"
                  leftIcon={<Icon as={MdSave} />}
                  onClick={handleSave}
                >
                  Save
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  borderRadius="10px"
                  onClick={handleCopy}
                >
                  Copy
                </Button>
              </Flex>
            )}
          </Flex>

          {output && output.trim() ? (
            <MessageBoxChat output={output} />
          ) : (
            <Flex
              direction="column"
              align="center"
              justify="center"
              h="220px"
              bg={emptyBg}
              borderRadius="14px"
              color={gray}
            >
              <Icon as={MdAutoAwesome} w="36px" h="36px" mb="12px" opacity={0.4} />
              <Text fontSize="sm" textAlign="center" opacity={0.7} maxW="260px">
                Fill in the form on the left and click{' '}
                <strong>Generate</strong> to see your result here.
              </Text>
            </Flex>
          )}
        </Box>
      </Flex>
    </Box>
  );
}

