'use client';

import { useState } from 'react';

export default function ShareButton() {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleShare}
      className="btn-fake-primary flex items-center gap-2"
    >
      {copied ? (
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
