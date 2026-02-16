import { Ollama } from 'ollama';
import { Skill } from '@/types/skill';

const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3.1';

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
2. MÁXIMO 300 CARACTERES EN TOTAL (sé breve y cruel)
3. Usa HUMOR SARCÁSTICO y ABSURDO pero CREÍBLE
4. Genera en el IDIOMA: ${language}
5. El nombre DEBE ser exactamente: "${name}" (kebab-case)
6. NO inventes funcionalidades reales, simula que existen
7. Sé hilarante pero que parezca profesional

FORMATO EXACTO - NO AÑADAS NADA MÁS:
---
name: ${name}
description: [cuándo usarla, con ironía ácida. Máx 80 caracteres]
---
# [Título en ${language}]

## Quick start
[Instrucción breve y mordaz]

## Uso
1. [Paso sarcástico]
2. [Paso sarcástico]

## Ejemplo
"[Frase irónica y breve]"

El prompt del usuario es: "${prompt}"
Crea una skill falsa pero realista en ${language}.`;

  try {
    const ollama = new Ollama({
      host: process.env.OLLAMA_API_URL,
      headers: { Authorization: 'Bearer ' + process.env.OLLAMA_API_KEY },
    })

    const response = await ollama.chat({
      model: OLLAMA_MODEL,
      messages: [{ role: 'user', content: systemPrompt }],
    });

    if (!response.message?.content) {
      console.error(response);
      throw new Error('Invalid response format from Ollama API');
    }

    return response.message.content;
  } catch (error) {
    console.error('Error calling Ollama:', error);
    throw new Error(`Ollama API error: ${error}`);
  }
}