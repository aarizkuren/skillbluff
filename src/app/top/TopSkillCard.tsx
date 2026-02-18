'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Skill } from '@/types/skill';

interface TopSkillCardProps {
  skill: Skill;
  index: number;
}

export default function TopSkillCard({ skill, index }: TopSkillCardProps) {
  const [votes, setVotes] = useState(skill.votesCount);
  const [hasVoted, setHasVoted] = useState(false);
  const [isVoting, setIsVoting] = useState(false);

  // Check localStorage on mount
  useEffect(() => {
    const votedSkills = JSON.parse(localStorage.getItem('votedSkills') || '[]');
    setHasVoted(votedSkills.includes(skill.id));
  }, [skill.id]);

  // Get preview of content (first 150 chars, stop at word boundary)
  const getContentPreview = (content: string): string => {
    if (content.length <= 150) return content;
    const truncated = content.substring(0, 150);
    const lastSpace = truncated.lastIndexOf(' ');
    return truncated.substring(0, lastSpace > 0 ? lastSpace : 150) + '...';
  };

  const handleVote = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isVoting) return;

    // Optimistic update
    const previousVotes = votes;
    const newVotes = votes + 1;
    setVotes(newVotes);
    setHasVoted(true);
    setIsVoting(true);

    // Update localStorage
    const votedSkills = JSON.parse(localStorage.getItem('votedSkills') || '[]');
    if (!votedSkills.includes(skill.id)) {
      votedSkills.push(skill.id);
      localStorage.setItem('votedSkills', JSON.stringify(votedSkills));
    }

    try {
      const response = await fetch('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skillId: skill.id }),
      });

      const data = await response.json();

      if (!response.ok && data.error === 'Too many votes') {
        // Revert on rate limit
        setVotes(previousVotes);
      } else if (data.votesCount) {
        // Sync with server
        setVotes(data.votesCount);
      }
    } catch (error) {
      console.error('Vote error:', error);
      // Keep optimistic update
    } finally {
      setIsVoting(false);
    }
  };

  // Rank medal/number styling
  const getRankStyle = (rank: number): string => {
    if (rank === 0) return 'text-[#ffd700] font-bold'; // Gold
    if (rank === 1) return 'text-[#c0c0c0] font-bold'; // Silver
    if (rank === 2) return 'text-[#cd7f32] font-bold'; // Bronze
    return 'text-[#666]';
  };

  const getRankIcon = (rank: number): string => {
    if (rank === 0) return '🥇';
    if (rank === 1) return '🥈';
    if (rank === 2) return '🥉';
    return `#${rank + 1}`;
  };

  return (
    <article className="top-skill-card">
      {/* Rank badge */}
      <div className={`rank-badge ${getRankStyle(index)}`}>
        <span className="text-2xl">{getRankIcon(index)}</span>
      </div>

      {/* Card content */}
      <Link href={`/skill/${skill.id}`} className="card-link">
        <div className="card-header">
          <div className="flex items-start gap-3">
            <span className="text-2xl shrink-0">🎭</span>
            <div className="flex-1 min-w-0">
              <h2 className="card-title">{skill.displayName}</h2>
              <p className="card-description">{skill.description || 'Una skill completamente innecesaria...'}</p>
            </div>
          </div>
        </div>

        {/* Content preview */}
        <div className="card-preview">
          <pre className="preview-text">{getContentPreview(skill.content)}</pre>
        </div>

        {/* Tags */}
        {skill.tags.length > 0 && (
          <div className="card-tags">
            {skill.tags.slice(0, 4).map((tag, i) => (
              <span key={i} className="tag-pill-small">
                <span className="text-[#ff6b9d]">#</span>{tag}
              </span>
            ))}
            {skill.tags.length > 4 && (
              <span className="text-[#555] text-xs">+{skill.tags.length - 4}</span>
            )}
          </div>
        )}

        {/* Footer: stats + vote button */}
        <div className="card-footer">
          <div className="card-stats">
            <span className="stat-item">
              <span className="text-[#ff6b9d]">~</span>{skill.wordCount} palabras
            </span>
            <span className="stat-item">
              <span className="text-[#ffd700]">★</span> {skill.uselessnessScore}/10 absurdo
            </span>
          </div>

          {/* Vote button */}
          <button
            onClick={handleVote}
            disabled={isVoting}
            className={`vote-btn ${hasVoted ? 'voted' : ''}`}
          >
            <span className="vote-star">{hasVoted ? '★' : '☆'}</span>
            <span className="vote-count">{votes}</span>
          </button>
        </div>
      </Link>
    </article>
  );
}
