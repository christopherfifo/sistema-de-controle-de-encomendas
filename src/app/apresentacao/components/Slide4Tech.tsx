import React from 'react';
import { Database, Server, BellRing } from 'lucide-react';

export default function Slide4Tech() {
  return (
    <div className="flex flex-col justify-center h-full px-12 md:px-32">
      <h2 className="text-5xl md:text-6xl font-bold tracking-tighter text-white mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150 fill-mode-both">
        A Stack Tecnológica
      </h2>
      
      {/* Bento Grid Layout - Balanced and Full */}
      <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-6 max-w-6xl mx-auto w-full h-[550px]">
        
        {/* Next.js (Big Block) */}
        <div className="md:row-span-2 bg-zinc-900 border border-white/10 rounded-3xl p-10 relative overflow-hidden group hover:border-white/30 transition-colors flex flex-col justify-between animate-in fade-in zoom-in-95 duration-500 delay-300 fill-mode-both">
          <div className="absolute -bottom-10 -right-10 p-12 opacity-5 group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-500">
             <div className="text-[250px] font-black leading-none">N</div>
          </div>
          <div className="relative z-10">
            <div className="w-16 h-16 bg-white text-black rounded-2xl flex items-center justify-center font-bold text-3xl mb-8">N</div>
            <h3 className="text-4xl font-bold text-white mb-3">Next.js 15</h3>
            <p className="text-xl text-zinc-400 font-medium mb-6">App Router & Server Actions</p>
          </div>
          <p className="text-lg text-zinc-500 font-light relative z-10 leading-relaxed">
            Toda a lógica de backend (validações, banco, disparos) roda no próprio framework de forma segura via servidor, eliminando APIs separadas e reduzindo latência.
          </p>
        </div>

        {/* PostgreSQL */}
        <div className="bg-zinc-900 border border-white/10 rounded-3xl p-8 group hover:border-[#336791]/50 transition-colors animate-in fade-in slide-in-from-bottom-4 duration-500 delay-500 fill-mode-both">
           <Database className="w-10 h-10 text-[#336791] mb-5 group-hover:-translate-y-1 transition-transform duration-300" />
           <h3 className="text-2xl font-bold text-white mb-2">PostgreSQL</h3>
           <p className="text-base text-zinc-400">Banco relacional hospedado via serverless.</p>
        </div>

        {/* Prisma ORM */}
        <div className="bg-zinc-900 border border-white/10 rounded-3xl p-8 group hover:border-white/30 transition-colors animate-in fade-in slide-in-from-bottom-4 duration-500 delay-600 fill-mode-both">
           <Server className="w-10 h-10 text-white mb-5 group-hover:-translate-y-1 transition-transform duration-300" />
           <h3 className="text-2xl font-bold text-white mb-2">Prisma ORM</h3>
           <p className="text-base text-zinc-400">Tipagem estrita de ponta a ponta em TypeScript.</p>
        </div>

        {/* Tailwind + Shadcn */}
        <div className="bg-zinc-900 border border-white/10 rounded-3xl p-8 group hover:border-[#38BDF8]/50 transition-colors animate-in fade-in slide-in-from-bottom-4 duration-500 delay-700 fill-mode-both">
           <div className="w-12 h-12 bg-[#38BDF8]/10 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
             <svg viewBox="0 0 24 24" fill="none" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path><path d="M12 12v9"></path><path d="m8 17 4 4 4-4"></path></svg>
           </div>
           <h3 className="text-2xl font-bold text-white mb-2">Tailwind + Shadcn</h3>
           <p className="text-base text-zinc-400">Design system utilitário com dark mode nativo.</p>
        </div>

        {/* Integrações */}
        <div className="bg-zinc-900 border border-white/10 rounded-3xl p-8 group hover:border-[#2CA5E0]/50 transition-colors animate-in fade-in slide-in-from-bottom-4 duration-500 delay-1000 fill-mode-both">
           <BellRing className="w-10 h-10 text-[#2CA5E0] mb-5 group-hover:-translate-y-1 transition-transform duration-300" />
           <h3 className="text-2xl font-bold text-white mb-2">Integrações</h3>
           <p className="text-base text-zinc-400">Alertas push via API do Telegram e disparos de E-mail.</p>
        </div>

      </div>
    </div>
  );
}
