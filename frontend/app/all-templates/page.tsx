'use client';
import {
  Box, Grid, GridItem, Flex, Heading, Text, Badge, Icon,
  useColorModeValue, Input, InputGroup, InputLeftElement,
} from '@chakra-ui/react';
import {
  MdEdit, MdAutoFixHigh, MdShoppingBag, MdEmail, MdPeople,
  MdCameraAlt, MdQuestionAnswer, MdLightbulb, MdSearch,
  MdStar, MdBusiness, MdArticle, MdAutoAwesome,
} from 'react-icons/md';
import NextLink from 'next/link';
import { useState } from 'react';

const tools = [
  { name: 'Essay Generator', description: 'Generate well-structured essays on any topic.', path: '/essay', icon: MdEdit, gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', category: 'Writing' },
  { name: 'Content Simplifier', description: 'Rewrite complex content into simple language.', path: '/simplifier', icon: MdAutoFixHigh, gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', category: 'Writing' },
  { name: 'Article Generator', description: 'Generate SEO-optimized articles and blog posts.', path: '/article', icon: MdArticle, gradient: 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)', category: 'Writing' },
  { name: 'Product Description', description: 'Write compelling product descriptions that convert.', path: '/product-description', icon: MdShoppingBag, gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', category: 'Marketing' },
  { name: 'Email Enhancer', description: 'Transform drafts into polished professional emails.', path: '/email-enhancer', icon: MdEmail, gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', category: 'Business' },
  { name: 'LinkedIn Message', description: 'Craft personalized LinkedIn outreach messages.', path: '/linkedin-message', icon: MdPeople, gradient: 'linear-gradient(135deg, #0077B5 0%, #00A0DC 100%)', category: 'Business' },
  { name: 'Instagram Caption', description: 'Generate captions with hashtags that boost reach.', path: '/caption', icon: MdCameraAlt, gradient: 'linear-gradient(135deg, #f77062 0%, #fe5196 100%)', category: 'Social Media' },
  { name: 'FAQs Content', description: 'Generate comprehensive FAQ sections instantly.', path: '/faq', icon: MdQuestionAnswer, gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', category: 'Marketing' },
  { name: 'Product Name Generator', description: 'Generate creative, memorable product names.', path: '/name-generator', icon: MdLightbulb, gradient: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)', category: 'Marketing' },
  { name: 'SEO Keywords', description: 'Research high-impact keywords to drive traffic.', path: '/seo-keywords', icon: MdSearch, gradient: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)', category: 'Marketing' },
  { name: 'Review Responder', description: 'Generate professional responses to customer reviews.', path: '/review-responder', icon: MdStar, gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)', category: 'Business' },
  { name: 'Business Idea Generator', description: 'Discover validated business ideas tailored to you.', path: '/business-generator', icon: MdBusiness, gradient: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)', category: 'Business' },
];

const categories = ['All', 'Writing', 'Marketing', 'Business', 'Social Media'];
const categoryColors: Record<string, string> = {
  Writing: 'purple', Marketing: 'blue', Business: 'green', 'Social Media': 'pink',
};

export default function AllTemplatesPage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const textColor = useColorModeValue('navy.700', 'white');
  const subText = useColorModeValue('gray.500', 'gray.400');
  const cardBg = useColorModeValue('white', 'navy.800');
  const cardHover = useColorModeValue('gray.50', 'navy.700');
  const borderColor = useColorModeValue('gray.100', 'whiteAlpha.100');
  const categoryBg = useColorModeValue('gray.100', 'navy.700');
  const activeCategoryBg = useColorModeValue('brand.500', 'brand.400');

  const filtered = tools.filter((t) => {
    const matchCategory = activeCategory === 'All' || t.category === activeCategory;
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <Box pt={{ base: '10px', md: '20px' }}>
      {/* Header */}
      <Flex mb="32px" align={{ base: 'start', md: 'center' }} direction={{ base: 'column', md: 'row' }} gap="16px">
        <Box flex="1">
          <Flex align="center" gap="12px" mb="6px">
            <Flex w="44px" h="44px" borderRadius="12px" bg="linear-gradient(15.46deg, #4A25E1 26.3%, #7B5AFF 86.4%)" align="center" justify="center">
              <Icon as={MdAutoAwesome} color="white" w="22px" h="22px" />
            </Flex>
            <Heading fontSize={{ base: 'xl', md: '2xl' }} color={textColor} fontWeight="700">
              All AI Templates
            </Heading>
          </Flex>
          <Text color={subText} fontSize="sm">
            {tools.length} ready-to-use AI tools — pick one and start generating.
          </Text>
        </Box>
        <InputGroup maxW="280px">
          <InputLeftElement pointerEvents="none">
            <Icon as={MdSearch} color={subText} />
          </InputLeftElement>
          <Input
            placeholder="Search templates..."
            borderRadius="14px"
            fontSize="sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </InputGroup>
      </Flex>

      {/* Category filters */}
      <Flex gap="10px" mb="28px" wrap="wrap">
        {categories.map((cat) => (
          <Box
            key={cat}
            as="button"
            px="16px"
            py="8px"
            borderRadius="20px"
            fontSize="sm"
            fontWeight="600"
            cursor="pointer"
            transition="all 0.2s"
            bg={activeCategory === cat ? activeCategoryBg : categoryBg}
            color={activeCategory === cat ? 'white' : textColor}
            onClick={() => setActiveCategory(cat)}
            _hover={{ opacity: 0.85 }}
          >
            {cat}
          </Box>
        ))}
      </Flex>

      {/* Tool grid */}
      <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', xl: 'repeat(3, 1fr)' }} gap="20px">
        {filtered.map((tool) => (
          <GridItem key={tool.path}>
            <NextLink href={tool.path} style={{ textDecoration: 'none' }}>
              <Box
                bg={cardBg}
                border="1px solid"
                borderColor={borderColor}
                borderRadius="20px"
                p="22px"
                cursor="pointer"
                transition="all 0.2s"
                boxShadow="14px 17px 40px 4px rgba(112, 144, 176, 0.06)"
                _hover={{ bg: cardHover, transform: 'translateY(-3px)', boxShadow: '14px 17px 40px 4px rgba(112, 144, 176, 0.15)' }}
              >
                <Flex align="center" gap="14px" mb="12px">
                  <Flex
                    w="48px" h="48px" borderRadius="14px"
                    background={tool.gradient} align="center" justify="center" flexShrink={0}
                  >
                    <Icon as={tool.icon} color="white" w="22px" h="22px" />
                  </Flex>
                  <Box flex="1" minW={0}>
                    <Text fontWeight="700" fontSize="sm" color={textColor} noOfLines={1}>
                      {tool.name}
                    </Text>
                    <Badge
                      colorScheme={categoryColors[tool.category] || 'gray'}
                      borderRadius="20px"
                      fontSize="10px"
                      px="8px"
                      textTransform="none"
                    >
                      {tool.category}
                    </Badge>
                  </Box>
                </Flex>
                <Text fontSize="sm" color={subText} lineHeight="1.5" noOfLines={2}>
                  {tool.description}
                </Text>
                <Flex mt="14px" align="center">
                  <Text fontSize="xs" fontWeight="600" color="brand.500">
                    Use this template →
                  </Text>
                </Flex>
              </Box>
            </NextLink>
          </GridItem>
        ))}
      </Grid>

      {filtered.length === 0 && (
        <Flex direction="column" align="center" justify="center" h="200px" color={subText}>
          <Icon as={MdSearch} w="40px" h="40px" mb="12px" opacity={0.4} />
          <Text fontSize="sm">No templates found for "{search}"</Text>
        </Flex>
      )}
    </Box>
  );
}

