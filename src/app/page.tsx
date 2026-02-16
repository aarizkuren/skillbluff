'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { normalizeName } from '@/lib/utils';

export default function HomePage() {
  const [prompt, setPrompt] = useState('');
  const [suggestedName, setSuggestedName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [skill, setSkill] = useState<any>(null);
  const [error, setError] = useState('');

  const handlePromptChange = (value: string) => {
    setPrompt(value);
    if (value.trim()) {
      const normalized = normalizeName(value);
      setSuggestedName(normalized);
    } else {
      setSuggestedName('');
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/generate-skill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error generando skill');
      }

      setSkill(data.skill);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('URL copiada al portapapeles');
  };

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      {!skill && (
        <section className="hero-gradient py-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1a1a1a] border border-[#ff6b9d]/30 mb-8">
              <span className="w-2 h-2 bg-[#ff6b9d] rounded-full animate-pulse"></span>
              <span className="text-xs text-[#ff6b9d] tracking-wide">PROBABLY NOT PRODUCTION READY</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="text-gradient-fake glow-text">Skills</span>
              <span className="text-[#fafafa]"> You </span>
              <span className="text-[#666] line-through decoration-[#ff6b9d]">Definitely</span>
              <span className="text-[#fafafa]"> Don't Need</span>
            </h1>
            
            <p className="text-lg text-[#888] max-w-2xl mx-auto mb-4">
              The world's most comprehensive collection of 
              <span className="text-[#39ff14]"> 100% unverified</span>, 
              <span className="text-[#ffd700]"> suspiciously unofficial</span>, and 
              <span className="text-[#ff6b9d]"> certifiably fake</span> skills.
            </p>
            <p className="text-sm text-[#555]">
              Not endorsed by Anthropic, OpenAI, or any entity with actual credibility.
            </p>
          </div>
        </section>
      )}

      <div className="max-w-4xl mx-auto px-6 py-12">
        {skill ? (
          <div className="skill-card">
            {/* Success badge */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🎭</span>
                <div>
                  <h2 className="text-2xl font-bold text-[#fafafa]">{skill.displayName}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="fake-badge">
                      <span>✓</span> VERIFIED BY NO ONE
                    </span>
                    <span className="suspicious-badge">
                      <span>★</span> FAKE QUALITY
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-[#555] block">FAKE ID</span>
                <span className="text-xs font-mono text-[#666]">{skill.id}</span>
              </div>
            </div>

            {/* Skill Content */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-[#555] uppercase tracking-wider">Skill Definition</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#666]">{skill.language}</span>
                  <span className="text-xs text-[#ff6b9d]">~{skill.wordCount} words</span>
                </div>
              </div>
              <div className="skill-content-box">
                {skill.content}
              </div>
            </div>

            {/* Original Prompt */}
            <div className="bg-[#1a1a1a] rounded-lg p-4 mb-6 border border-[#2a2a2a]">
              <span className="text-xs text-[#555] uppercase tracking-wider block mb-2">
                Original Delusion
              </span>
              <p className="text-[#888] italic">"{skill.prompt}"</p>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => copyToClipboard(window.location.origin + `/skill/${skill.id}`)}
                className="btn-fake-primary flex items-center gap-2"
              >
                <span>🔗</span> Spread the Fake News
              </button>
              <button
                onClick={() => {
                  setSkill(null);
                  setPrompt('');
                  setSuggestedName('');
                }}
                className="btn-fake-secondary flex items-center gap-2"
              >
                <span>🎭</span> Create Another Lie
              </button>
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-xl font-semibold text-[#fafafa] mb-2">
                  What fake skill do you need?
                </h2>
                <p className="text-sm text-[#666]">
                  Describe something completely unnecessary. We'll make it official-looking.
                </p>
              </div>

              <div className="relative">
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => {
                    if (e.target.value.length <= 100) {
                      handlePromptChange(e.target.value);
                    }
                  }}
                  maxLength={100}
                  placeholder="e.g., water my plants while I'm in denial..."
                  className="input-fake"
                  required
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#555]">
                  {prompt.length}/100
                </div>
              </div>

              {suggestedName && (
                <div className="flex items-center gap-3 text-sm text-[#666] bg-[#1a1a1a] rounded-lg px-4 py-3 border border-[#2a2a2a]">
                  <span>💡</span>
                  <span>Will be named: <span className="text-[#ff6b9d] font-mono">{suggestedName}</span></span>
                </div>
              )}

              {error && (
                <div className="bg-[#1a0a0a] border border-[#ff6b9d]/30 rounded-lg p-4 text-[#ff6b9d]">
                  <div className="flex items-center gap-2">
                    <span>⚠️</span>
                    <span>{error}</span>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || !prompt.trim()}
                className="w-full btn-fake-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <span className="animate-spin">⏳</span> Fabricating lies...
                  </>
                ) : (
                  <>
                    <span>🎭</span> Generate Certified Fake Skill
                  </>
                )}
              </button>
            </form>

            {/* Trust badges */}
            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: '✗', label: 'NOT AUDITED', sub: 'By Anyone' },
                { icon: '✗', label: 'ZERO TRUST', sub: 'Score' },
                { icon: '✗', label: 'UNVERIFIED', sub: 'Since 2024' },
                { icon: '✓', label: '100% FAKE', sub: 'Guaranteed' },
              ].map((badge, i) => (
                <div key={i} className="text-center p-4 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a]">
                  <div className="text-2xl mb-1">{badge.icon}</div>
                  <div className="text-xs font-medium text-[#888]">{badge.label}</div>
                  <div className="text-[10px] text-[#555]">{badge.sub}</div>
                </div>
              ))}
            </div>

            {/* How it works */}
            <div className="mt-12 p-6 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a]">
              <h3 className="font-semibold text-[#fafafa] mb-4 flex items-center gap-2">
                <span>🤔</span> How This Scam Works
              </h3>
              <ol className="space-y-3 text-sm text-[#888]">
                <li className="flex items-start gap-3">
                  <span className="text-[#ff6b9d] font-bold">1.</span>
                  You describe something absurd
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#ff6b9d] font-bold">2.</span>
                  An AI with questionable training generates a skill
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#ff6b9d] font-bold">3.</span>
                  We save it to a real database (the irony!)
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#ff6b9d] font-bold">4.</span>
                  You share it with unsuspecting victims
                </li>
              </ol>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
