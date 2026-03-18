import ReactMarkdown from 'react-markdown'
import { useColorModeValue, Box, Text, VStack } from '@chakra-ui/react'
import Card from '@/components/card/Card'

export default function MessageBox(props: { output: string; references?: string[] }) {
  const { output, references = [] } = props
  const textColor = useColorModeValue('navy.700', 'white')
  const gray = useColorModeValue('gray.500', 'whiteAlpha.600')
  return (
    <Card
      display={output ? 'flex' : 'none'}
      px="22px !important"
      pl="22px !important"
      color={textColor}
      minH="450px"
      fontSize={{ base: 'sm', md: 'md' }}
      lineHeight={{ base: '24px', md: '26px' }}
      fontWeight="500"
    >
      <VStack align="start" spacing={4}>
        <Box>
          <ReactMarkdown className="font-medium">
            {output ? output : ''}
          </ReactMarkdown>
        </Box>
        {references.length > 0 && (
          <Box>
            <Text fontSize="sm" fontWeight="bold" color={gray} mb={2}>
              Sources:
            </Text>
            <VStack align="start" spacing={1}>
              {references.map((ref, index) => (
                <Text key={index} fontSize="sm" color={gray}>
                  {ref}
                </Text>
              ))}
            </VStack>
          </Box>
        )}
      </VStack>
    </Card>
  )
}
