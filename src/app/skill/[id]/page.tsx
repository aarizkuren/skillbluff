import Link from 'next/link';
import { Skill } from '@/types/skill';
import { getSkillById } from '@/lib/supabase';

// Forzar renderizado dinámico - las skills se crean en runtime
export const dynamic = 'force-dynamic';
export const dynamicParams = true;

async function getSkill(id: string): Promise<Skill | null> {
  return getSkillById(id);
}

export default async function SkillPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const skill = await getSkill(id);

  if (!skill) {
    return (
      <div className="min-h-screen bg-slate-900 text-gray-200 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">Skill no encontrada</h1>
          <p className="text-gray-400 mb-6">
            No existe una skill con el id: <span className="font-mono text-gray-200">{id}</span>
          </p>
          <Link href="/" className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition-colors">
            Volver al generador
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-gray-200 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">{skill.displayName}</h1>
          <div className="flex gap-2">
            <span className="bg-slate-800 px-3 py-1 rounded-full text-sm">{skill.language}</span>
            <span className="bg-slate-800 px-3 py-1 rounded-full text-sm">~{skill.wordCount} palabras</span>
          </div>
        </div>

        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 mb-6">
          <div className="bg-slate-900 rounded border border-slate-700 p-4 font-mono text-sm whitespace-pre-wrap overflow-x-auto">
            {skill.content}
          </div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 mb-6">
          <h3 className="font-semibold mb-2">🔗 Prompt original:</h3>
          <p className="text-gray-400 italic">"{skill.prompt}"</p>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              alert('URL copiada al portapapeles');
            }}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition-colors"
          >
            🔗 Compartir URL
          </button>
          <Link href="/" className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded transition-colors">
            Crear otra skill
          </Link>
        </div>
      </div>
    </div>
  );
}
