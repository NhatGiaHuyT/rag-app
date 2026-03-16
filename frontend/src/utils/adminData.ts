import {
  AdminUser,
  ChatLog,
  ApiKeyEntry,
  UsageDataPoint,
  AdminSettings,
} from '@/types/types';

// ─── Mock Users ────────────────────────────────────────────────────────────────
export const mockUsers: AdminUser[] = [
  {
    id: 'u1',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    role: 'admin',
    status: 'active',
    totalChats: 342,
    tokensUsed: 128400,
    joinedAt: '2025-01-05',
    lastActive: '2026-03-15',
    avatar: '/img/avatars/avatar1.png',
  },
  {
    id: 'u2',
    name: 'Bob Smith',
    email: 'bob@example.com',
    role: 'user',
    status: 'active',
    totalChats: 178,
    tokensUsed: 64200,
    joinedAt: '2025-02-10',
    lastActive: '2026-03-14',
    avatar: '/img/avatars/avatar2.png',
  },
  {
    id: 'u3',
    name: 'Carol White',
    email: 'carol@example.com',
    role: 'moderator',
    status: 'active',
    totalChats: 256,
    tokensUsed: 95000,
    joinedAt: '2025-01-20',
    lastActive: '2026-03-12',
    avatar: '/img/avatars/avatar3.png',
  },
  {
    id: 'u4',
    name: 'David Lee',
    email: 'david@example.com',
    role: 'user',
    status: 'inactive',
    totalChats: 45,
    tokensUsed: 15300,
    joinedAt: '2025-06-01',
    lastActive: '2026-01-20',
    avatar: '/img/avatars/avatar4.png',
  },
  {
    id: 'u5',
    name: 'Emma Davis',
    email: 'emma@example.com',
    role: 'user',
    status: 'suspended',
    totalChats: 12,
    tokensUsed: 4200,
    joinedAt: '2025-09-15',
    lastActive: '2025-11-30',
    avatar: '/img/avatars/avatar5.png',
  },
  {
    id: 'u6',
    name: 'Frank Wilson',
    email: 'frank@example.com',
    role: 'user',
    status: 'active',
    totalChats: 89,
    tokensUsed: 32100,
    joinedAt: '2025-03-08',
    lastActive: '2026-03-15',
    avatar: '/img/avatars/avatar6.png',
  },
  {
    id: 'u7',
    name: 'Grace Kim',
    email: 'grace@example.com',
    role: 'user',
    status: 'active',
    totalChats: 204,
    tokensUsed: 73600,
    joinedAt: '2025-04-22',
    lastActive: '2026-03-13',
    avatar: '/img/avatars/avatar7.png',
  },
  {
    id: 'u8',
    name: 'Henry Brown',
    email: 'henry@example.com',
    role: 'user',
    status: 'active',
    totalChats: 67,
    tokensUsed: 24400,
    joinedAt: '2025-07-19',
    lastActive: '2026-03-10',
    avatar: '/img/avatars/avatar8.png',
  },
];

// ─── Mock Chat Logs ────────────────────────────────────────────────────────────
export const mockChatLogs: ChatLog[] = [
  {
    id: 'log1',
    userId: 'u1',
    userName: 'Alice Johnson',
    model: 'gpt-4o',
    prompt: 'Explain quantum computing in simple terms',
    response:
      'Quantum computing uses quantum mechanics principles like superposition and entanglement to process information differently from classical computers...',
    tokensUsed: 520,
    timestamp: '2026-03-15 14:32:00',
    duration: 2340,
  },
  {
    id: 'log2',
    userId: 'u2',
    userName: 'Bob Smith',
    model: 'gpt-3.5-turbo',
    prompt: 'Write a Python function to sort a list',
    response:
      'Here is a Python function to sort a list:\n\n```python\ndef sort_list(lst):\n    return sorted(lst)\n```',
    tokensUsed: 180,
    timestamp: '2026-03-15 13:15:00',
    duration: 1120,
  },
  {
    id: 'log3',
    userId: 'u3',
    userName: 'Carol White',
    model: 'gpt-4o',
    prompt: 'What are the best practices for React performance optimization?',
    response:
      'React performance optimization involves several strategies: 1. Use React.memo for component memoization...',
    tokensUsed: 840,
    timestamp: '2026-03-15 11:45:00',
    duration: 3200,
  },
  {
    id: 'log4',
    userId: 'u6',
    userName: 'Frank Wilson',
    model: 'gpt-3.5-turbo',
    prompt: 'Translate "Hello World" to French',
    response: '"Bonjour le monde"',
    tokensUsed: 65,
    timestamp: '2026-03-14 16:20:00',
    duration: 450,
  },
  {
    id: 'log5',
    userId: 'u7',
    userName: 'Grace Kim',
    model: 'gpt-4o',
    prompt: 'Create a marketing plan for a new SaaS product',
    response:
      'Here is a comprehensive marketing plan for your SaaS product: 1. Target Audience Analysis...',
    tokensUsed: 1240,
    timestamp: '2026-03-14 10:05:00',
    duration: 4560,
  },
  {
    id: 'log6',
    userId: 'u8',
    userName: 'Henry Brown',
    model: 'gpt-3.5-turbo',
    prompt: 'Explain the difference between TCP and UDP',
    response:
      'TCP (Transmission Control Protocol) and UDP (User Datagram Protocol) are both transport layer protocols...',
    tokensUsed: 390,
    timestamp: '2026-03-13 09:30:00',
    duration: 1890,
  },
  {
    id: 'log7',
    userId: 'u1',
    userName: 'Alice Johnson',
    model: 'gpt-4o',
    prompt: 'Write a technical blog post about microservices architecture',
    response:
      'Microservices Architecture: Building Scalable Systems\n\nIn todays cloud-native world...',
    tokensUsed: 1680,
    timestamp: '2026-03-13 15:45:00',
    duration: 5800,
  },
  {
    id: 'log8',
    userId: 'u2',
    userName: 'Bob Smith',
    model: 'gpt-3.5-turbo',
    prompt: 'Generate SQL query for finding duplicate records',
    response:
      'To find duplicate records in SQL:\n\n```sql\nSELECT column, COUNT(*) FROM table GROUP BY column HAVING COUNT(*) > 1;\n```',
    tokensUsed: 220,
    timestamp: '2026-03-12 11:20:00',
    duration: 980,
  },
];

