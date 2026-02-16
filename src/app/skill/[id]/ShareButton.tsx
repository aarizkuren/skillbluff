'use client';

import { useState } from 'react';

export default function ShareButton() {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleShare = async () => {
    const url = window.location.href;
    
    try {
      // Try modern Clipboard API first
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        return;
      }
      
      // Fallback for Safari or non-secure contexts
      const textArea = document.createElement('textarea');
      textArea.value = url;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      
      if (successful) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } else {
        throw new Error('Copy failed');
      }
    } catch (err) {
      setError('Could not copy URL');
      setTimeout(() => setError(null), 2000);
    }
  };

  return (
    <button
      onClick={handleShare}
      className="bg-gradient-to-r from-[#ff6b9d] to-[#ff8fab] hover:from-[#ff8fab] hover:to-[#ff6b9d] text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 flex items-center gap-2 shadow-lg shadow-[#ff6b9d]/20 hover:shadow-[#ff6b9d]/40"
    >
      {error ? (
        <>
          <span>❌</span>
          <span>{error}</span>
        </>
      ) : copied ? (
        <>
          <span>✓</span>
          <span>URL Copied (Spread the lies!)</span>
        </>
      ) : (
        <>
          <span>🔗</span>
          <span>Share This Fake</span>
        </>
      )}
    </button>
  );
}
