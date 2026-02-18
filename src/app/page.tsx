'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { normalizeName } from '@/lib/utils';

export default function HomePage() {
  const router = useRouter();
  const [prompt, setPrompt] = useState('');
  const [suggestedName, setSuggestedName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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

      // Redirect to skill detail page
      router.push(`/skill/${data.skill.id}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen">
      {/* Hero Section - Always visible */}
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

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Big CTA Section */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#ff6b9d]/10 border border-[#ff6b9d]/30 mb-6">
              <span className="w-2 h-2 bg-[#ff6b9d] rounded-full animate-pulse"></span>
              <span className="text-sm text-[#ff6b9d] font-medium">START HERE ↓</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#fafafa] mb-3">
              What do you want to <span className="text-[#ff6b9d]">fake</span> today?
            </h2>
            <p className="text-lg text-[#888]">
              Describe something absurd. We'll make it look <span className="text-[#ffd700]">official</span>.
            </p>
          </div>

          {/* Prominent Input Container */}
          <div className="relative bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] rounded-2xl p-1 mb-6">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#ff6b9d]/50 via-[#ffd700]/50 to-[#ff6b9d]/50 opacity-0 transition-opacity duration-300" 
                 style={{ opacity: prompt ? 0.5 : 0.3 }}></div>
            <div className="relative bg-[#0f0f0f] rounded-xl p-6 md:p-8">
              <form onSubmit={handleSubmit}>
                {/* Label */}
                <label className="block text-sm font-medium text-[#ff6b9d] mb-3 uppercase tracking-wider">
                  <span className="mr-2">✨</span>Enter your ridiculous request
                </label>
                
                {/* Big Input */}
                <div className="relative mb-4">
                  <input
                    type="text"
                    value={prompt}
                    onChange={(e) => {
                      if (e.target.value.length <= 50) {
                        handlePromptChange(e.target.value);
                      }
                    }}
                    maxLength={50}
                    placeholder="Example: water my plants..."
                    className="w-full bg-[#1a1a1a] border-2 border-[#2a2a2a] rounded-xl px-5 py-5 text-lg text-[#fafafa] placeholder-[#444] focus:border-[#ff6b9d] focus:outline-none focus:ring-4 focus:ring-[#ff6b9d]/20 transition-all"
                    required
                    autoFocus
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-[#555] bg-[#0f0f0f] px-2 py-1 rounded-full border border-[#2a2a2a]">
                    {prompt.length}/50
                  </div>
                </div>

                {/* Hint text */}
                {!prompt && (
                  <p className="text-sm text-[#555] mb-4 flex items-center gap-2">
                    <span>💡</span>
                    <span>Tip: The more unnecessary, the better. Think "professional solutions to non-problems."</span>
                  </p>
                )}

                {/* Generate Button */}
                <button
                  type="submit"
                  disabled={isLoading || !prompt.trim()}
                  className="w-full bg-gradient-to-r from-[#ff6b9d] to-[#ff8fab] hover:from-[#ff8fab] hover:to-[#ff6b9d] text-white font-bold text-lg px-8 py-4 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg shadow-[#ff6b9d]/20 hover:shadow-[#ff6b9d]/40"
                >
                  {isLoading ? (
                    <>
                      <span className="animate-spin text-2xl">⏳</span>
                      <span>Fabricating your fake skill...</span>
                    </>
                  ) : (
                    <>
                      <span className="text-2xl">🎭</span>
                      <span>Generate Certified Fake Skill</span>
                      <span className="text-2xl">→</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Suggested name preview */}
          {suggestedName && (
            <div className="mb-6 p-4 bg-[#39ff14]/5 border border-[#39ff14]/20 rounded-xl">
              <div className="flex items-center gap-3">
                <span className="text-2xl">💡</span>
                <div>
                  <span className="text-sm text-[#666]">Will be named:</span>
                  <span className="ml-2 text-[#39ff14] font-mono font-medium">{suggestedName}</span>
                </div>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mb-6 bg-[#1a0a0a] border border-[#ff6b9d]/30 rounded-xl p-4 text-[#ff6b9d]">
              <div className="flex items-center gap-2">
                <span className="text-xl">⚠️</span>
                <span>{error}</span>
              </div>
            </div>
          )}

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

          {/* Navigation */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/top"
              className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-[#ffd700]/10 to-[#ff6b9d]/10 border border-[#ffd700]/30 rounded-full text-[#ffd700] hover:border-[#ffd700]/50 hover:from-[#ffd700]/15 hover:to-[#ff6b9d]/15 transition-all"
            >
              <span className="text-lg">🏆</span>
              <span className="font-medium">Hall of Shame</span>
              <span className="text-xs text-[#888]">Las más votadas →</span>
            </Link>
            
            <Link
              href="/random"
              className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-[#39ff14]/10 to-[#00d9ff]/10 border border-[#39ff14]/30 rounded-full text-[#39ff14] hover:border-[#39ff14]/50 hover:from-[#39ff14]/15 hover:to-[#00d9ff]/15 transition-all"
            >
              <span className="text-lg">🎲</span>
              <span className="font-medium">Skill Aleatoria</span>
              <span className="text-xs text-[#888]">Descubre →</span>
            </Link>
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
      </div>
    </main>
  );
}
