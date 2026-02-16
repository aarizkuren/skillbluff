import { NextResponse } from 'next/server';
import { generateFakeSkill } from '@/lib/ollama';
import { detectLanguage, normalizeName, generateId, validateWordCount, countWords } from '@/lib/utils';
import { Skill } from '@/types/skill';
import { saveSkill } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { prompt } = body;

    // Validaciones
    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return NextResponse.json({ error: 'Prompt inválido' }, { status: 400 });
    }

    if (prompt.length > 100) {
      return NextResponse.json({ error: 'Prompt demasiado largo (máx 100 chars). Sé breve, como la vida.' }, { status: 400 });
    }

    // Detectar idioma
    const language = detectLanguage(prompt);

    // Normalizar nombre
    const name = normalizeName(prompt);
    if (!name || name.length < 3) {
      return NextResponse.json({ error: 'No se pudo generar un nombre válido' }, { status: 400 });
    }

    // Generar contenido con Ollama
    const content = await generateFakeSkill({ prompt, language, name });

    // Validar palabras (aproximado)
    if (!validateWordCount(content)) {
      console.warn(`Word count validation failed: ${countWords(content)} words`);
    }

    // Generar ID
    const id = generateId(name);

    // Crear objeto Skill
    const displayName = name.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    const description = content.match(/description:\s*(.+)/)?.[1]?.trim() || '';

    const skill: Skill = {
      id,
      name,
      displayName,
      description,
      prompt,
      content,
      language,
      createdAt: new Date().toISOString(),
      wordCount: countWords(content),
    };

    // Guardar en Supabase
    await saveSkill(skill);

    return NextResponse.json({ success: true, skill });
  } catch (error) {
    console.error('Error generando skill:', error);
    return NextResponse.json({ error: 'Error generando skill' }, { status: 500 });
  }
}
