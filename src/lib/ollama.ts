import { Ollama } from 'ollama';
import { FakeSkillInput } from '@/types/skill';

const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'qwen3:4b-cloud';

// Tags disponibles para el LLM
const VALID_TAGS = [
  "automation", "useless", "dangerous", "productivity", "social",
  "creative", "health", "food", "pets", "technology",
  "home", "work", "entertainment", "suspicious", "certified-fake"
];

interface GenerateFakeSkillParams {
  prompt: string;
  language: string;
  name: string;
}

/**
 * Normaliza un string a kebab-case válido (a-z0-9 con guiones)
 */
function normalizeToKebabCase(str: string): string {
  return str
    .toLowerCase()
    .replace(/_/g, '-')           // guiones bajos → guiones
    .replace(/[^a-z0-9-]/g, '')   // solo alfanuméricos y guiones
    .replace(/-+/g, '-')          // múltiples guiones → uno
    .replace(/^-|-$/g, '');      // quita guiones al inicio/final
}

/**
 * Extrae JSON de respuesta y lo parsea
 */
function extractJson(text: string): unknown {
  console.log('Raw response:', text.substring(0, 300));
  
  // Limpiar markdown ```json ... ```
  let cleaned = text
    .replace(/```json\s*/gi, '')
    .replace(/```\s*$/gi, '')
    .trim();
  
  // Buscar objeto JSON
  const match = cleaned.match(/\{[\s\S]*\}/);
  if (!match) throw new Error('No JSON found');
  
  // Sanitizar: escapar saltos de línea dentro de strings
  let jsonStr = match[0];
  let result = '';
  let inString = false;
  let escaped = false;
  
  for (const char of jsonStr) {
    if (escaped) {
      result += char;
      escaped = false;
      continue;
    }
    if (char === '\\') {
      result += char;
      escaped = true;
      continue;
    }
    if (char === '"' && !escaped) {
      inString = !inString;
    }
    if (inString && (char === '\n' || char === '\r')) {
      result += '\\n';
    } else if (inString && char === '\t') {
      result += '\\t';
    } else {
      result += char;
    }
  }
  
  console.log('Parsed JSON:', result.substring(0, 300));
  return JSON.parse(result);
}

/**
 * Normaliza los datos para cumplir el schema de Zod
 */
function normalizeSkillData(data: Record<string, unknown>, expectedName: string, expectedLang: string): FakeSkillInput {
  // Normalizar tags
  const rawTags = Array.isArray(data.tags) ? data.tags : [];
  const validTags = rawTags
    .filter((t): t is string => typeof t === 'string')
    .filter(t => VALID_TAGS.includes(t))
    .slice(0, 5);
  
  // Si no hay tags válidos, usar defaults según el contenido
  if (validTags.length === 0) {
    validTags.push('useless', 'certified-fake');
  }
  
  // Normalizar difficulty
  const validDifficulties = ['trivial', 'easy', 'medium', 'hard', 'impossible'] as const;
  type Difficulty = typeof validDifficulties[number];
  const difficulty = (validDifficulties.includes(String(data.difficulty) as Difficulty) 
    ? String(data.difficulty) 
    : 'medium') as Difficulty;
  
  // Normalizar uselessness_score
  let uselessnessScore = 5;
  if (typeof data.uselessness_score === 'number') {
    uselessnessScore = Math.max(1, Math.min(10, data.uselessness_score));
  }
  
  // Normalizar warnings
  const rawWarnings = Array.isArray(data.warnings) ? data.warnings : [];
  const warnings = rawWarnings
    .filter((w): w is string => typeof w === 'string')
    .slice(0, 3);
  if (warnings.length === 0) {
    warnings.push('Esta skill es completamente falsa e inútil');
  }
  
  return {
    name: normalizeToKebabCase(expectedName),
    display_name: String(data.display_name || expectedName).slice(0, 100),
    description: String(data.description || '').slice(0, 200),
    language: expectedLang === 'es' ? 'es' : 'en',
    tags: validTags,
    difficulty,
    uselessness_score: uselessnessScore,
    content: String(data.content || ''),
    warnings,
    original_prompt: String(data.original_prompt || expectedName)
  };
}

export async function generateFakeSkill({ prompt, language, name }: GenerateFakeSkillParams): Promise<FakeSkillInput> {
  const systemPrompt = `Responde SOLO con JSON. Sin markdown, sin explicaciones.

FORMATO JSON EXACTO (usa estos valores específicos):
{
  "name": "${name}",
  "display_name": "Título creativo (máx 50 chars)",
  "description": "Frase corta e irónica (máx 120 chars)",
  "language": "${language}",
  "tags": ["useless", "certified-fake"],
  "difficulty": "easy",
  "uselessness_score": 7,
  "content": "# Título\\n\\nTexto del skill con \\n para saltos de línea",
  "warnings": ["Esta skill es falsa", "No intentes esto en casa"],
  "original_prompt": "${prompt}"
}

REGLAS:
- tags: SOLO puedes usar de esta lista [${VALID_TAGS.join(', ')}]
- difficulty: SOLO puedes usar [trivial, easy, medium, hard, impossible]
- uselessness_score: número del 1 al 10
- content: usa \\n para saltos de línea (no saltos reales)
- description: máximo 120 caracteres
- Sin markdown, solo JSON puro

Genera skill falsa y divertida en ${language} sobre: "${prompt}"`;

  try {
    const ollama = new Ollama({
      host: process.env.OLLAMA_API_URL,
      headers: { Authorization: 'Bearer ' + process.env.OLLAMA_API_KEY },
    });

    const response = await ollama.chat({
      model: OLLAMA_MODEL,
      messages: [{ role: 'user', content: systemPrompt }],
    });

    if (!response.message?.content) {
      throw new Error('Invalid response from Ollama');
    }

    const parsed = extractJson(response.message.content);
    
    if (typeof parsed !== 'object' || parsed === null) {
      throw new Error('Parsed data is not an object');
    }
    
    return normalizeSkillData(parsed as Record<string, unknown>, name, language);
    
  } catch (error) {
    console.error('Error calling Ollama:', error);
    throw new Error(`Ollama API error: ${error}`);
  }
}
