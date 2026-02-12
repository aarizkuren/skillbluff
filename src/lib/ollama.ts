import { Skill } from '@/types/skill';

const OLLAMA_API_KEY = process.env.OLLAMA_API_KEY!;
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'kimi-k2.5:cloud';
const OLLAMA_API_URL = process.env.OLLAMA_API_URL || 'https://api.ollama.ai/v1/chat/completions';

interface GenerateFakeSkillParams {
  prompt: string;
  language: string;
  name: string;
}

export async function generateFakeSkill({ prompt, language, name }: GenerateFakeSkillParams): Promise<string> {
  const systemPrompt = `Eres un generador de SKILLS FALSAS para Claude Code. 
Crea skills irónicas y absurdas que parezcan reales pero son completamente ficticias.

REGLAS ESTRICTAS:
1. Genera SOLAMENTE YAML frontmatter + markdown simple
2. MÁXIMO 500-600 palabras en TOTAL (cuéntalas aproximado)
3. Usa HUMOR SARCÁSTICO y ABSURDO pero CREÍBLE
4. Genera en el IDIOMA: ${language}
5. El nombre DEBE ser exactamente: "${name}" (kebab-case)
6. NO inventes funcionalidades reales, simula que existen
7. Sé hilarante pero que parezca profesional

FORMATO EXACTO - NO AÑADAS NADA MÁS:
---
name: ${name}
description: [cuándo usarla, con ironía. Máx 200 caracteres]
---

# [Título en ${language}]

## Quick start
[Instrucciones absurdas pero creíbles. Manténlo simple]

## Uso
1. [Paso irónico]
2. [Paso irónico]
3. [Paso irónico]

## Ejemplo
"[Muestra de cómo usar la skill con sarcasmo]"

El prompt del usuario es: "${prompt}"
Crea una skill falsa pero realista en ${language}.`;

  const response = await fetch(OLLAMA_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OLLAMA_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      messages: [{ role: 'user', content: systemPrompt }],
      max_tokens: 1500,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    throw new Error(`Ollama API error: ${response.status}`);
  }

  const data = await response.json();
  
  if (!data.choices || !data.choices[0] || !data.choices[0].message?.content) {
    throw new Error('Invalid response format from Ollama API');
  }
  
  return data.choices[0].message.content;
}
