/**
 * Shared Type Definitions
 */

export interface UserProfile {
  id?: string;
  prenom: string;
  nom: string;
  email: string;
  job?: string;
  phone?: string;
  location?: string;
  bio?: string;
  role?: string;
  adresse?: string;
  created_at?: string;
  stats?: {
    projects: number;
    tasks: number;
    meetings: number;
  };
}

export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  participants: string;
  notes: string;
  user_id: string;
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  isWidget?: boolean;
  tool_used?: string | null;
  timeLabel?: string;
}

export interface Tool {
  name: string;
  description: string;
  args_schema?: Record<string, unknown>;
}

export interface HistoryMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface LoginResponse {
  access_token: string;
}
