import React from 'react';
import { FileText, Files, FileWarning, ScrollText } from 'lucide-react';

export default function Slide2Problema() {
  return (
    <div className="flex flex-col justify-center h-full px-12 md:px-32">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto w-full">
        <div className="space-y-10 animate-in fade-in slide-in-from-left-4 duration-500 delay-150 fill-mode-both">
          <div className="inline-flex items-center rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-base font-medium text-red-400">
            <span className="flex h-2 w-2 rounded-full bg-red-500 mr-3 animate-pulse"></span>
            A Problemática
          </div>
          <h2 className="text-5xl md:text-6xl font-bold tracking-tighter text-white leading-[1.1]">
            Aumento do volume de entregas vs. Gestão analógica
          </h2>
          <div className="space-y-8 text-xl text-zinc-400 font-light leading-relaxed">
            <p>
              Condomínios lidam com um volume crescente de pacotes diários. O registro manual em <strong className="text-white">cadernos de papel</strong> causa lentidão, sobrecarrega os porteiros e gera falhas no controle das entregas.
            </p>
            <div className="flex gap-8 pt-4">
              <div className="border-l-2 border-red-500/50 pl-6">
                <span className="block text-white font-semibold mb-2 text-xl">Insegurança Jurídica</span>
                <span className="text-lg">Risco de perdas e conflitos.</span>
              </div>
              <div className="border-l-2 border-orange-500/50 pl-6">
                <span className="block text-white font-semibold mb-2 text-xl">Falha de Comunicação</span>
                <span className="text-lg">Atrasos na notificação aos moradores.</span>
              </div>
            </div>
          </div>
        </div>

        {}
        <div className="relative h-[600px] w-full hidden lg:block animate-in fade-in slide-in-from-right-4 duration-500 delay-300 fill-mode-both">
          <div className="absolute inset-0 bg-red-500/5 rounded-3xl border border-red-500/10 backdrop-blur-sm overflow-hidden flex items-center justify-center">
            <div className="absolute top-1/4 left-1/4 rotate-12 opacity-30 animate-[pulse_4s_ease-in-out_infinite]"><FileText className="w-32 h-32 text-zinc-500" /></div>
            <div className="absolute top-1/2 right-1/4 -rotate-12 opacity-40 animate-[pulse_5s_ease-in-out_infinite_1s]"><ScrollText className="w-40 h-40 text-red-900/50" /></div>
            <div className="absolute bottom-1/4 left-1/3 rotate-45 opacity-20 animate-[pulse_6s_ease-in-out_infinite_2s]"><Files className="w-24 h-24 text-orange-900/50" /></div>
            <div className="absolute top-1/3 right-1/3 -rotate-45 opacity-30 animate-[pulse_3s_ease-in-out_infinite_0.5s]"><FileWarning className="w-28 h-28 text-red-800/60" /></div>
            
            <div className="z-10 bg-[#fdfbf7] p-8 rounded-sm shadow-2xl animate-in zoom-in duration-300 delay-700 fill-mode-both hover:scale-105 transition-transform cursor-default relative overflow-hidden w-96 text-black font-sans rotate-3">
              {}
              <div className="absolute top-0 bottom-0 left-0 w-6 bg-zinc-200/50 border-r border-zinc-300 flex flex-col justify-evenly py-4">
                 {[...Array(12)].map((_, i) => (
                    <div key={i} className="w-4 h-4 rounded-full bg-zinc-950 ml-1 shadow-inner"></div>
                 ))}
              </div>
              
              {}
              <div className="absolute top-0 bottom-0 left-16 w-px bg-red-400/60"></div>
              
              <div className="pl-12 pt-2">
                {}
                <div className="border-b-2 border-blue-300/40 pb-2 mb-2 flex justify-between items-end">
                  <h3 className="font-bold text-xl text-zinc-800 tracking-wide font-mono uppercase">Controle</h3>
                  <span className="text-sm text-zinc-500 font-mono">12/05</span>
                </div>

                {}
                <div 
                  className="space-y-0 font-medium text-blue-900/90 leading-[2.5rem] rotate-[-1deg]"
                  style={{ fontFamily: 'var(--font-caveat)', fontSize: '1.25rem' }}
                >
                  <div className="border-b-2 border-blue-300/40 h-10 flex items-end pb-0 overflow-hidden"><span className="opacity-90 whitespace-nowrap">10:45 - Pacote apto 402??</span></div>
                  <div className="border-b-2 border-blue-300/40 h-10 flex items-end pb-0 overflow-hidden"><span className="opacity-90 whitespace-nowrap">11:20 - Caixa mercado livre</span></div>
                  <div className="border-b-2 border-blue-300/40 h-10 flex items-end pb-0 overflow-hidden"><span className="opacity-90 whitespace-nowrap">14:00 - sumiu pacote do 101!</span></div>
                  <div className="border-b-2 border-blue-300/40 h-10 flex items-end pb-0 overflow-hidden"><span className="opacity-70 whitespace-nowrap">16:30 - Assinatura ilegível</span></div>
                  <div className="border-b-2 border-blue-300/40 h-10 flex items-end pb-0"><span></span></div>
                  <div className="border-b-2 border-blue-300/40 h-10 flex items-end pb-0"><span></span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
