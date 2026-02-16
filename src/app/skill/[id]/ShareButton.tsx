'use client';

export default function ShareButton() {
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('URL copiada al portapapeles');
  };

  return (
    <button
      onClick={handleShare}
      className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition-colors"
    >
      🔗 Compartir URL
    </button>
  );
}
