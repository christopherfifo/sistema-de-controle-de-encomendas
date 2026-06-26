import React from 'react';
import { XCircle, CheckCircle2, FileText, Smartphone, BellOff, Clock, ShieldCheck, AlertTriangle, Zap, ArrowRight, Activity } from 'lucide-react';

export default function Slide9Resultados() {
  const antes = [
    { text: "Registro em papel", icon: FileText },
    { text: "Avisos manuais aos moradores", icon: BellOff },
    { text: "Maior risco de extravios", icon: AlertTriangle },
    { text: "Processo lento e sujeito a erros", icon: Clock }
  ];

  const depois = [
    { text: "Controle totalmente digital", icon: Smartphone },
    { text: "Notificações automáticas", icon: Zap },
    { text: "Histórico completo das movimentações", icon: Activity },
    { text: "Maior segurança e rastreabilidade", icon: ShieldCheck },
    { text: "Processo rápido para moradores e portaria", icon: Clock }
  ];

  return (
    <div className="flex flex-col justify-center h-full px-6 md:px-12 lg:px-16 w-full max-w-[1360px] mx-auto relative pt-4">
      
      {/* Header */}
      <div className="mb-12 lg:mb-16 text-center">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-white mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both">
          Resultados Esperados
        </h2>
        <p className="text-xl md:text-2xl text-zinc-400 font-light max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150 fill-mode-both mx-auto">
          Modernização do processo de recebimento de encomendas.
        </p>
      </div>

      {/* Before & After Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 relative w-full mt-4">
         
         {/* Center Arrow Indicator (Desktop) */}
         <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-16 h-16 bg-zinc-950 border-[4px] border-zinc-900 rounded-full items-center justify-center text-zinc-500 shadow-2xl animate-in zoom-in [animation-duration:500ms] [animation-delay:500ms] fill-mode-both">
            <ArrowRight className="w-8 h-8" />
         </div>

         {/* Card ANTES */}
         <div className="flex flex-col p-8 lg:p-12 bg-red-950/10 border border-red-500/20 rounded-[2.5rem] relative overflow-hidden group hover:border-red-500/40 hover:bg-red-950/[0.15] hover:shadow-[0_0_40px_rgba(239,68,68,0.05)] transition-all duration-500 animate-in fade-in slide-in-from-left-8 [animation-duration:700ms] [animation-delay:300ms] fill-mode-both">
            {/* Top Red Glow Line */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500/40 to-transparent"></div>
            
            <div className="flex items-center gap-4 mb-10">
               <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center border border-red-500/20">
                  <XCircle className="w-7 h-7 text-red-400" />
               </div>
               <h3 className="text-3xl font-bold text-zinc-300 tracking-tight">Antes</h3>
            </div>

            <ul className="space-y-9 flex-1 flex flex-col justify-center">
               {antes.map((item, i) => (
                 <li key={i} className="flex items-start gap-4">
                    <item.icon className="w-6 h-6 text-red-400/50 mt-0.5 shrink-0" />
                    <span className="text-lg text-zinc-400 font-light leading-snug">{item.text}</span>
                 </li>
               ))}
            </ul>
         </div>

         {/* Card DEPOIS */}
         <div className="flex flex-col p-8 lg:p-12 bg-emerald-950/20 border border-emerald-500/30 rounded-[2.5rem] relative overflow-hidden group hover:border-emerald-500/60 hover:bg-emerald-950/30 transition-all duration-500 shadow-[0_0_30px_rgba(16,185,129,0.03)] hover:shadow-[0_0_50px_rgba(16,185,129,0.06)] animate-in fade-in slide-in-from-right-8 [animation-duration:700ms] [animation-delay:700ms] fill-mode-both">
            {/* Top Emerald Glow Line */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"></div>
            
            <div className="flex items-center gap-4 mb-10">
               <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 flex items-center justify-center border border-emerald-400">
                  <CheckCircle2 className="w-7 h-7 text-emerald-400" />
               </div>
               <h3 className="text-3xl font-bold text-white tracking-tight">Depois (CondoDrop)</h3>
            </div>

            <ul className="space-y-6 flex-1 flex flex-col justify-center">
               {depois.map((item, i) => (
                 <li key={i} className="flex items-start gap-4">
                    <item.icon className="w-6 h-6 text-emerald-400 mt-0.5 shrink-0" />
                    <span className="text-lg text-zinc-200 font-medium leading-snug">{item.text}</span>
                 </li>
               ))}
            </ul>
         </div>
      </div>
    </div>
  );
}
