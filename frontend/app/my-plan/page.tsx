'use client';
import {
  Box, Flex, Heading, Text, Icon, useColorModeValue, Button,
  Badge, SimpleGrid, List, ListItem, ListIcon, Divider, VStack,
} from '@chakra-ui/react';
import { MdCheckCircle, MdRocketLaunch, MdStar, MdLock, MdOpenInNew } from 'react-icons/md';
const plans = [
  {
    name: 'Free',
    price: '$0',
    period: '',
    description: 'Perfect for getting started with AI tools.',
    color: 'gray',
    gradient: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    current: true,
    features: [
      'Chat UI (unlimited with your API key)',
      'All 12 AI Templates',
      'My Projects (local storage)',
      'Chat History (local storage)',
      'Profile Settings',
      'Admin Dashboard',
    ],
    locked: [],
  },
  {
    name: 'Pro',
    price: '$19',
    period: '/ month',
    description: 'For professionals who need more power.',
    color: 'brand',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    current: false,
    features: [
      'Everything in Free',
      'Cloud sync for projects & history',
      'Team collaboration (up to 5 users)',
      'Custom system prompts & personas',
      'API usage dashboard with analytics',
      'Priority email support',
    ],
    locked: ['Cloud sync', 'Team collaboration', 'Custom personas', 'Priority support'],
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For teams and organizations at scale.',
    color: 'purple',
    gradient: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
    current: false,
    features: [
      'Everything in Pro',
      'Unlimited team members',
      'SSO / SAML authentication',
      'Custom AI model fine-tuning',
      'SLA & dedicated support',
      'White-label option',
    ],
    locked: ['SSO', 'Fine-tuning', 'SLA', 'White-label'],
  },
];
export default function MyPlanPage() {
  const textColor = useColorModeValue('navy.700', 'white');
  const subText = useColorModeValue('gray.500', 'gray.400');
  const cardBg = useColorModeValue('white', 'navy.800');
  const borderColor = useColorModeValue('gray.100', 'whiteAlpha.100');
  const lockedColor = useColorModeValue('gray.300', 'gray.600');
  const faqBg = useColorModeValue('gray.50', 'navy.900');
  return (
    <Box pt={{ base: '10px', md: '20px' }}>
      <Flex align="center" gap="12px" mb="8px">
        <Flex w="44px" h="44px" borderRadius="12px" bg="linear-gradient(135deg, #f6d365 0%, #fda085 100%)" align="center" justify="center">
          <Icon as={MdRocketLaunch} color="white" w="22px" h="22px" />
        </Flex>
        <Heading fontSize={{ base: 'xl', md: '2xl' }} color={textColor} fontWeight="700">My Plan</Heading>
      </Flex>
      <Text color={subText} fontSize="sm" mb="32px">You are currently on the <strong>Free</strong> plan. Upgrade anytime to unlock more features.</Text>
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing="20px" mb="32px">
        {plans.map((plan) => (
          <Box
            key={plan.name}
            bg={cardBg}
            border="2px solid"
            borderColor={plan.current ? 'brand.400' : borderColor}
            borderRadius="20px"
            p="24px"
            boxShadow={plan.current ? '0 0 0 4px rgba(74,37,225,0.12)' : '14px 17px 40px 4px rgba(112,144,176,0.08)'}
            position="relative"
          >
            {plan.current && (
              <Badge position="absolute" top="-12px" left="50%" transform="translateX(-50%)" colorScheme="brand" borderRadius="20px" px="12px" py="4px" fontSize="xs">
                Current Plan
              </Badge>
            )}
            <Flex
              w="48px" h="48px" borderRadius="14px"
              background={plan.gradient} align="center" justify="center" mb="16px"
            >
              <Icon as={plan.name === 'Enterprise' ? MdStar : MdRocketLaunch} color="white" w="22px" h="22px" />
            </Flex>
            <Text fontWeight="800" fontSize="xl" color={textColor}>{plan.name}</Text>
            <Flex align="baseline" gap="4px" my="8px">
              <Text fontWeight="800" fontSize="2xl" color={textColor}>{plan.price}</Text>
              {plan.period && <Text fontSize="sm" color={subText}>{plan.period}</Text>}
            </Flex>
            <Text fontSize="sm" color={subText} mb="16px" lineHeight="1.5">{plan.description}</Text>
            <Divider mb="16px" />
            <VStack spacing="8px" align="stretch" mb="20px">
              {plan.features.map((f) => {
                const isLocked = !plan.current && plan.locked.some((l) => f.includes(l));
                return (
                  <Flex key={f} align="center" gap="8px">
                    <Icon as={isLocked ? MdLock : MdCheckCircle} color={isLocked ? lockedColor : 'green.400'} w="16px" h="16px" flexShrink={0} />
                    <Text fontSize="sm" color={isLocked ? lockedColor : textColor}>{f}</Text>
                  </Flex>
                );
              })}
            </VStack>
            {!plan.current ? (
              <Button
                w="100%" borderRadius="14px" fontSize="sm" h="44px"
                variant={plan.name === 'Pro' ? 'primary' : 'outline'}
                rightIcon={<Icon as={MdOpenInNew} />}
                _hover={plan.name === 'Pro' ? { bg: 'linear-gradient(15.46deg, #4A25E1 26.3%, #7B5AFF 86.4%)' } : {}}
              >
                {plan.name === 'Enterprise' ? 'Contact Sales' : 'Upgrade to Pro'}
              </Button>
            ) : (
              <Button w="100%" borderRadius="14px" fontSize="sm" h="44px" variant="outline" isDisabled>
                Active Plan
              </Button>
            )}
          </Box>
        ))}
      </SimpleGrid>
      <Box bg={cardBg} borderRadius="20px" p="24px" boxShadow="14px 17px 40px 4px rgba(112,144,176,0.08)">
        <Text fontWeight="700" fontSize="md" color={textColor} mb="12px">Frequently Asked Questions</Text>
        <VStack spacing="12px" align="stretch">
          {[
            { q: 'Do I need a paid plan to use AI features?', a: 'No. All AI features work with your own OpenAI API key on the Free plan.' },
            { q: 'How is the Free plan different from Pro?', a: 'Free stores everything in your browser (localStorage). Pro adds cloud sync, team features, and advanced settings.' },
            { q: 'Can I cancel anytime?', a: 'Yes. Pro is month-to-month with no long-term commitment.' },
          ].map((item) => (
            <Box key={item.q} bg={faqBg} borderRadius="12px" p="14px">
              <Text fontSize="sm" fontWeight="600" color={textColor} mb="4px">{item.q}</Text>
              <Text fontSize="sm" color={subText}>{item.a}</Text>
            </Box>
          ))}
        </VStack>
      </Box>
    </Box>
  );
}
