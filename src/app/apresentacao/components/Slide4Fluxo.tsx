import React from 'react';
import { UserPlus, Package, Camera, Send, Smartphone, KeySquare, History, ChevronRight } from 'lucide-react';

export default function Slide4Fluxo() {
  const steps = [
    { icon: UserPlus, title: "Previsão", desc: "Morador cadastra", color: "text-blue-400", hoverBg: "group-hover:bg-blue-500/5", hoverBorder: "group-hover:border-blue-500/20", delay: "delay-[300ms]", arrowDelay: "delay-[350ms]" },
    { icon: Package, title: "Recepção", desc: "Porteiro recebe", color: "text-emerald-400", hoverBg: "group-hover:bg-emerald-500/5", hoverBorder: "group-hover:border-emerald-500/20", delay: "delay-[400ms]", arrowDelay: "delay-[450ms]" },
    { icon: Camera, title: "Registro", desc: "Dados e foto", color: "text-purple-400", hoverBg: "group-hover:bg-purple-500/5", hoverBorder: "group-hover:border-purple-500/20", delay: "delay-[500ms]", arrowDelay: "delay-[550ms]" },
    { icon: Send, title: "Notificação", desc: "Disparo automático", color: "text-sky-400", hoverBg: "group-hover:bg-sky-500/5", hoverBorder: "group-hover:border-sky-500/20", delay: "delay-[600ms]" },
    { icon: Smartphone, title: "Aviso", desc: "Morador recebe", color: "text-yellow-400", hoverBg: "group-hover:bg-yellow-500/5", hoverBorder: "group-hover:border-yellow-500/20", delay: "delay-[700ms]", arrowDelay: "delay-[750ms]" },
    { icon: KeySquare, title: "Retirada", desc: "Validação via Token", color: "text-orange-400", hoverBg: "group-hover:bg-orange-500/5", hoverBorder: "group-hover:border-orange-500/20", delay: "delay-[800ms]", arrowDelay: "delay-[850ms]" },
    { icon: History, title: "Auditoria", desc: "Histórico rastreável", color: "text-zinc-300", hoverBg: "group-hover:bg-zinc-500/5", hoverBorder: "group-hover:border-zinc-500/20", delay: "delay-[900ms]" },
  ];

  const Node = ({ step }: { step: any }) => (
    <div className={`flex flex-col items-center text-center group z-10 animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both ${step.delay} w-[140px] md:w-[160px] lg:w-[180px]`}>
       <div className={`w-14 h-14 md:w-16 md:h-16 lg:w-[72px] lg:h-[72px] rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-center mb-5 transition-all duration-300 shadow-xl ${step.hoverBg} ${step.hoverBorder} relative`}>
         <step.icon className={`w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 ${step.color} opacity-80 transition-all duration-300 group-hover:scale-110 group-hover:opacity-100`} />
       </div>
       <h3 className="font-semibold text-zinc-100 text-lg md:text-xl lg:text-2xl tracking-tight mb-1">{step.title}</h3>
       <p className="text-sm md:text-base lg:text-lg text-zinc-500 font-light leading-snug">{step.desc}</p>
    </div>
  );

  const Arrow = ({ delay }: { delay: string }) => (
    <div className={`hidden md:flex items-center justify-center h-16 lg:h-[72px] text-zinc-700 animate-in fade-in zoom-in duration-500 ${delay} fill-mode-both px-2 lg:px-6`}>
       <ChevronRight className="w-6 h-6 lg:w-8 lg:h-8 opacity-50" />
    </div>
  );

  return (
    <div className="flex flex-col justify-center h-full px-8 md:px-16 lg:px-24 w-full max-w-7xl mx-auto relative">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-emerald-500/5 blur-[120px] rounded-full animate-[pulse_8s_ease-in-out_infinite] pointer-events-none -z-10 hidden md:block"></div>
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-teal-500/5 blur-[120px] rounded-full animate-[pulse_8s_ease-in-out_infinite_4s] pointer-events-none -z-10 hidden md:block"></div>
      
      <h2 className="text-5xl md:text-6xl font-bold tracking-tighter text-white mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150 fill-mode-both">
        Fluxo completo da <span className="text-emerald-400">encomenda</span>
      </h2>
      <p className="text-xl md:text-2xl text-zinc-400 font-light mb-12 md:mb-16 lg:mb-20 max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200 fill-mode-both">
        Da previsão de entrega até a retirada, todo o processo é registrado e rastreado.
      </p>

      {/* Glassmorphism Container Wrapper */}
      <div className="w-full bg-zinc-900/30 border border-zinc-800/60 rounded-[2rem] lg:rounded-[3rem] p-8 md:p-12 lg:p-16 backdrop-blur-xl shadow-2xl ring-1 ring-white/5 relative z-10 animate-in fade-in zoom-in-95 duration-700 delay-300 fill-mode-both">
        
        {/* Centered Flexbox Layout */}
        <div className="flex flex-col items-center w-full space-y-12 md:space-y-16 lg:space-y-20">
          
          {/* Row 1 (4 items) */}
          <div className="flex flex-wrap md:flex-nowrap justify-center items-start gap-4 md:gap-2 w-full">
             <Node step={steps[0]} />
             <Arrow delay={steps[0].arrowDelay} />
             <Node step={steps[1]} />
             <Arrow delay={steps[1].arrowDelay} />
             <Node step={steps[2]} />
             <Arrow delay={steps[2].arrowDelay} />
             <Node step={steps[3]} />
          </div>

          {/* Row 2 (3 items, perfectly centered) */}
          <div className="flex flex-wrap md:flex-nowrap justify-center items-start gap-4 md:gap-2 w-full">
             <Node step={steps[4]} />
             <Arrow delay={steps[4].arrowDelay} />
             <Node step={steps[5]} />
             <Arrow delay={steps[5].arrowDelay} />
             <Node step={steps[6]} />
          </div>

        </div>
      </div>
    </div>
  );
}
