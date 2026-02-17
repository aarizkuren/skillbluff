import { NextResponse } from 'next/server';
import { getTopSkills } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '0', 10);
    const limit = parseInt(searchParams.get('limit') || '12', 10);
    
    // Validar parámetros
    const validPage = Math.max(0, page);
    const validLimit = Math.min(50, Math.max(1, limit));
    
    const skills = await getTopSkills(validPage, validLimit);
    
    return NextResponse.json({ 
      skills,
      page: validPage,
      hasMore: skills.length === validLimit
    });
    
  } catch (error) {
    console.error('Error fetching top skills:', error);
    return NextResponse.json(
      { error: 'Failed to load skills', skills: [], page: 0, hasMore: false },
      { status: 500 }
    );
  }
}
