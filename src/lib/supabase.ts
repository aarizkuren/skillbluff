import { createClient } from '@supabase/supabase-js';
import { Skill } from '@/types/skill';

// Usar SECRET KEY - solo en backend
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SECRET_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables. Check SUPABASE_URL and SUPABASE_SECRET_KEY');
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

export async function loadSkills(): Promise<Skill[]> {
  const { data, error } = await supabase
    .from('skills')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error loading skills:', error);
    return [];
  }
  
  return (data || []).map(mapSupabaseToSkill);
}

export async function getTopSkills(page: number = 0, limit: number = 12): Promise<Skill[]> {
  const { data, error } = await supabase
    .from('skills')
    .select('*')
    .order('votes_count', { ascending: false })
    .order('created_at', { ascending: false })
    .range(page * limit, (page + 1) * limit - 1);
  
  if (error) {
    console.error('Error loading top skills:', error);
    return [];
  }
  
  return (data || []).map(mapSupabaseToSkill);
}

export async function saveSkill(skill: Skill): Promise<void> {
  const { error } = await supabase
    .from('skills')
    .insert([{
      id: skill.id,
      name: skill.name,
      display_name: skill.displayName,
      description: skill.description,
      language: skill.language,
      tags: skill.tags,
      difficulty: skill.difficulty,
      uselessness_score: skill.uselessnessScore,
      votes_count: skill.votesCount,
      content: skill.content,
      warnings: skill.warnings,
      original_prompt: skill.originalPrompt,
      word_count: skill.wordCount,
      created_at: skill.createdAt,
    }]);
  
  if (error) {
    console.error('Error saving skill:', error);
    throw new Error('Failed to save skill');
  }
}

export async function getRandomSkill(): Promise<Skill | null> {
  const { data, error } = await supabase
    .from('skills')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100);
  
  if (error || !data || data.length === 0) {
    console.error('Error loading random skill:', error);
    return null;
  }
  
  // Seleccionar aleatoriamente entre las 100 más recientes
  const randomIndex = Math.floor(Math.random() * data.length);
  return mapSupabaseToSkill(data[randomIndex]);
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
  
  return mapSupabaseToSkill(data);
}

// Helper para mapear de Supabase (snake_case) a TypeScript (camelCase)
function mapSupabaseToSkill(data: any): Skill {
  return {
    id: data.id,
    name: data.name,
    displayName: data.display_name,
    description: data.description,
    language: data.language,
    tags: data.tags || [],
    difficulty: data.difficulty || 'medium',
    uselessnessScore: data.uselessness_score || 5,
    votesCount: data.votes_count || 0,
    content: data.content,
    warnings: data.warnings || [],
    originalPrompt: data.original_prompt || '',
    createdAt: data.created_at,
    wordCount: data.word_count || 0,
  };
}
