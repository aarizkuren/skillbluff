import Link from 'next/link';
import { Skill } from '@/types/skill';
import { getSkillById } from '@/lib/supabase';
import ShareButton from './ShareButton';

// Forzar renderizado dinámico - las skills se crean en runtime
export const dynamic = 'force-dynamic';
export const dynamicParams = true;

async function getSkill(id: string): Promise<Skill | null> {
  return getSkillById(id);
}

export default async function SkillPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const skill = await getSkill(id);

  if (!skill) {
    return (
      <main className="min-h-screen py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-6xl mb-6">🚫</div>
          <h1 className="text-3xl font-bold text-[#fafafa] mb-4">
            Skill Not Found (Shocking, we know)
          </h1>
          <p className="text-[#666] mb-2">
            We couldn't find a fake skill with ID:
          </p>
          <code className="inline-block bg-[#1a1a1a] px-3 py-1 rounded text-[#ff6b9d] font-mono text-sm mb-6">
            {id}
          </code>
          <p className="text-[#555] text-sm max-w-md mx-auto mb-8">
            Either this skill never existed (very likely), was deleted (we don't delete anything), 
            or you're typing random URLs (we respect that).
          </p>
          <Link href="/" className="btn-fake-primary inline-flex items-center gap-2">
            <span>🎭</span> Create a Real Fake Skill
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen py-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-[#666] mb-6">
          <Link href="/" className="hover:text-[#ff6b9d] transition-colors">Fake Skills</Link>
          <span>/</span>
          <span className="text-[#888]">{skill.name}</span>
        </div>

        {/* Skill Header */}
        <div className="skill-card mb-8">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-3xl">🎭</span>
                <span className="fake-badge">
                  <span>★</span> FAKE SKILL #{id.slice(-4).toUpperCase()}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gradient-fake mb-2">
                {skill.displayName}
              </h1>
              <p className="text-[#888] text-sm max-w-xl">
                {skill.description || 'A completely unnecessary solution to a problem that probably does not exist.'}
              </p>
            </div>
            <div className="flex flex-col items-start md:items-end gap-2">
              <span className="suspicious-badge">
                <span className="w-1.5 h-1.5 bg-[#39ff14] rounded-full animate-pulse"></span>
                UNVERIFIED
              </span>
              <span className="text-xs text-[#555] font-mono">{skill.language}</span>
              <span className="text-xs text-[#ff6b9d]">~{skill.wordCount} words of nonsense</span>
            </div>
          </div>

          {/* Meta info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-y border-[#2a2a2a]">
            <div>
              <span className="text-xs text-[#555] block">Created</span>
              <span className="text-sm text-[#888]">
                {new Date(skill.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div>
              <span className="text-xs text-[#555] block">By</span>
              <span className="text-sm text-[#888]">An Algorithm</span>
            </div>
            <div>
              <span className="text-xs text-[#555] block">Quality</span>
              <span className="text-sm text-[#39ff14]">Questionable</span>
            </div>
            <div>
              <span className="text-xs text-[#555] block">Usefulness</span>
              <span className="text-sm text-[#ff6b9d]">Debatable</span>
            </div>
          </div>
        </div>

        {/* Skill Content */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[#fafafa] flex items-center gap-2">
              <span>📋</span> Skill Definition
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#555]">Format:</span>
              <span className="fake-badge text-[10px]">FAKE SKILL.md</span>
            </div>
          </div>
          <div className="skill-content-box text-sm leading-relaxed">
            {skill.content}
          </div>
        </div>

        {/* Original Prompt */}
        <div className="bg-[#1a1a1a] rounded-xl p-6 border border-[#2a2a2a] mb-8">
          <h3 className="text-sm font-medium text-[#888] mb-3 flex items-center gap-2">
            <span>💭</span> Original Misguided Request
          </h3>
          <blockquote className="border-l-2 border-[#ff6b9d] pl-4 py-2">
            <p className="text-[#aaa] italic">"{skill.prompt}"</p>
          </blockquote>
          <p className="text-xs text-[#555] mt-3">
            Someone actually thought this was a good idea to automate.
          </p>
        </div>

        {/* Warning box */}
        <div className="bg-gradient-to-r from-[#1a0a0a] to-[#2a1a1a] rounded-xl p-6 border border-[#ff6b9d]/30 mb-8">
          <div className="flex items-start gap-4">
            <span className="text-3xl">⚠️</span>
            <div>
              <h3 className="font-semibold text-[#ff6b9d] mb-2">Important Disclaimer</h3>
              <p className="text-sm text-[#888] leading-relaxed">
                This skill is <span className="text-[#fafafa]">100% fabricated</span> and should not be used for any purpose, 
                especially not production, critical systems, or impressing your boss. 
                Any resemblance to actual useful functionality is purely coincidental and frankly, suspicious.
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-4">
          <ShareButton />
          <Link href="/" className="btn-fake-secondary flex items-center gap-2">
            <span>🎭</span> Create Another Fake
          </Link>
        </div>

        {/* Related/Random */}
        <div className="mt-12 pt-8 border-t border-[#2a2a2a]">
          <p className="text-center text-sm text-[#555]">
            <span className="text-[#ff6b9d]">🎭</span>
            {' '}This skill has not been endorsed by anyone with actual credibility.
            <span className="text-[#ff6b9d]">{' '}🎭</span>
          </p>
        </div>
      </div>
    </main>
  );
}
