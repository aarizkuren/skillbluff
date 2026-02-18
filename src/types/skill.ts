export interface Skill {
  // Identidad
  id: string;
  name: string;
  displayName: string;
  
  // Metadata
  description: string;
  language: "en" | "es" | string;
  tags: string[];
  
  // Gamificación
  difficulty: "trivial" | "easy" | "medium" | "hard" | "impossible";
  uselessnessScore: number;
  votesCount: number;
  
  // Contenido
  content: string;
  warnings: string[];
  
  // Contexto
  originalPrompt: string;
  
  // DB fields
  createdAt: string;
  wordCount: number;
}

// Tipo para la entrada del LLM (antes de guardar en DB)
export interface FakeSkillInput {
  name: string;
  display_name: string;
  description: string;
  language: "en" | "es";
  tags: string[];
  difficulty: "trivial" | "easy" | "medium" | "hard" | "impossible";
  uselessness_score: number;
  content: string;
  warnings: string[];
  original_prompt: string;
}
