import React from 'react';
import { Package } from 'lucide-react';

export default function Slide1Capa() {
  return (
    <div className="flex flex-col items-center justify-center text-center h-full space-y-10 relative">
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/20 rounded-full blur-[120px] -z-10"
        style={{ animation: 'pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}
      ></div>
      
      <div className="relative group cursor-default animate-in fade-in zoom-in-95 duration-500 delay-150 fill-mode-both">
        <div 
          className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-teal-400 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-700 group-hover:duration-200"
          style={{ animation: 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}
        ></div>
        <div className="relative bg-zinc-900 ring-1 ring-white/10 p-10 rounded-3xl">
          <Package className="w-24 h-24 text-emerald-400" />
        </div>
      </div>

      <div className="space-y-4">
        <h1 className="text-7xl md:text-9xl font-black tracking-tighter text-white animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300 fill-mode-both">
          Condo<span className="text-emerald-400">Drop</span>
        </h1>
        <p className="text-3xl md:text-4xl text-zinc-400 font-light tracking-tight max-w-3xl mx-auto mt-4 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-500 fill-mode-both">
          Gestão inteligente e rastreável de encomendas para condomínios.
        </p>
      </div>

      {}
      <div className="absolute bottom-12 w-full flex justify-between px-16 text-sm text-zinc-500 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-700 fill-mode-both">
        <div className="text-left">
          <p className="text-zinc-400 font-semibold mb-1">Desenvolvido por:</p>
          <p>Gabriel Vitor Grossi Lourenço - GU3054446</p>
          <p>Christopher Willians Silva Couto - GU3054047</p>
        </div>
        <div className="text-right">
          <p className="text-zinc-400 font-semibold mb-1">Orientador:</p>
          <p>Giovani Fonseca Ravagnani Disperati</p>
        </div>
      </div>
    </div>
  );
}
