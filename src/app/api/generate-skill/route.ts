import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { generateFakeSkill } from '@/lib/ollama';
import { detectLanguage, normalizeName, generateId, countWords } from '@/lib/utils';
import { Skill } from '@/types/skill';
import { saveSkill } from '@/lib/supabase';
import { FakeSkillSchema } from '@/lib/schema';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { prompt } = body;

    // Validaciones básicas
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

    // Generar skill con Ollama (devuelve JSON)
    const skillInput = await generateFakeSkill({ prompt, language, name });

    // Validar con Zod
    const validation = FakeSkillSchema.safeParse(skillInput);
    
    if (!validation.success) {
      console.error('Zod validation error:', validation.error);
      return NextResponse.json({ 
        error: 'La skill generada no cumple el formato requerido',
        details: validation.error.issues 
      }, { status: 422 });
    }

    const validatedData = validation.data;

    // Generar ID
    const id = generateId(name);

    // Crear objeto Skill completo
    const skill: Skill = {
      id,
      name: validatedData.name,
      displayName: validatedData.display_name,
      description: validatedData.description,
      language: validatedData.language,
      tags: validatedData.tags,
      difficulty: validatedData.difficulty,
      uselessnessScore: validatedData.uselessness_score,
      votesCount: 0,
      content: validatedData.content,
      warnings: validatedData.warnings,
      originalPrompt: validatedData.original_prompt,
      createdAt: new Date().toISOString(),
      wordCount: countWords(validatedData.content),
    };

    // Guardar en Supabase
    await saveSkill(skill);

    // Revalidar sitemap
    revalidatePath('/sitemap.xml');

    return NextResponse.json({ success: true, skill });
  } catch (error) {
    console.error('Error generando skill:', error);
    return NextResponse.json({ error: 'Error generando skill' }, { status: 500 });
  }
}
