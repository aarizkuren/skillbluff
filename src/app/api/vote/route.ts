import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SECRET_KEY || '';

// Ratelimit simple en memoria (en prod usar Redis)
const rateLimitMap = new Map<string, number>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minuto

export async function POST(request: Request) {
  try {
    const { skillId, ipHash } = await request.json();

    if (!skillId || typeof skillId !== 'string') {
      return NextResponse.json({ error: 'Skill ID requerido' }, { status: 400 });
    }

    // Generar hash de IP si no se proporciona (fallback)
    const clientIpHash = ipHash || 'anonymous';
    
    // Rate limiting: 1 voto por minuto por IP (viral pero no spam)
    const now = Date.now();
    const lastVote = rateLimitMap.get(clientIpHash);
    if (lastVote && now - lastVote < RATE_LIMIT_WINDOW) {
      const waitSeconds = Math.ceil((RATE_LIMIT_WINDOW - (now - lastVote)) / 1000);
      return NextResponse.json({ 
        error: 'Too many votes', 
        waitSeconds,
        message: `Espera ${waitSeconds}s para votar otra vez` 
      }, { status: 429 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // Insertar voto (viral: permitir múltiples, pero con rate limit)
    // La tabla votes tiene índice único, hacemos upsert para "refrescar" el voto
    const { error: voteError } = await supabase
      .from('votes')
      .upsert({
        skill_id: skillId,
        ip_hash: clientIpHash,
        created_at: new Date().toISOString(),
      }, {
        onConflict: 'skill_id,ip_hash',
        ignoreDuplicates: false, // Actualizar timestamp si existe
      });

    if (voteError) {
      console.error('Error inserting vote:', voteError);
      return NextResponse.json({ error: 'Error al registrar voto' }, { status: 500 });
    }

    // Actualizar contador en skills
    const { data: updatedSkill, error: updateError } = await supabase
      .from('skills')
      .update({ votes_count: supabase.rpc('increment_vote', { skill_id: skillId }) })
      .eq('id', skillId)
      .select('votes_count')
      .single();

    // Fallback: si RPC no existe, hacerlo manual
    if (updateError) {
      // Contar votos actuales
      const { count } = await supabase
        .from('votes')
        .select('*', { count: 'exact', head: true })
        .eq('skill_id', skillId);
      
      const { data } = await supabase
        .from('skills')
        .update({ votes_count: count || 0 })
        .eq('id', skillId)
        .select('votes_count')
        .single();
      
      rateLimitMap.set(clientIpHash, now);
      
      return NextResponse.json({ 
        success: true, 
        votesCount: data?.votes_count || 0 
      });
    }

    // Actualizar rate limit
    rateLimitMap.set(clientIpHash, now);

    return NextResponse.json({ 
      success: true, 
      votesCount: updatedSkill?.votes_count || 0 
    });

  } catch (error) {
    console.error('Error voting:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}

// GET: obtener conteo de votos para una skill
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const skillId = searchParams.get('skillId');

    if (!skillId) {
      return NextResponse.json({ error: 'Skill ID requerido' }, { status: 400 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { count } = await supabase
      .from('votes')
      .select('*', { count: 'exact', head: true })
      .eq('skill_id', skillId);

    return NextResponse.json({ votesCount: count || 0 });

  } catch (error) {
    console.error('Error getting votes:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
