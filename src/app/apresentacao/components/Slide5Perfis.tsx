import React from 'react';
import { 
  Smartphone, Package, 
  ShieldCheck, UserCheck, 
  BarChart3, Settings, 
  CheckCircle2 
} from 'lucide-react';

export default function Slide5Perfis() {
  
  // Premium SaaS Icon Compositions (Fixed Alignment, 1 Sub-icon)
  const MoradorIllustration = () => (
    <div className="relative transform group-hover:-translate-y-2 transition-transform duration-500 inline-flex">
      <div className="relative z-10 bg-zinc-900 border border-zinc-700/80 p-6 rounded-2xl shadow-xl flex items-center justify-center">
         <Smartphone className="w-12 h-12 text-blue-400" />
         
         {/* 1 Floating Sub-icon */}
         <div className="absolute -top-3 -right-3 z-20 bg-zinc-800 border border-zinc-600/80 p-2.5 rounded-xl shadow-lg">
            <Package className="w-6 h-6 text-blue-300" />
         </div>
      </div>
      {/* Subtle backdrop circle */}
      <div className="absolute inset-2 bg-blue-500/20 rounded-full blur-2xl z-0"></div>
    </div>
  );

  const PorteiroIllustration = () => (
    <div className="relative transform group-hover:-translate-y-2 transition-transform duration-500 inline-flex">
      <div className="relative z-10 bg-zinc-900 border border-zinc-700/80 p-6 rounded-2xl shadow-xl flex items-center justify-center">
         <ShieldCheck className="w-12 h-12 text-emerald-400" />
         
         {/* 1 Floating Sub-icon */}
         <div className="absolute -top-3 -left-3 z-20 bg-zinc-800 border border-zinc-600/80 p-2.5 rounded-xl shadow-lg">
            <UserCheck className="w-6 h-6 text-emerald-300" />
         </div>
      </div>
      {/* Subtle backdrop circle */}
      <div className="absolute inset-2 bg-emerald-500/20 rounded-full blur-2xl z-0"></div>
    </div>
  );

  const SindicoIllustration = () => (
    <div className="relative transform group-hover:-translate-y-2 transition-transform duration-500 inline-flex">
      <div className="relative z-10 bg-zinc-900 border border-zinc-700/80 p-6 rounded-2xl shadow-xl flex items-center justify-center">
         <BarChart3 className="w-12 h-12 text-violet-400" />
         
         {/* 1 Floating Sub-icon */}
         <div className="absolute -bottom-3 -right-3 z-20 bg-zinc-800 border border-zinc-600/80 p-2.5 rounded-xl shadow-lg">
            <Settings className="w-6 h-6 text-violet-300" />
         </div>
      </div>
      {/* Subtle backdrop circle */}
      <div className="absolute inset-2 bg-violet-500/20 rounded-full blur-2xl z-0"></div>
    </div>
  );

  const perfis = [
    {
      title: "Morador",
      tag: "Web App",
      desc: "Interface web do usuário final",
      color: "text-blue-400",
      accent: "bg-blue-500/10",
      Illustration: MoradorIllustration,
      delay: "delay-[200ms]",
      features: [
        "Cadastro de previsão de entrega",
        "Recebimento de notificações",
        "Consulta ao histórico",
        "Confirmação da retirada",
      ]
    },
    {
      title: "Porteiro",
      tag: "Operacional",
      desc: "Painel operacional da portaria",
      color: "text-emerald-400",
      accent: "bg-emerald-500/10",
      Illustration: PorteiroIllustration,
      delay: "delay-[400ms]",
      features: [
        "Registro de encomendas",
        "Captura de fotos do pacote",
        "Associação ao destinatário",
        "Registro da retirada",
      ]
    },
    {
      title: "Administrador",
      tag: "Gestão",
      desc: "Dashboard gerencial e auditoria",
      color: "text-violet-400",
      accent: "bg-violet-500/10",
      Illustration: SindicoIllustration,
      delay: "delay-[600ms]",
      features: [
        "Gerenciamento do condomínio",
        "Cadastro de usuários",
        "Cadastro de porteiros",
        "Auditoria de movimentações",
      ]
    }
  ];

  return (
    <div className="flex flex-col justify-center h-full px-6 md:px-12 lg:px-16 w-full max-w-[1340px] mx-auto relative pt-4">
      <div className="mb-8 lg:mb-10 text-center lg:text-left lg:ml-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-medium text-zinc-400 mb-6 uppercase tracking-widest animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          Visão Geral da Plataforma
        </div>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-white mb-4 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-75 fill-mode-both">
          Perfis de Usuário
        </h2>
        <p className="text-lg md:text-xl text-zinc-400 font-light max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150 fill-mode-both mx-auto lg:mx-0">
          Cada perfil possui funcionalidades específicas para garantir segurança e organização do processo de entregas.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16 w-full">
        {perfis.map((perfil, index) => (
          <div 
            key={index} 
            className={`group flex flex-col p-6 lg:p-8 bg-zinc-900/40 border border-zinc-800/80 rounded-[2rem] backdrop-blur-sm transition-all duration-500 hover:bg-zinc-800/40 hover:border-zinc-700/80 hover:shadow-2xl animate-in fade-in zoom-in-95 fill-mode-both ${perfil.delay}`}
          >
            
            {/* Top Section: Illustration & Title */}
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left mb-6">
              <div className="mb-6 w-full flex justify-center lg:justify-start">
                 <perfil.Illustration />
              </div>
              
              <div className={`px-3 py-1 rounded-full ${perfil.accent} ${perfil.color} text-xs font-medium mb-3 uppercase tracking-wider`}>
                {perfil.tag}
              </div>
              <h3 className="text-2xl lg:text-3xl font-bold text-zinc-100 tracking-tight mb-2">{perfil.title}</h3>
              <p className="text-zinc-400 text-sm">{perfil.desc}</p>
            </div>

            {/* Divider */}
            <div className="w-full h-px bg-zinc-800 mb-6"></div>

            {/* Features List */}
            <ul className="w-full space-y-3 lg:space-y-4">
              {perfil.features.map((feature, fIndex) => (
                <li key={fIndex} className="flex items-start gap-3">
                  <CheckCircle2 className={`w-5 h-5 lg:w-6 lg:h-6 mt-0.5 shrink-0 ${perfil.color} opacity-80`} />
                  <span className="text-sm lg:text-base text-zinc-300 font-light leading-snug">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
