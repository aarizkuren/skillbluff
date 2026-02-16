'use client';

import { useState } from 'react';

interface SkillContentProps {
  content: string;
}

export default function SkillContent({ content }: SkillContentProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Parse markdown-like content
  const renderContent = () => {
    const lines = content.split('\n');
    const elements: React.ReactNode[] = [];
    let listItems: string[] = [];
    let inList = false;
    let inCodeBlock = false;
    let codeContent: string[] = [];

    const flushList = () => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={elements.length} className="my-4 space-y-2">
            {listItems.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-[#aaa]">
                <span className="text-[#ff6b9d] mt-1">•</span>
                <span dangerouslySetInnerHTML={{ __html: formatInline(item) }} />
              </li>
            ))}
          </ul>
        );
        listItems = [];
        inList = false;
      }
    };

    const flushCodeBlock = () => {
      if (codeContent.length > 0) {
        elements.push(
          <div key={elements.length} className="my-4 bg-[#1a1a1a] rounded-lg border border-[#2a2a2a] overflow-hidden">
            <div className="flex items-center justify-between px-3 py-2 bg-[#151515] border-b border-[#2a2a2a]">
              <span className="text-[10px] text-[#555] uppercase">Code Block</span>
              <span className="text-[10px] text-[#444]">fake-code</span>
            </div>
            <pre className="p-4 text-xs text-[#888] overflow-x-auto">
              <code>{codeContent.join('\n')}</code>
            </pre>
          </div>
        );
        codeContent = [];
        inCodeBlock = false;
      }
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();

      // Code blocks (```)
      if (trimmed.startsWith('```')) {
        if (inCodeBlock) {
          flushCodeBlock();
        } else {
          flushList();
          inCodeBlock = true;
        }
        continue;
      }

      if (inCodeBlock) {
        codeContent.push(line);
        continue;
      }

      // Headers
      if (trimmed.startsWith('# ')) {
        flushList();
        elements.push(
          <h1 key={elements.length} className="text-xl font-bold text-[#ff6b9d] mt-6 mb-4 pb-2 border-b border-[#2a2a2a]">
            {trimmed.substring(2)}
          </h1>
        );
      } else if (trimmed.startsWith('## ')) {
        flushList();
        elements.push(
          <h2 key={elements.length} className="text-lg font-semibold text-[#ffd700] mt-5 mb-3 flex items-center gap-2">
            <span className="text-[#ff6b9d]">##</span>
            {trimmed.substring(3)}
          </h2>
        );
      } else if (trimmed.startsWith('### ')) {
        flushList();
        elements.push(
          <h3 key={elements.length} className="text-base font-medium text-[#39ff14] mt-4 mb-2">
            {trimmed.substring(4)}
          </h3>
        );
      }
      // List items
      else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        if (!inList) inList = true;
        listItems.push(trimmed.substring(2));
      }
      // Empty line
      else if (trimmed === '') {
        flushList();
      }
      // Regular paragraph
      else {
        flushList();
        elements.push(
          <p 
            key={elements.length} 
            className="my-3 text-[#aaa] leading-relaxed"
            dangerouslySetInnerHTML={{ __html: formatInline(trimmed) }}
          />
        );
      }
    }

    flushList();
    flushCodeBlock();

    return elements;
  };

  // Format inline markdown (bold, italic, code)
  const formatInline = (text: string): string => {
    return text
      .replace(/`([^`]+)`/g, '<code class="bg-[#1a1a1a] px-1.5 py-0.5 rounded text-[#ff6b9d] text-xs border border-[#2a2a2a]">$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong class="text-[#ffd700]">$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em class="text-[#39ff14]">$1</em>');
  };

  // Simple display if can't parse
  if (!content) return null;

  return (
    <div className="relative">
      {/* Copy button */}
      <button
        onClick={handleCopy}
        className="absolute top-0 right-0 px-3 py-1.5 text-xs text-[#666] hover:text-[#ff6b9d] transition-colors border border-[#2a2a2a] hover:border-[#ff6b9d]/30 rounded-lg"
      >
        {copied ? '✓ Copied!' : '📋 Copy'}
      </button>

      {/* Content */}
      <div className="pt-8">
        {renderContent()}
      </div>
      
      {/* Fake file footer */}
      <div className="mt-6 pt-4 border-t border-[#2a2a2a] flex items-center justify-between text-[10px] text-[#444]">
        <span>{content.length} characters of nonsense</span>
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-[#ff6b9d] rounded-full"></span>
          markdown (fake)
        </span>
      </div>
    </div>
  );
}
