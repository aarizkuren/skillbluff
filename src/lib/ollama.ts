"use server";

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
 * Extrae el primer objeto JSON válido del texto, manejando anidamiento.
 */
function extractJson(text: string): unknown {
  console.log('=== RAW OLLAMA RESPONSE ===');
  console.log(text);
  console.log('==========================');
  
  // Limpiar markdown ```json ... ```
  const cleaned = text
    .replace(/```json\s*/gi, '')
    .replace(/```\s*$/gi, '')
    .trim();
  
  // Encontrar el primer objeto JSON balanceado
  let startIdx = -1;
  let braceCount = 0;
  let inString = false;
  let escaped = false;
  
  for (let i = 0; i < cleaned.length; i++) {
    const char = cleaned[i];
    
    if (escaped) {
      escaped = false;
      continue;
    }
    
    if (char === '\\') {
      escaped = true;
      continue;
    }
    
    if (char === '"' && !escaped) {
      inString = !inString;
      continue;
    }
    
    if (!inString) {
      if (char === '{') {
        if (braceCount === 0) {
          startIdx = i;
        }
        braceCount++;
      } else if (char === '}') {
        braceCount--;
        if (braceCount === 0 && startIdx !== -1) {
          // Encontramos el JSON completo
          const jsonStr = cleaned.substring(startIdx, i + 1);
          console.log('=== EXTRACTED JSON ===');
          console.log(jsonStr.substring(0, 500));
          console.log('======================');
          
          try {
            const parsed = JSON.parse(jsonStr);
            console.log('✅ JSON parsed successfully');
            return parsed;
          } catch (e) {
            console.log('❌ Initial parse failed, trying sanitization...');
            // Si falla, intentar sanitizar
            return parseWithSanitization(jsonStr);
          }
        }
      }
    }
  }
  
  // Si no encontramos JSON balanceado, intentar buscar cualquier cosa entre llaves
  console.log('⚠️ No balanced JSON found, trying fallback...');
  const fallbackMatch = cleaned.match(/\{[\s\S]*\}/);
  if (fallbackMatch) {
    return parseWithSanitization(fallbackMatch[0]);
  }
  
  throw new Error('No JSON found in response');
}

/**
 * Intenta parsear JSON sanitizando caracteres problemáticos.
 */
function parseWithSanitization(jsonStr: string): unknown {
  // Primero intentar parsear tal cual
  try {
    return JSON.parse(jsonStr);
  } catch (e) {
    // Si falla, sanitizar caracteres de control dentro de strings
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
        result += char;
        continue;
      }
      
      if (inString) {
        // Dentro de string: escapar caracteres de control
        if (char === '\n') result += '\\n';
        else if (char === '\r') result += '\\r';
        else if (char === '\t') result += '\\t';
        else if (char < ' ' && char !== '\n') {
          // Otros caracteres de control, ignorar
          continue;
        } else {
          result += char;
        }
      } else {
        result += char;
      }
    }
    
    console.log('=== SANITIZED JSON ===');
    console.log(result.substring(0, 500));
    console.log('======================');
    
    return JSON.parse(result);
  }
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
    display_name: expectedName.slice(0, 100), // Usar el nombre/prompt del usuario, no el del LLM
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
  "display_name": "${name}",
  "description": "Frase corta e irónica (máx 120 chars)",
  "language": "${language}",
  "tags": ["useless", "certified-fake"],
  "difficulty": "easy",
  "uselessness_score": 7,
  "content": "# Título creativo del LLM aquí\\n\\nTexto del skill con \\n para saltos de línea. Puedes usar un título creativo diferente al del usuario.",
  "warnings": ["Esta skill es falsa", "No intentes esto en casa"],
  "original_prompt": "${prompt}"
}

REGLAS IMPORTANTES:
- El display_name DEBE ser exactamente: "${name}" (el nombre que escribió el usuario)
- El LLM puede poner su título creativo DENTRO del content (ej: "# Mi título creativo")
- tags: SOLO puedes usar de esta lista [${VALID_TAGS.join(', ')}]
- difficulty: SOLO puedes usar [trivial, easy, medium, hard, impossible]
- uselessness_score: número del 1 al 10
- content: usa \\n para saltos de línea (no saltos reales)
- description: máximo 120 caracteres
- Sin markdown, solo JSON puro
- IMPORTANTE: El JSON debe ser un objeto único, sin texto antes ni después

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
