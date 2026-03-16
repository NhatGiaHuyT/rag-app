'use client';
import {
  Box,
  Flex,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  useColorModeValue,
} from '@chakra-ui/react';
import Card from '@/components/card/Card';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: React.ReactElement;
  iconBg?: string;
}

export default function StatsCard({
  title,
  value,
  change,
  changeLabel,
  icon,
  iconBg,
}: StatsCardProps) {
  const textColor = useColorModeValue('navy.700', 'white');
  const textColorSecondary = useColorModeValue('secondaryGray.600', 'white');
  const bg = iconBg || useColorModeValue('brand.500', 'brand.400');

  return (
    <Card p="20px">
      <Flex align="center" gap="16px">
        <Flex
          w="56px"
          h="56px"
          borderRadius="12px"
          bg={bg}
          align="center"
          justify="center"
          flexShrink={0}
        >
          <Box color="white" fontSize="24px">
            {icon}
          </Box>
        </Flex>
        <Stat>
          <StatLabel
            color={textColorSecondary}
            fontSize="sm"
            fontWeight="500"
            mb="4px"
          >
            {title}
          </StatLabel>
          <StatNumber color={textColor} fontSize="2xl" fontWeight="700">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </StatNumber>
          {change !== undefined && (
            <StatHelpText mb="0" fontSize="xs" color={textColorSecondary}>
              <StatArrow type={change >= 0 ? 'increase' : 'decrease'} />
              {Math.abs(change)}% {changeLabel || 'vs last month'}
            </StatHelpText>
          )}
        </Stat>
      </Flex>
    </Card>
  );
}


