'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { normalizeName } from '@/lib/utils';

export default function HomePage() {
  const router = useRouter();
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
    <div className="min-h-screen bg-slate-900 text-gray-200 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-2">🎭 Fake Skill Generator</h1>
        <p className="text-center text-gray-400 mb-12">
          Crea skills falsas para Claude Code con un toque de humor 😄
        </p>

        {skill ? (
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <h2 className="text-2xl font-semibold mb-4">🎉 ¡Skill Generada!</h2>
            
            <div className="bg-slate-900 rounded border border-slate-700 p-4 font-mono text-sm whitespace-pre-wrap mb-4">
              {skill.content}
            </div>

            <div className="flex flex-wrap gap-4 mb-6">
              <span>📛 Nombre: {skill.name}</span>
              <span>🌍 Idioma: {skill.language}</span>
              <span>📝 Palabras: ~{skill.wordCount}</span>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => copyToClipboard(window.location.origin + `/skill/${skill.id}`)}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition-colors"
              >
                🔗 Copiar URL
              </button>
              <button
                onClick={() => {
                  setSkill(null);
                  setPrompt('');
                  setSuggestedName('');
                }}
                className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded transition-colors"
              >
                Crear otra skill
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block mb-2 text-lg">¿Qué skill quieres crear?</label>
              <textarea
                value={prompt}
                onChange={(e) => handlePromptChange(e.target.value)}
                placeholder="Ej: regar las plantas de mi casa"
                className="w-full h-32 bg-slate-800 border border-slate-700 rounded-lg p-4 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {suggestedName && (
              <div className="text-sm text-gray-400">
                Nombre sugerido: <span className="text-gray-300 font-mono">{suggestedName}</span>
              </div>
            )}

            {error && (
              <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 text-red-300">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !prompt.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-900/30 disabled:cursor-not-allowed px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              {isLoading ? 'Generando...' : '🎭 Generar Skill Fake'}
            </button>
          </form>
        )}

        <div className="mt-12 p-6 bg-slate-800/50 border border-slate-700 rounded-lg">
          <h3 className="font-semibold mb-2">🤔 ¿Cómo funciona?</h3>
          <ul className="space-y-1 text-sm text-gray-400">
            <li>1. Escribe lo que quieres que haga la skill</li>
            <li>2. Nuestro sistema genera una skill falsa usando Ollama</li>
            <li>3. El resultado es irónico y absurdo pero creíble</li>
            <li>4. Comparte el link con tus amigos</li>
            <li>5. ¡Entretenimiento asegurado!</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