// ─── Mock API Keys ─────────────────────────────────────────────────────────────
export const mockApiKeys: ApiKeyEntry[] = [
  {
    id: 'key1',
    name: 'Production Key',
    key: 'sk-prod-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    maskedKey: 'sk-prod-****...****xxxx',
    status: 'active',
    createdAt: '2025-01-15',
    lastUsed: '2026-03-15',
    totalRequests: 15482,
  },
  {
    id: 'key2',
    name: 'Development Key',
    key: 'sk-dev-yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy',
    maskedKey: 'sk-dev-****...****yyyy',
    status: 'active',
    createdAt: '2025-02-20',
    lastUsed: '2026-03-14',
    totalRequests: 3241,
  },
  {
    id: 'key3',
    name: 'Testing Key',
    key: 'sk-test-zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz',
    maskedKey: 'sk-test-****...****zzzz',
    status: 'revoked',
    createdAt: '2025-03-10',
    lastUsed: '2025-12-01',
    totalRequests: 892,
  },
];

// ─── Mock Usage Data ───────────────────────────────────────────────────────────
export const mockUsageData: UsageDataPoint[] = [
  { date: 'Mar 1', tokens: 42000, conversations: 128, users: 45 },
  { date: 'Mar 2', tokens: 38500, conversations: 112, users: 42 },
  { date: 'Mar 3', tokens: 55000, conversations: 165, users: 58 },
  { date: 'Mar 4', tokens: 48200, conversations: 143, users: 51 },
  { date: 'Mar 5', tokens: 62000, conversations: 188, users: 67 },
  { date: 'Mar 6', tokens: 35000, conversations: 98, users: 35 },
  { date: 'Mar 7', tokens: 29000, conversations: 84, users: 31 },
  { date: 'Mar 8', tokens: 68000, conversations: 205, users: 72 },
  { date: 'Mar 9', tokens: 71500, conversations: 218, users: 76 },
  { date: 'Mar 10', tokens: 58000, conversations: 174, users: 63 },
  { date: 'Mar 11', tokens: 75000, conversations: 226, users: 81 },
  { date: 'Mar 12', tokens: 82000, conversations: 248, users: 89 },
  { date: 'Mar 13', tokens: 91000, conversations: 274, users: 98 },
  { date: 'Mar 14', tokens: 87500, conversations: 262, users: 94 },
  { date: 'Mar 15', tokens: 95000, conversations: 286, users: 103 },
];

// ─── Default Settings ──────────────────────────────────────────────────────────
export const defaultAdminSettings: AdminSettings = {
  defaultModel: 'gpt-4o',
  temperature: 0.7,
  maxTokens: 2048,
  systemPrompt:
    'You are a helpful AI assistant. Answer questions clearly and concisely.',
  rateLimit: 100,
  allowGpt4: true,
  maintenanceMode: false,
};

// ─── Dashboard Stats ───────────────────────────────────────────────────────────
export const getDashboardStats = () => {
  const totalUsers = mockUsers.length;
  const activeUsers = mockUsers.filter((u) => u.status === 'active').length;
  const totalChats = mockChatLogs.length;
  const totalTokens = mockUsers.reduce((sum, u) => sum + u.tokensUsed, 0);

  return {
    totalUsers,
    activeUsers,
    totalChats,
    totalTokens,
    avgTokensPerChat: Math.round(totalTokens / totalChats),
    uptime: '99.8%',
  };
};

