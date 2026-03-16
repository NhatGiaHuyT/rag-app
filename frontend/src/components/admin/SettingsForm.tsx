'use client';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  FormHelperText,
  Select,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Switch,
  Text,
  Textarea,
  VStack,
  HStack,
  Badge,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import { AdminSettings } from '@/types/types';
import { useState } from 'react';

interface SettingsFormProps {
  settings: AdminSettings;
}

export default function SettingsForm({ settings: initial }: SettingsFormProps) {
  const [settings, setSettings] = useState<AdminSettings>(initial);
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  const textColor = useColorModeValue('navy.700', 'white');
  const secondaryText = useColorModeValue('gray.500', 'gray.400');
  const sectionBg = useColorModeValue('gray.50', 'navy.900');

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    // Persist to localStorage as demo
    if (typeof window !== 'undefined') {
      localStorage.setItem('adminSettings', JSON.stringify(settings));
    }
    setSaving(false);
    toast({
      title: 'Settings saved',
      description: 'Your configuration has been updated.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleReset = () => {
    setSettings(initial);
    toast({ title: 'Settings reset to defaults', status: 'info', duration: 2000 });
  };

  return (
    <VStack spacing="24px" align="stretch">
      {/* AI Model Configuration */}
      <Box bg={sectionBg} p="20px" borderRadius="16px">
        <Text fontSize="md" fontWeight="700" color={textColor} mb="16px">
          🤖 AI Model Configuration
        </Text>
        <VStack spacing="16px" align="stretch">
          <FormControl>
            <FormLabel fontSize="sm" color={textColor}>Default AI Model</FormLabel>
            <Select
              value={settings.defaultModel}
              onChange={(e) =>
                setSettings((s) => ({ ...s, defaultModel: e.target.value as any }))
              }
              borderRadius="10px"
              maxW="300px"
            >
              <option value="gpt-4o">GPT-4o (Recommended)</option>
              <option value="gpt-3.5-turbo">GPT-3.5 Turbo (Faster)</option>
            </Select>
          </FormControl>

          <FormControl>
            <FormLabel fontSize="sm" color={textColor}>
              Temperature: {settings.temperature.toFixed(1)}
            </FormLabel>
            <Slider
              value={settings.temperature}
              min={0}
              max={2}
              step={0.1}
              maxW="400px"
              onChange={(v) => setSettings((s) => ({ ...s, temperature: v }))}
            >
              <SliderTrack>
                <SliderFilledTrack bg="brand.500" />
              </SliderTrack>
              <SliderThumb />
            </Slider>
            <FormHelperText fontSize="xs" color={secondaryText}>
              0 = Deterministic, 2 = Very creative
            </FormHelperText>
          </FormControl>

          <FormControl>
            <FormLabel fontSize="sm" color={textColor}>
              Max Tokens: {settings.maxTokens}
            </FormLabel>
            <Slider
              value={settings.maxTokens}
              min={256}
              max={8192}
              step={256}
              maxW="400px"
              onChange={(v) => setSettings((s) => ({ ...s, maxTokens: v }))}
            >
              <SliderTrack>
                <SliderFilledTrack bg="brand.500" />
              </SliderTrack>
              <SliderThumb />
            </Slider>
            <FormHelperText fontSize="xs" color={secondaryText}>
              Maximum response length
            </FormHelperText>
          </FormControl>

          <FormControl display="flex" alignItems="center" gap="12px">
            <Switch
              isChecked={settings.allowGpt4}
              onChange={(e) => setSettings((s) => ({ ...s, allowGpt4: e.target.checked }))}
              colorScheme="brand"
            />
            <Box>
              <Text fontSize="sm" color={textColor} fontWeight="500">Allow GPT-4o Access</Text>
              <Text fontSize="xs" color={secondaryText}>Users can choose between models</Text>
            </Box>
          </FormControl>
        </VStack>
      </Box>

      {/* System Prompt */}
      <Box bg={sectionBg} p="20px" borderRadius="16px">
        <Text fontSize="md" fontWeight="700" color={textColor} mb="16px">
          💬 System Prompt
        </Text>
        <FormControl>
          <FormLabel fontSize="sm" color={textColor}>Default System Prompt</FormLabel>
          <Textarea
            value={settings.systemPrompt}
            onChange={(e) => setSettings((s) => ({ ...s, systemPrompt: e.target.value }))}
            borderRadius="10px"
            rows={4}
            resize="vertical"
            placeholder="You are a helpful AI assistant..."
          />
          <FormHelperText fontSize="xs" color={secondaryText}>
            This prompt is sent at the beginning of every conversation.
          </FormHelperText>
        </FormControl>
      </Box>

      {/* Usage Controls */}
      <Box bg={sectionBg} p="20px" borderRadius="16px">
        <Text fontSize="md" fontWeight="700" color={textColor} mb="16px">
          ⚙️ Usage Controls
        </Text>
        <VStack spacing="16px" align="stretch">
          <FormControl>
            <FormLabel fontSize="sm" color={textColor}>
              Rate Limit: {settings.rateLimit} requests/hour
            </FormLabel>
            <Slider
              value={settings.rateLimit}
              min={10}
              max={500}
              step={10}
              maxW="400px"
              onChange={(v) => setSettings((s) => ({ ...s, rateLimit: v }))}
            >
              <SliderTrack>
                <SliderFilledTrack bg="brand.500" />
              </SliderTrack>
              <SliderThumb />
            </Slider>
          </FormControl>

          <FormControl display="flex" alignItems="center" gap="12px">
            <Switch
              isChecked={settings.maintenanceMode}
              onChange={(e) =>
                setSettings((s) => ({ ...s, maintenanceMode: e.target.checked }))
              }
              colorScheme="red"
            />
            <Box>
              <HStack>
                <Text fontSize="sm" color={textColor} fontWeight="500">Maintenance Mode</Text>
                {settings.maintenanceMode && (
                  <Badge colorScheme="red" borderRadius="8px" px="8px">ACTIVE</Badge>
                )}
              </HStack>
              <Text fontSize="xs" color={secondaryText}>
                Blocks all API requests when enabled
              </Text>
            </Box>
          </FormControl>
        </VStack>
      </Box>

      {/* Actions */}
      <Flex gap="12px" justify="flex-end">
        <Button
          variant="outline"
          borderRadius="10px"
          onClick={handleReset}
          fontSize="sm"
        >
          Reset to Defaults
        </Button>
        <Button
          colorScheme="brand"
          borderRadius="10px"
          onClick={handleSave}
          isLoading={saving}
          loadingText="Saving..."
          fontSize="sm"
          px="24px"
        >
          Save Settings
        </Button>
      </Flex>
    </VStack>
  );
}


