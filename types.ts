export interface Subtask {
  id: string;
  title: string;
  isCompleted: boolean;
}

export interface AIAssistance {
  steps: string[];
  proTip: string;
  searchQuery: string;
  resources: string[];
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  category: string;
  priority: 'High' | 'Medium' | 'Low';
  subtasks: Subtask[];
  isCompleted: boolean;
  createdAt: number;
  aiRemark?: string; 
  source?: 'voice' | 'clipboard' | 'manual';
  links?: string[];
  reminderTime?: number;
  aiAssistance?: AIAssistance; // New field for deep dive content
}

export interface AIAnalysisResult {
  title: string;
  description: string;
  category: string;
  priority: 'High' | 'Medium' | 'Low';
  subtasks: string[];
  remark: string;
  links: string[];
}