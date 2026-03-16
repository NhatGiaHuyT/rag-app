export type OpenAIModel = 'gpt-4o' | 'gpt-3.5-turbo';

export interface ChatBody {
  inputCode: string;
  model: OpenAIModel;
  apiKey?: string | undefined;
}

// Admin Dashboard Types
export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'moderator';
  status: 'active' | 'inactive' | 'suspended';
  totalChats: number;
  tokensUsed: number;
  joinedAt: string;
  lastActive: string;
  avatar?: string;
}

export interface ChatLog {
  id: string;
  userId: string;
  userName: string;
  model: OpenAIModel;
  prompt: string;
  response: string;
  tokensUsed: number;
  timestamp: string;
  duration: number; // in ms
}

export interface ApiKeyEntry {
  id: string;
  name: string;
  key: string;
  maskedKey: string;
  status: 'active' | 'revoked';
  createdAt: string;
  lastUsed: string;
  totalRequests: number;
}

export interface StatCard {
  title: string;
  value: string | number;
  change: number; // percentage change
  changeLabel: string;
  icon: string;
  color: string;
}

export interface UsageDataPoint {
  date: string;
  tokens: number;
  conversations: number;
  users: number;
}

export interface AdminSettings {
  defaultModel: OpenAIModel;
  temperature: number;
  maxTokens: number;
  systemPrompt: string;
  rateLimit: number;
  allowGpt4: boolean;
  maintenanceMode: boolean;
}
