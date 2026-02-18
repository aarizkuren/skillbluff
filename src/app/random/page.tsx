'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Skill } from '@/types/skill';

export default function RandomSkillPage() {
  const [skill, setSkill] = useState<Skill | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);

  const loadRandomSkill = async () => {
    setLoading(true);
    setRevealed(false);
    setError(null);
    
    try {
      const response = await fetch('/api/random');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to load skill');
      }
      
      setSkill(data.skill);
      
      // Delay para la animación de revelado
      setTimeout(() => setRevealed(true), 300);
      
    } catch (err) {
      console.error('Error loading random skill:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  // Cargar al montar
  useEffect(() => {
    loadRandomSkill();
  }, []);

  const getDifficultyColor = (difficulty: string) => {
    const colors: Record<string, string> = {
      trivial: '#4ade80',
      easy: '#60a5fa',
      medium: '#fbbf24',
      hard: '#f87171',
      impossible: '#a855f7'
    };
    return colors[difficulty] || '#fbbf24';
  };

  const getDifficultyLabel = (difficulty: string) => {
    const labels: Record<string, string> = {
      trivial: 'Trivial',
      easy: 'Fácil',
      medium: 'Medio',
      hard: 'Difícil',
      impossible: 'Imposible'
    };
    return labels[difficulty] || difficulty;
  };

  // Renderizar contenido markdown simple
  const renderContent = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, i) => {
      const trimmed = line.trim();
      
      if (trimmed.startsWith('# ')) {
        return <h1 key={i} className="text-xl font-bold text-[#ff6b9d] mt-6 mb-4">{trimmed.substring(2)}</h1>;
      }
      if (trimmed.startsWith('## ')) {
        return <h2 key={i} className="text-lg font-semibold text-[#ffd700] mt-5 mb-3">{trimmed.substring(3)}</h2>;
      }
      if (trimmed.startsWith('- ')) {
        return (
          <li key={i} className="flex items-start gap-2 text-[#aaa] my-2">
            <span className="text-[#ff6b9d]">•</span>
            <span>{trimmed.substring(2)}</span>
          </li>
        );
      }
      if (trimmed === '') {
        return <div key={i} className="h-2"></div>;
      }
      return <p key={i} className="text-[#aaa] my-2">{trimmed}</p>;
    });
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-4 animate-bounce">🎲</div>
          <h1 className="text-3xl md:text-4xl font-bold text-gradient-fake mb-2">
            Skill Aleatoria
          </h1>
          <p className="text-[#888]">
            Descubre absurdos sin buscar
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-16">
            <div className="inline-flex flex-col items-center gap-4">
              <div className="text-4xl animate-spin">🎲</div>
              <p className="text-[#666] text-sm mt-4">Buscando en el caos...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">💥</div>
            <p className="text-[#ff6b9d] mb-4">{error}</p>
            <button
              onClick={loadRandomSkill}
              className="btn-fake-secondary"
            >
              Intentar de nuevo
            </button>
          </div>
        )}

        {/* Skill Card */}
        {!loading && skill && (
          <div className={`transition-all duration-700 ${revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="card-fake mb-6 overflow-hidden">
              {/* Header */}
              <div className="p-6 border-b border-[#2a2a2a]">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">🎭</span>
                      <h2 className="text-2xl font-bold text-[#f5f5f5]">
                        {skill.displayName}
                      </h2>
                    </div>
                    <p className="text-[#888] text-sm">{skill.description}</p>
                  </div>
                  
                  <div className="flex items-center gap-2 bg-[#ffd700]/10 border border-[#ffd700]/30 rounded-full px-4 py-2">
                    <span className="text-lg">⭐</span>
                    <span className="text-[#ffd700] font-bold">{skill.votesCount}</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {skill.tags.map((tag) => (
                    <span key={tag} className="tag-fake">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="prose prose-invert prose-sm max-w-none">
                  {renderContent(skill.content)}
                </div>

                {/* Warnings */}
                {skill.warnings.length > 0 && (
                  <div className="mt-6 p-4 bg-[#ff6b9d]/10 border border-[#ff6b9d]/30 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">⚠️</span>
                      <span className="text-[#ff6b9d] font-semibold">Advertencias</span>
                    </div>
                    <ul className="list-disc list-inside text-sm text-[#ff6b9d]/80">
                      {skill.warnings.map((warning, i) => (
                        <li key={i}>{warning}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Footer Stats */}
              <div className="px-6 py-4 bg-[#1a1a1a] border-t border-[#2a2a2a] flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span style={{ color: getDifficultyColor(skill.difficulty) }} className="font-bold">
                      {getDifficultyLabel(skill.difficulty)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-[#ff6b9d]">🔥</span>
                    <span className="text-sm text-[#888]">Inutilidad: {skill.uselessnessScore}/10</span>
                  </div>
                </div>
                
                <span className="text-xs text-[#555]">
                  {new Date(skill.createdAt).toLocaleDateString('es-ES')}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={loadRandomSkill}
                className="btn-fake-primary w-full sm:w-auto"
              >
                <span className="mr-2">🎲</span>
                Otra skill aleatoria
              </button>
              
              <Link href={`/skill/${skill.id}`} className="btn-fake-secondary w-full sm:w-auto text-center">
                🔗 Ver página completa
              </Link>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !skill && !error && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-[#888] text-lg mb-4">Aún no hay skills.</p>
            <Link href="/" className="btn-fake-primary">
              🎭 Crear la primera
            </Link>
          </div>
        )}

        {/* Navigation */}
        <div className="mt-12 text-center">
          <div className="flex items-center justify-center gap-4">
            <Link href="/" className="nav-pill">
              🎭 Crear skill
            </Link>
            <span className="text-[#555]">/</span>
            <Link href="/top" className="nav-pill">
              🏆 Hall of Shame
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
