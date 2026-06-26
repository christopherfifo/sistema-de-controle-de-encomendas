import React from 'react';
import { Target, Coins, Zap, ShieldCheck } from 'lucide-react';

export default function Slide8Diferenciais() {
  const diferenciais = [
    {
      title: "Especializado em encomendas",
      desc: "Focado exclusivamente na gestão de encomendas, oferecendo um fluxo completo e otimizado, diferente de plataformas generalistas que tratam essa funcionalidade como secundária.",
      icon: Target,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
      delay: "delay-[200ms]"
    },
    {
      title: "Solução acessível",
      desc: "Ideal para condomínios que desejam modernizar apenas o processo de encomendas, sem precisar contratar uma plataforma completa de gestão imobiliária ou ERP.",
      icon: Coins,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
      delay: "delay-[300ms]"
    },
    {
      title: "Comunicação automática",
      desc: "Notificações instantâneas via Telegram e E-mail reduzem atrasos na comunicação e eliminam a necessidade de ligações ou avisos manuais via interfone.",
      icon: Zap,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
      delay: "delay-[400ms]"
    },
    {
      title: "Histórico rastreável",
      desc: "Todo o ciclo da encomenda é registrado do início ao fim, permitindo auditorias precisas, consultas rápidas e maior segurança para moradores e administração.",
      icon: ShieldCheck,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20",
      delay: "delay-[500ms]"
    }
  ];

  return (
    <div className="flex flex-col justify-center h-full px-6 md:px-12 lg:px-16 w-full max-w-[1360px] mx-auto relative pt-4">
      
      {/* Header */}
      <div className="mb-12 lg:mb-16 text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-medium text-zinc-400 mb-6 uppercase tracking-widest animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          Diferenciais da Plataforma
        </div>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-white animate-in fade-in slide-in-from-bottom-4 duration-500 delay-75 fill-mode-both">
          Por que escolher o <span className="text-emerald-400">CondoDrop</span>?
        </h2>
      </div>

      {/* Grid de Diferenciais */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-6 lg:gap-y-8 lg:gap-x-16 w-full">
        {diferenciais.map((item, index) => (
          <div 
            key={index}
            className={`group p-8 rounded-3xl bg-zinc-900/40 border border-zinc-800/80 backdrop-blur-sm transition-all duration-300 hover:bg-zinc-800/60 hover:border-zinc-700/80 animate-in fade-in zoom-in-95 fill-mode-both ${item.delay}`}
          >
            <div className={`w-14 h-14 rounded-2xl ${item.bg} ${item.border} border flex items-center justify-center mb-6 transform group-hover:scale-110 transition-transform duration-500`}>
              <item.icon className={`w-7 h-7 ${item.color}`} />
            </div>
            <h3 className="text-[1.75rem] font-bold text-zinc-100 mb-3 tracking-tight leading-none">
              {item.title}
            </h3>
            <p className="text-lg text-zinc-400 font-light leading-relaxed">
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
