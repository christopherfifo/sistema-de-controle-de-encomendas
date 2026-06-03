import React from 'react';
import { Terminal, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Slide5Fim() {
  return (
    <div className="flex flex-col items-center justify-center text-center h-full px-4">
      <div className="w-full max-w-3xl bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150 fill-mode-both">
        <div className="bg-zinc-900 px-6 py-4 flex items-center border-b border-zinc-800">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-400 transition-colors cursor-pointer"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/80 hover:bg-yellow-400 transition-colors cursor-pointer"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/80 hover:bg-green-400 transition-colors cursor-pointer"></div>
          </div>
          <div className="mx-auto text-sm text-zinc-500 font-mono flex items-center gap-2">
            <Terminal className="w-4 h-4" />
            demo.sh
          </div>
        </div>
        <div className="p-8 text-left font-mono text-lg leading-relaxed">
          <p className="text-zinc-400"><span className="text-emerald-400">❯</span> npm run build</p>
          <p className="text-zinc-500">✓ Compiled successfully</p>
          <p className="text-zinc-400 mt-4"><span className="text-emerald-400">❯</span> npm run start</p>
          <p className="text-white mt-2">CondoDrop rodando na porta 3000.</p>
          <p className="text-emerald-400 mt-4 animate-pulse">Aguardando demonstração_</p>
        </div>
      </div>
      
      <h2 className="text-5xl font-bold text-white mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-500 fill-mode-both">Demonstração Prática</h2>
      
      <div className="animate-in fade-in zoom-in-95 duration-500 delay-700 fill-mode-both">
        <Button size="lg" className="px-10 h-16 text-xl font-bold bg-white text-black hover:bg-zinc-200 hover:scale-105 transition-all duration-300 rounded-full group" onClick={() => window.location.href = '/'}>
          Acessar Plataforma
          <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform" />
        </Button>
      </div>
    </div>
  );
}
