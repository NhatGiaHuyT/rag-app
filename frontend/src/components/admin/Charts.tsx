'use client';
import { useColorModeValue } from '@chakra-ui/react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
} from 'recharts';
import { UsageDataPoint } from '@/types/types';

interface LineChartProps {
  data: UsageDataPoint[];
  dataKeys: { key: keyof UsageDataPoint; color: string; name: string }[];
  height?: number;
}

export function AdminLineChart({ data, dataKeys, height = 260 }: LineChartProps) {
  const gridColor = useColorModeValue('#E2E8F0', '#2D3748');
  const textColor = useColorModeValue('#718096', '#A0AEC0');

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
        <XAxis
          dataKey="date"
          tick={{ fill: textColor, fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: textColor, fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          contentStyle={{
            borderRadius: '12px',
            border: 'none',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          }}
        />
        <Legend />
        {dataKeys.map((dk) => (
          <Line
            key={dk.key as string}
            type="monotone"
            dataKey={dk.key as string}
            name={dk.name}
            stroke={dk.color}
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 5 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}

interface BarChartProps {
  data: UsageDataPoint[];
  dataKeys: { key: keyof UsageDataPoint; color: string; name: string }[];
  height?: number;
}

export function AdminBarChart({ data, dataKeys, height = 260 }: BarChartProps) {
  const gridColor = useColorModeValue('#E2E8F0', '#2D3748');
  const textColor = useColorModeValue('#718096', '#A0AEC0');

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
        <XAxis
          dataKey="date"
          tick={{ fill: textColor, fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: textColor, fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          contentStyle={{
            borderRadius: '12px',
            border: 'none',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          }}
        />
        <Legend />
        {dataKeys.map((dk) => (
          <Bar
            key={dk.key as string}
            dataKey={dk.key as string}
            name={dk.name}
            fill={dk.color}
            radius={[4, 4, 0, 0]}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}

