export interface SavedChat {
  id: string;
  message: string;
  response: string;
  model: string;
  date: string;
  tool?: string;
  tokensEstimate: number;
}

export interface SavedProject {
  id: string;
  title: string;
  tool: string;
  content: string;
  date: string;
}

export interface UserProfile {
  name: string;
  email: string;
  bio: string;
  language: string;
  theme: string;
}

// ─── Chat History ───────────────────────────────────────────────────────────
export const getChatHistory = (): SavedChat[] => {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem('chatHistory') || '[]');
  } catch {
    return [];
  }
};

export const saveChat = (chat: Omit<SavedChat, 'id' | 'date' | 'tokensEstimate'>) => {
  const history = getChatHistory();
  const newChat: SavedChat = {
    ...chat,
    id: `chat_${Date.now()}`,
    date: new Date().toISOString(),
    tokensEstimate: Math.round((chat.message.length + chat.response.length) / 4),
  };
  history.unshift(newChat);
  if (history.length > 100) history.splice(100);
  localStorage.setItem('chatHistory', JSON.stringify(history));
  return newChat;
};

export const deleteChatHistory = (id: string) => {
  const history = getChatHistory().filter((c) => c.id !== id);
  localStorage.setItem('chatHistory', JSON.stringify(history));
};

export const clearAllChatHistory = () => {
  localStorage.removeItem('chatHistory');
};

// ─── Saved Projects ──────────────────────────────────────────────────────────
export const getSavedProjects = (): SavedProject[] => {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem('savedProjects') || '[]');
  } catch {
    return [];
  }
};

export const saveProject = (project: Omit<SavedProject, 'id' | 'date'>) => {
  const projects = getSavedProjects();
  const newProject: SavedProject = {
    ...project,
    id: `proj_${Date.now()}`,
    date: new Date().toISOString(),
  };
  projects.unshift(newProject);
  localStorage.setItem('savedProjects', JSON.stringify(projects));
  return newProject;
};

export const deleteProject = (id: string) => {
  const projects = getSavedProjects().filter((p) => p.id !== id);
  localStorage.setItem('savedProjects', JSON.stringify(projects));
};

// ─── User Profile ────────────────────────────────────────────────────────────
export const defaultProfile: UserProfile = {
  name: 'User',
  email: '',
  bio: '',
  language: 'en',
  theme: 'light',
};

export const getUserProfile = (): UserProfile => {
  if (typeof window === 'undefined') return defaultProfile;
  try {
    return {
      ...defaultProfile,
      ...JSON.parse(localStorage.getItem('userProfile') || '{}'),
    };
  } catch {
    return defaultProfile;
  }
};

export const saveUserProfile = (profile: UserProfile) => {
  localStorage.setItem('userProfile', JSON.stringify(profile));
};

// ─── Usage Stats ─────────────────────────────────────────────────────────────
export const getUsageStats = () => {
  const history = getChatHistory();
  const totalTokens = history.reduce((sum, c) => sum + c.tokensEstimate, 0);
  const totalRequests = history.length;
  const byModel = history.reduce(
    (acc, c) => {
      acc[c.model] = (acc[c.model] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );
  const byTool = history.reduce(
    (acc, c) => {
      const key = c.tool || 'Chat UI';
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  // last 7 days
  const days: { date: string; tokens: number; requests: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    const dayChats = history.filter((c) => c.date.startsWith(dateStr));
    days.push({
      date: dateStr,
      tokens: dayChats.reduce((s, c) => s + c.tokensEstimate, 0),
      requests: dayChats.length,
    });
  }

  return { totalTokens, totalRequests, byModel, byTool, days };
};

