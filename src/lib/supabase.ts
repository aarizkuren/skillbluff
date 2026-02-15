import { createClient } from '@supabase/supabase-js';
import { Skill } from '@/types/skill';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function loadSkills(): Promise<Skill[]> {
  const { data, error } = await supabase
    .from('skills')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error loading skills:', error);
    return [];
  }
  
  return data || [];
}

export async function saveSkill(skill: Skill): Promise<void> {
  const { error } = await supabase
    .from('skills')
    .insert([{
      id: skill.id,
      name: skill.name,
      display_name: skill.displayName,
      description: skill.description,
      prompt: skill.prompt,
      content: skill.content,
      language: skill.language,
      word_count: skill.wordCount,
      created_at: skill.createdAt,
    }]);
  
  if (error) {
    console.error('Error saving skill:', error);
    throw new Error('Failed to save skill');
  }
}

export async function getSkillById(id: string): Promise<Skill | null> {
  const { data, error } = await supabase
    .from('skills')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error || !data) {
    return null;
  }
  
  return {
    id: data.id,
    name: data.name,
    displayName: data.display_name,
    description: data.description,
    prompt: data.prompt,
    content: data.content,
    language: data.language,
    createdAt: data.created_at,
    wordCount: data.word_count,
  };
}
