import { franc } from 'franc';
import { slugify } from 'transliteration';

export function detectLanguage(prompt: string): string {
  const langCode = franc(prompt);
  return langCode || 'en';
}

export function normalizeName(prompt: string): string {
  const normalized = slugify(prompt, {
    lowercase: true,
    separator: '-',
    trim: true,
  } as any);
  return normalized.replace(/[^a-z0-9-]/g, '').substring(0, 50);
}

export function generateId(name: string): string {
  const randomId = Math.random().toString(36).substring(2, 8);
  return `${name}-${randomId}`;
}

export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
}

export function validateWordCount(content: string): boolean {
  const wordCount = countWords(content);
  return wordCount >= 400 && wordCount <= 800;
}
