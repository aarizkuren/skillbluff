import { NextResponse } from 'next/server';
import { getRandomSkill } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const skill = await getRandomSkill();
    
    if (!skill) {
      return NextResponse.json(
        { error: 'No skills found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ skill });
    
  } catch (error) {
    console.error('Error fetching random skill:', error);
    return NextResponse.json(
      { error: 'Failed to load random skill' },
      { status: 500 }
    );
  }
}