'use client';

import { useState, useEffect } from 'react';

interface VoteButtonProps {
  skillId: string;
  initialVotes: number;
  variant?: 'header' | 'footer';
}

export default function VoteButton({ skillId, initialVotes, variant = 'header' }: VoteButtonProps) {
  const [votes, setVotes] = useState(initialVotes);
  const [hasVoted, setHasVoted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Check localStorage on mount
  useEffect(() => {
    const votedSkills = JSON.parse(localStorage.getItem('votedSkills') || '[]');
    setHasVoted(votedSkills.includes(skillId));
  }, [skillId]);

  const handleVote = async () => {
    if (isLoading) return;
    
    // Optimistic UI: update immediately
    const previousVotes = votes;
    const newVotes = votes + 1;
    setVotes(newVotes);
    setHasVoted(true);
    setIsAnimating(true);
    setIsLoading(true);

    // Trigger animation
    setTimeout(() => setIsAnimating(false), 600);

    // Update localStorage
    const votedSkills = JSON.parse(localStorage.getItem('votedSkills') || '[]');
    if (!votedSkills.includes(skillId)) {
      votedSkills.push(skillId);
      localStorage.setItem('votedSkills', JSON.stringify(votedSkills));
    }

    try {
      // Call API
      const response = await fetch('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skillId }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Revert on error (but keep localStorage for UX)
        if (data.error === 'Too many votes') {
          // Show cooldown but keep optimistic vote
          console.log(`Espera ${data.waitSeconds}s para votar otra vez`);
        } else {
          setVotes(previousVotes);
        }
      } else if (data.votesCount) {
        // Sync with server count
        setVotes(data.votesCount);
      }
    } catch (error) {
      console.error('Vote error:', error);
      // Keep optimistic update even on error (viral mode)
    } finally {
      setIsLoading(false);
    }
  };

  const baseClasses = variant === 'header' 
    ? 'vote-badge cursor-pointer transition-all duration-200 hover:scale-110'
    : 'vote-button-footer';

  return (
    <button
      onClick={handleVote}
      disabled={isLoading}
      className={`${baseClasses} ${hasVoted ? 'voted' : ''} ${isAnimating ? 'animate-pop' : ''}`}
      title={hasVoted ? '¡Ya votaste!' : 'Votar como absurdo'}
    >
      <span className={`star-icon ${isAnimating ? 'animate-spin-star' : ''} ${hasVoted ? 'text-[#ffd700]' : ''}`}>
        {hasVoted ? '★' : '☆'}
      </span>
      <span className="vote-count">
        {votes}
      </span>
      <span className="vote-label">
        {hasVoted ? 'votado' : variant === 'footer' ? '¿Absurdo? Vota' : ''}
      </span>
      
      {/* Pop animation particles */}
      {isAnimating && (
        <>
          <span className="particle p1">✦</span>
          <span className="particle p2">✦</span>
          <span className="particle p3">✦</span>
        </>
      )}
    </button>
  );
}
