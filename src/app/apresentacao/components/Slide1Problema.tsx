import React from 'react';
import { Box } from 'lucide-react';

export default function Slide1Problema() {
  return (
    <div className="flex flex-col justify-center h-full px-12 md:px-32">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto w-full">
        <div className="space-y-10 animate-in fade-in slide-in-from-left-4 duration-500 delay-150 fill-mode-both">
          <div className="inline-flex items-center rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-base font-medium text-red-400">
            <span className="flex h-2 w-2 rounded-full bg-red-500 mr-3 animate-pulse"></span>
            O Cenário Atual
          </div>
          <h2 className="text-5xl md:text-6xl font-bold tracking-tighter text-white leading-[1.1]">
            O e-commerce explodiu.<br/> A portaria parou no tempo.
          </h2>
          <div className="space-y-8 text-2xl text-zinc-400 font-light leading-relaxed">
            <p>
              Hoje, um prédio médio recebe dezenas de pacotes por dia. O controle é feito em <strong className="text-white">cadernos de papel</strong>, dependendo da organização de um funcionário sobrecarregado.
            </p>
            <div className="flex gap-8 pt-4">
              <div className="border-l-2 border-red-500/50 pl-6">
                <span className="block text-white font-semibold mb-2 text-xl">Risco Jurídico</span>
                <span className="text-lg">Processos por extravio.</span>
              </div>
              <div className="border-l-2 border-orange-500/50 pl-6">
                <span className="block text-white font-semibold mb-2 text-xl">Fricção Morador</span>
                <span className="text-lg">&quot;Ninguém me avisou!&quot;</span>
              </div>
            </div>
          </div>
        </div>

        {/* Representação visual do caos */}
        <div className="relative h-[600px] w-full hidden lg:block animate-in fade-in slide-in-from-right-4 duration-500 delay-300 fill-mode-both">
          <div className="absolute inset-0 bg-red-500/5 rounded-3xl border border-red-500/10 backdrop-blur-sm overflow-hidden flex items-center justify-center">
            <div className="absolute top-1/4 left-1/4 rotate-12 opacity-40 animate-[pulse_4s_ease-in-out_infinite]"><Box className="w-32 h-32 text-red-400" /></div>
            <div className="absolute top-1/2 right-1/4 -rotate-12 opacity-60 animate-[pulse_5s_ease-in-out_infinite_1s]"><Box className="w-40 h-40 text-orange-400" /></div>
            <div className="absolute bottom-1/4 left-1/3 rotate-45 opacity-30 animate-[pulse_6s_ease-in-out_infinite_2s]"><Box className="w-24 h-24 text-red-500" /></div>
            <div className="absolute top-1/3 right-1/3 -rotate-45 opacity-50 animate-[pulse_3s_ease-in-out_infinite_0.5s]"><Box className="w-28 h-28 text-yellow-400" /></div>
            
            <div className="z-10 bg-zinc-950/90 p-8 rounded-2xl border border-zinc-800 shadow-2xl backdrop-blur-md animate-in zoom-in duration-300 delay-700 fill-mode-both hover:scale-105 transition-transform cursor-default">
               <pre className="text-red-400 font-mono text-lg leading-loose">
                 <code>
{`[CADERNO_PORTARIA]
10:45 - Pacote apto 402??
11:20 - Caixa mercado livre 
14:00 - SUMIU PACOTE DO 101!
16:30 - Assinatura ilegível`}
                 </code>
               </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
