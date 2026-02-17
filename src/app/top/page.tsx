'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { Skill } from '@/types/skill';
import TopSkillCard from './TopSkillCard';

const ITEMS_PER_PAGE = 12;

export default function TopPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // Load initial data
  const loadSkills = useCallback(async (pageNum: number) => {
    if (isLoading) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/top?page=${pageNum}&limit=${ITEMS_PER_PAGE}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to load skills');
      }
      
      if (pageNum === 0) {
        setSkills(data.skills);
      } else {
        setSkills(prev => [...prev, ...data.skills]);
      }
      
      setHasMore(data.hasMore);
      
    } catch (err) {
      console.error('Error loading skills:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  // Initial load
  useEffect(() => {
    loadSkills(0);
  }, []);

  // Intersection observer for infinite scroll
  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }
    
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          const nextPage = page + 1;
          setPage(nextPage);
          loadSkills(nextPage);
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );
    
    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }
    
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, isLoading, page, loadSkills]);

  return (
    <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">🏆</div>
          <h1 className="text-4xl md:text-5xl font-bold text-gradient-fake mb-4">
            Hall of Shame
          </h1>
          <p className="text-[#888] text-lg max-w-2xl mx-auto">
            Las skills más absurdas votadas por la comunidad. 
            <span className="text-[#ff6b9d]">Cada voto cuenta.</span>
          </p>
          
          {/* Stats */}
          <div className="flex items-center justify-center gap-6 mt-6">
            <div className="text-center">
              <span className="block text-2xl font-bold text-[#ffd700]">{skills.length}+</span>
              <span className="text-xs text-[#666]">skills vistas</span>
            </div>
            <div className="w-px h-8 bg-[#2a2a2a]"></div>
            <div className="text-center">
              <span className="block text-2xl font-bold text-[#ff6b9d]">🔥</span>
              <span className="text-xs text-[#666]">más votadas</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <Link href="/" className="nav-pill">
            🎭 Crear skill
          </Link>
          <span className="text-[#555]">/</span>
          <span className="nav-pill text-[#ff6b9d] border-[#ff6b9d]">
            🏆 Top
          </span>
        </div>

        {/* Skills grid */}
        <div className="space-y-4">
          {skills.map((skill, index) => (
            <TopSkillCard key={skill.id} skill={skill} index={index} />
          ))}
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="py-12 text-center">
            <div className="inline-flex items-center gap-3 text-[#666]">
              <span className="animate-bounce">🎭</span>
              <span>Buscando más absurdos...</span>
              <span className="animate-bounce" style={{ animationDelay: '0.1s' }}>🎭</span>
            </div>
          </div>
        )}

        {/* Sentinel for infinite scroll */}
        <div ref={loadMoreRef} className="h-4"></div>

        {/* Error state */}
        {error && (
          <div className="py-8 text-center">
            <div className="text-4xl mb-3">💥</div>
            <p className="text-[#ff6b9d] mb-4">{error}</p>
            <button
              onClick={() => loadSkills(page)}
              className="btn-fake-secondary"
            >
              Reintentar
            </button>
          </div>
        )}

        {/* End of list */}
        {!hasMore && !isLoading && skills.length > 0 && (
          <div className="py-12 text-center">
            <div className="text-4xl mb-3">🧐</div>
            <p className="text-[#666]">Has visto todo lo absurdo que existe.</p>
            <p className="text-[#555] text-sm mt-2">Impresionante, ¿no?</p>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !error && skills.length === 0 && (
          <div className="py-16 text-center">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-[#888] text-lg mb-4">Aún no hay skills votadas.</p>
            <p className="text-[#555] text-sm mb-6">Sé el primero en crear una.</span>
            <Link href="/" className="btn-fake-primary">
              🎭 Crear la primera
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
