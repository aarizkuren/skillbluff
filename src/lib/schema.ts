import { z } from "zod";

// Tags predefinidos para filtrado
export const VALID_TAGS = [
  "automation",
  "useless", 
  "dangerous",
  "productivity",
  "social",
  "creative",
  "health",
  "food",
  "pets",
  "technology",
  "home",
  "work",
  "entertainment",
  "suspicious",
  "certified-fake"
] as const;

// Schema Zod para validar respuesta del LLM
export const FakeSkillSchema = z.object({
  // Identidad
  name: z.string()
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Must be kebab-case")
    .min(3)
    .max(50),
  
  display_name: z.string()
    .min(3)
    .max(100),
  
  // Metadata
  description: z.string()
    .min(10)
    .max(200),
  
  language: z.enum(["en", "es"]),
  
  tags: z.array(z.enum(VALID_TAGS))
    .min(1)
    .max(5),
  
  // Gamificación  
  difficulty: z.enum(["trivial", "easy", "medium", "hard", "impossible"]),
  
  uselessness_score: z.number()
    .int()
    .min(1)
    .max(10),
  
  // Contenido
  content: z.string()
    .min(100),
  
  warnings: z.array(z.string())
    .min(1)
    .max(5),
  
  // Contexto
  original_prompt: z.string()
    .min(1)
    .max(100),
});

export type FakeSkillInput = z.infer<typeof FakeSkillSchema>;

// Schema completo con campos de DB
export const SkillSchema = FakeSkillSchema.extend({
  id: z.string().uuid(),
  votes_count: z.number().int().min(0).default(0),
  created_at: z.string().datetime(),
  word_count: z.number().int().min(0),
});

export type Skill = z.infer<typeof SkillSchema>;
