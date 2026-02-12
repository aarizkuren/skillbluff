export interface Skill {
  id: string;
  name: string;
  displayName: string;
  description: string;
  prompt: string;
  content: string;
  language: string;
  createdAt: string;
  wordCount?: number;
}
