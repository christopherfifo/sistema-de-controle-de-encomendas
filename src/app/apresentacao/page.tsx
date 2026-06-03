"use client";

import React, { useState, useEffect, useCallback } from "react";
import { 
  Package, 
  ShieldCheck, 
  BellRing, 
  Database, 
  ArrowRight,
  ArrowLeft,
  Users,
  Building,
  Key,
  Terminal,
  Zap,
  Box,
  QrCode,
  Smartphone,
  Server,
  Send
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Fundo customizado com grid
const GridBackground = () => (
  <div className="absolute inset-0 -z-10 h-full w-full bg-zinc-950">
    <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
  </div>
);

export default function ApresentacaoPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  const slides = [
    // Slide 0: Abertura "Soco no Estômago"
    <div key="capa" className="flex flex-col items-center justify-center text-center h-full space-y-10 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/20 rounded-full blur-[120px] -z-10 animate-in fade-in duration-1000"></div>
      
      <div className="relative group cursor-default animate-in fade-in zoom-in-95 duration-700 delay-150 fill-mode-both">
        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-teal-400 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
        <div className="relative bg-zinc-900 ring-1 ring-white/10 p-10 rounded-3xl">
          <Package className="w-24 h-24 text-emerald-400" />
        </div>
      </div>

      <div className="space-y-4">
        <h1 className="text-7xl md:text-9xl font-black tracking-tighter text-white animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300 fill-mode-both">
          Condo<span className="text-emerald-400">Drop</span>
        </h1>
        <p className="text-3xl md:text-4xl text-zinc-400 font-light tracking-tight max-w-3xl mx-auto mt-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500 fill-mode-both">
          A portaria não precisa ser um estoque caótico.
        </p>
      </div>

      <div className="absolute bottom-12 flex flex-col items-center gap-2 opacity-50 animate-pulse animate-in fade-in duration-1000 delay-700 fill-mode-both">
        <span className="text-sm font-mono tracking-widest uppercase text-zinc-500">Pressione as setas para iniciar</span>
      </div>
    </div>,

    // Slide 1: O Caos Real (Problema)
    <div key="problema" className="flex flex-col justify-center h-full px-12 md:px-32">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto w-full">
        <div className="space-y-10 animate-in fade-in slide-in-from-left-8 duration-700 delay-150 fill-mode-both">
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
        <div className="relative h-[600px] w-full hidden lg:block animate-in fade-in slide-in-from-right-8 duration-700 delay-300 fill-mode-both">
          <div className="absolute inset-0 bg-red-500/5 rounded-3xl border border-red-500/10 backdrop-blur-sm overflow-hidden flex items-center justify-center">
            <div className="absolute top-1/4 left-1/4 rotate-12 opacity-40 animate-[pulse_4s_ease-in-out_infinite]"><Box className="w-32 h-32 text-red-400" /></div>
            <div className="absolute top-1/2 right-1/4 -rotate-12 opacity-60 animate-[pulse_5s_ease-in-out_infinite_1s]"><Box className="w-40 h-40 text-orange-400" /></div>
            <div className="absolute bottom-1/4 left-1/3 rotate-45 opacity-30 animate-[pulse_6s_ease-in-out_infinite_2s]"><Box className="w-24 h-24 text-red-500" /></div>
            <div className="absolute top-1/3 right-1/3 -rotate-45 opacity-50 animate-[pulse_3s_ease-in-out_infinite_0.5s]"><Box className="w-28 h-28 text-yellow-400" /></div>
            
            <div className="z-10 bg-zinc-950/90 p-8 rounded-2xl border border-zinc-800 shadow-2xl backdrop-blur-md animate-in zoom-in duration-500 delay-700 fill-mode-both hover:scale-105 transition-transform cursor-default">
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
    </div>,

    // Slide 2: A Virada (Solução + Mockup)
    <div key="solucao" className="flex flex-col justify-center h-full px-12 md:px-32">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto w-full">
        
        {/* Lado Esquerdo - Textos */}
        <div className="space-y-10 animate-in fade-in slide-in-from-left-8 duration-700 delay-150 fill-mode-both">
          <h2 className="text-5xl md:text-6xl font-bold tracking-tighter text-white leading-[1.1]">
            Fluxo digital, seguro e <span className="text-emerald-400">em tempo real.</span>
          </h2>
          
          <div className="space-y-8">
            <div className="flex gap-6 items-start group animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300 fill-mode-both">
              <div className="w-14 h-14 bg-zinc-900 border border-white/10 rounded-2xl flex items-center justify-center shrink-0 group-hover:border-emerald-500/50 group-hover:bg-emerald-500/10 transition-colors">
                <Zap className="w-7 h-7 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Registro Expresso</h3>
                <p className="text-xl text-zinc-400 font-light leading-relaxed">Porteiros registram chegadas em segundos, eliminando papéis e criando um rastro de auditoria permanente.</p>
              </div>
            </div>

            <div className="flex gap-6 items-start group animate-in fade-in slide-in-from-bottom-4 duration-500 delay-500 fill-mode-both">
              <div className="w-14 h-14 bg-zinc-900 border border-white/10 rounded-2xl flex items-center justify-center shrink-0 group-hover:border-blue-500/50 group-hover:bg-blue-500/10 transition-colors">
                <BellRing className="w-7 h-7 text-blue-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Ping no Bolso</h3>
                <p className="text-xl text-zinc-400 font-light leading-relaxed">O morador recebe um aviso automático via e-mail e Telegram informando que sua encomenda chegou.</p>
              </div>
            </div>

            <div className="flex gap-6 items-start group animate-in fade-in slide-in-from-bottom-4 duration-500 delay-700 fill-mode-both">
              <div className="w-14 h-14 bg-zinc-900 border border-white/10 rounded-2xl flex items-center justify-center shrink-0 group-hover:border-purple-500/50 group-hover:bg-purple-500/10 transition-colors">
                <ShieldCheck className="w-7 h-7 text-purple-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Retirada Inviolável</h3>
                <p className="text-xl text-zinc-400 font-light leading-relaxed">Geração de Tokens únicos (QR/Código) para garantir que apenas o dono ou pessoa autorizada retire o pacote.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Lado Direito - Mocks Visuais */}
        <div className="relative w-full h-[600px] hidden lg:block perspective-1000 animate-in fade-in slide-in-from-right-8 duration-700 delay-500 fill-mode-both">
          <div className="absolute inset-0 bg-emerald-500/20 blur-[100px] rounded-full"></div>
          
          {/* Mock da Interface Web (Dashboard) */}
          <div className="absolute right-0 top-12 w-[110%] bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden transform rotate-[-2deg] hover:rotate-0 transition-transform duration-500">
            {/* Fake Browser Header */}
            <div className="h-10 bg-zinc-900 border-b border-zinc-800 flex items-center px-4 gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <div className="ml-4 px-3 py-1 bg-zinc-800 rounded text-xs font-mono text-zinc-400 flex-1 flex items-center justify-center max-w-sm">condodrop.com.br/painel</div>
            </div>
            {/* App Layout */}
            <div className="flex h-96">
              {/* Sidebar */}
              <div className="w-20 bg-zinc-900/50 border-r border-zinc-800 p-4 flex flex-col gap-6 items-center pt-8">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center mb-4"><Package className="w-5 h-5 text-emerald-400"/></div>
                <div className="w-10 h-10 rounded-xl bg-zinc-800 opacity-50"></div>
                <div className="w-10 h-10 rounded-xl bg-zinc-800 opacity-50"></div>
              </div>
              {/* Content */}
              <div className="p-8 flex-1 bg-background/50">
                <div className="h-8 w-1/3 bg-zinc-800 rounded-md mb-8"></div>
                <div className="space-y-4">
                  <div className="h-16 w-full bg-zinc-900 rounded-lg border border-zinc-800 flex items-center px-6 justify-between hover:bg-zinc-800/50 transition-colors">
                     <div className="flex items-center gap-4">
                       <div className="w-10 h-10 bg-zinc-800 rounded flex items-center justify-center"><Box className="w-5 h-5 text-zinc-500" /></div>
                       <div className="flex flex-col gap-2">
                         <div className="w-32 h-4 bg-zinc-200 rounded"></div>
                         <div className="w-20 h-3 bg-zinc-700 rounded"></div>
                       </div>
                     </div>
                     <div className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 rounded-full text-xs font-bold">Pendente</div>
                  </div>
                  <div className="h-16 w-full bg-zinc-900 rounded-lg border border-zinc-800 flex items-center px-6 justify-between hover:bg-zinc-800/50 transition-colors">
                     <div className="flex items-center gap-4">
                       <div className="w-10 h-10 bg-zinc-800 rounded flex items-center justify-center"><Box className="w-5 h-5 text-zinc-500" /></div>
                       <div className="flex flex-col gap-2">
                         <div className="w-24 h-4 bg-zinc-200 rounded"></div>
                         <div className="w-16 h-3 bg-zinc-700 rounded"></div>
                       </div>
                     </div>
                     <div className="px-3 py-1 bg-zinc-500/20 text-zinc-400 border border-zinc-500/50 rounded-full text-xs font-bold">Entregue</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mock do Telegram Bubble (Flutuando) */}
          <div className="absolute -left-12 bottom-20 bg-[#182533] border border-[#2b3a4a] p-5 rounded-2xl rounded-bl-none shadow-2xl transform rotate-3 hover:scale-105 transition-transform duration-500 animate-[bounce_4s_ease-in-out_infinite]">
             <div className="flex items-center gap-3 mb-3">
               <div className="w-10 h-10 bg-[#2AABEE] rounded-full flex items-center justify-center">
                  <Send className="w-5 h-5 text-white -ml-1 mt-0.5" />
               </div>
               <span className="text-white font-bold text-base">CondoDrop Bot</span>
             </div>
             <p className="text-blue-50 text-base leading-relaxed">📦 <strong>Nova Encomenda!</strong><br/>Seu pacote (Amazon) está te esperando na portaria.</p>
             <span className="text-xs text-blue-300/50 float-right mt-2">Agora mesmo</span>
          </div>
        </div>
      </div>
    </div>,

    // Slide 3: Arquitetura Real (Bento Flow)
    <div key="arquitetura" className="flex flex-col justify-center h-full px-12 md:px-32">
      <h2 className="text-5xl md:text-6xl font-bold tracking-tighter text-white mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150 fill-mode-both">
        Arquitetura Multi-Tenant
      </h2>
      <p className="text-2xl text-zinc-400 font-light mb-16 max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 fill-mode-both">
        Desenhado para isolar perfeitamente as informações. Centenas de condomínios podem usar a mesma infraestrutura de nuvem com total segurança e performance.
      </p>
      
      {/* Visual Flowchart */}
      <div className="relative max-w-5xl mx-auto w-full mt-8">
        {/* Linhas de conexão (SVG) */}
        <svg className="absolute inset-0 w-full h-full -z-10 hidden md:block animate-in fade-in duration-1000 delay-700 fill-mode-both" style={{ pointerEvents: 'none' }}>
           <path d="M 50% 15% L 50% 50% L 20% 50% L 20% 80%" stroke="rgba(255,255,255,0.1)" strokeWidth="3" fill="none" strokeDasharray="8,8" className="animate-[dash_20s_linear_infinite]" />
           <path d="M 50% 15% L 50% 50% L 50% 80%" stroke="rgba(16,185,129,0.3)" strokeWidth="3" fill="none" />
           <path d="M 50% 15% L 50% 50% L 80% 50% L 80% 80%" stroke="rgba(255,255,255,0.1)" strokeWidth="3" fill="none" strokeDasharray="8,8" />
        </svg>

        <div className="flex flex-col items-center gap-16">
          {/* Top Node */}
          <div className="bg-zinc-900 border-2 border-emerald-500/30 p-8 rounded-3xl w-80 text-center shadow-[0_0_40px_-10px_rgb(16,185,129)] z-10 animate-in fade-in zoom-in-95 duration-700 delay-500 fill-mode-both hover:scale-105 transition-transform cursor-default">
             <Building className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
             <h3 className="font-bold text-white text-xl">ID_CONDOMINIO</h3>
             <p className="text-sm text-zinc-400 mt-2">A chave mestre que isola todo o escopo de dados no servidor.</p>
          </div>

          {/* Bottom Nodes */}
          <div className="flex flex-col md:flex-row justify-between w-full gap-8">
            <div className="bg-zinc-950 border-2 border-white/10 p-8 rounded-3xl flex-1 text-center z-10 hover:border-white/30 transition-colors animate-in fade-in slide-in-from-bottom-8 duration-700 delay-700 fill-mode-both">
               <ShieldCheck className="w-10 h-10 text-zinc-400 mx-auto mb-4" />
               <h4 className="font-bold text-white text-lg">Síndicos</h4>
               <p className="text-sm text-zinc-500 mt-3">Visão global, gestão de faturas, configurações e auditoria total.</p>
            </div>
            
            <div className="bg-zinc-900 border-2 border-emerald-500/20 p-8 rounded-3xl flex-1 text-center z-10 relative shadow-xl animate-in fade-in slide-in-from-bottom-8 duration-700 delay-1000 fill-mode-both">
               <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-emerald-500 text-black text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider">Operação</div>
               <Package className="w-10 h-10 text-emerald-400 mx-auto mb-4" />
               <h4 className="font-bold text-white text-lg">Portaria</h4>
               <p className="text-sm text-zinc-400 mt-3">Dashboard ágil focado em alta velocidade de I/O de pacotes.</p>
            </div>

            <div className="bg-zinc-950 border-2 border-white/10 p-8 rounded-3xl flex-1 text-center z-10 hover:border-white/30 transition-colors animate-in fade-in slide-in-from-bottom-8 duration-700 delay-700 fill-mode-both">
               <Users className="w-10 h-10 text-zinc-400 mx-auto mb-4" />
               <h4 className="font-bold text-white text-lg">Moradores</h4>
               <p className="text-sm text-zinc-500 mt-3">Acesso restrito à sua unidade e geração de chaves seguras.</p>
            </div>
          </div>
        </div>
      </div>
    </div>,

    // Slide 4: Sob o Capô (Bento Grid)
    <div key="tech" className="flex flex-col justify-center h-full px-12 md:px-32">
      <h2 className="text-5xl md:text-6xl font-bold tracking-tighter text-white mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150 fill-mode-both">
        A Stack Tecnológica
      </h2>
      
      {/* Bento Grid Layout - Balanced and Full */}
      <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-6 max-w-6xl mx-auto w-full h-[550px]">
        
        {/* Next.js (Big Block) */}
        <div className="md:row-span-2 bg-zinc-900 border border-white/10 rounded-3xl p-10 relative overflow-hidden group hover:border-white/30 transition-colors flex flex-col justify-between animate-in fade-in zoom-in-95 duration-700 delay-300 fill-mode-both">
          <div className="absolute -bottom-10 -right-10 p-12 opacity-5 group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-700">
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
        <div className="bg-zinc-900 border border-white/10 rounded-3xl p-8 group hover:border-[#336791]/50 transition-colors animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500 fill-mode-both">
           <Database className="w-10 h-10 text-[#336791] mb-5 group-hover:-translate-y-1 transition-transform duration-300" />
           <h3 className="text-2xl font-bold text-white mb-2">PostgreSQL</h3>
           <p className="text-base text-zinc-400">Banco relacional hospedado via serverless.</p>
        </div>

        {/* Prisma ORM */}
        <div className="bg-zinc-900 border border-white/10 rounded-3xl p-8 group hover:border-white/30 transition-colors animate-in fade-in slide-in-from-bottom-8 duration-700 delay-600 fill-mode-both">
           <Server className="w-10 h-10 text-white mb-5 group-hover:-translate-y-1 transition-transform duration-300" />
           <h3 className="text-2xl font-bold text-white mb-2">Prisma ORM</h3>
           <p className="text-base text-zinc-400">Tipagem estrita de ponta a ponta em TypeScript.</p>
        </div>

        {/* Tailwind + Shadcn */}
        <div className="bg-zinc-900 border border-white/10 rounded-3xl p-8 group hover:border-[#38BDF8]/50 transition-colors animate-in fade-in slide-in-from-bottom-8 duration-700 delay-700 fill-mode-both">
           <div className="w-12 h-12 bg-[#38BDF8]/10 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
             <svg viewBox="0 0 24 24" fill="none" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path><path d="M12 12v9"></path><path d="m8 17 4 4 4-4"></path></svg>
           </div>
           <h3 className="text-2xl font-bold text-white mb-2">Tailwind + Shadcn</h3>
           <p className="text-base text-zinc-400">Design system utilitário com dark mode nativo.</p>
        </div>

        {/* Integrações */}
        <div className="bg-zinc-900 border border-white/10 rounded-3xl p-8 group hover:border-[#2CA5E0]/50 transition-colors animate-in fade-in slide-in-from-bottom-8 duration-700 delay-1000 fill-mode-both">
           <BellRing className="w-10 h-10 text-[#2CA5E0] mb-5 group-hover:-translate-y-1 transition-transform duration-300" />
           <h3 className="text-2xl font-bold text-white mb-2">Integrações</h3>
           <p className="text-base text-zinc-400">Alertas push via API do Telegram e disparos de E-mail.</p>
        </div>

      </div>
    </div>,

    // Slide 5: Fim / Call to Action
    <div key="end" className="flex flex-col items-center justify-center text-center h-full px-4">
      <div className="w-full max-w-3xl bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl mb-12 animate-in fade-in slide-in-from-bottom-12 duration-700 delay-150 fill-mode-both">
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
          <p className="text-emerald-400 mt-4 animate-pulse">Aguardando demonstração ao vivo_</p>
        </div>
      </div>
      
      <h2 className="text-5xl font-bold text-white mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500 fill-mode-both">Vamos ver na prática?</h2>
      
      <div className="animate-in fade-in zoom-in-95 duration-700 delay-700 fill-mode-both">
        <Button size="lg" className="px-10 h-16 text-xl font-bold bg-white text-black hover:bg-zinc-200 hover:scale-105 transition-all duration-300 rounded-full group" onClick={() => window.location.href = '/'}>
          Iniciar Demonstração do Sistema
          <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform" />
        </Button>
      </div>
    </div>
  ];

  const handleNext = useCallback(() => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? prev : prev + 1));
  }, [slides.length]);

  const handlePrev = useCallback(() => {
    setCurrentSlide((prev) => (prev === 0 ? prev : prev - 1));
  }, []);

  // Teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "Space") {
        handleNext();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handlePrev]);

  useEffect(() => {
    setIsMounted(true);
    // Força a tag html para dark mode enquanto estiver nessa página
    document.documentElement.classList.add('dark');
    return () => {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  if (!isMounted) return null;

  return (
    <div className="fixed inset-0 bg-zinc-950 text-zinc-50 overflow-hidden flex flex-col font-sans selection:bg-emerald-500/30 z-[100]">
      <GridBackground />

      {/* Barra de Progresso Superior */}
      <div className="h-1.5 bg-zinc-900 w-full fixed top-0 z-50">
        <div 
          className="h-full bg-emerald-500 transition-all duration-500 ease-out shadow-[0_0_15px_rgb(16,185,129)]"
          style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
        />
      </div>

      {/* Conteúdo do Slide */}
      <div className="flex-grow relative z-10 flex items-center justify-center">
        {slides[currentSlide]}
      </div>

      {/* Controles Inferiores */}
      <div className="fixed bottom-8 left-0 right-0 flex justify-center items-center gap-6 opacity-0 hover:opacity-100 focus-within:opacity-100 transition-opacity duration-300 z-50">
        <div className="bg-zinc-900/80 backdrop-blur-md border border-white/10 p-3 rounded-full flex items-center gap-4 shadow-2xl">
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10 hover:text-white w-10 h-10" onClick={handlePrev} disabled={currentSlide === 0}>
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <span className="text-base font-mono font-medium tracking-widest text-zinc-400 w-20 text-center">
            {String(currentSlide + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
          </span>
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10 hover:text-white w-10 h-10" onClick={handleNext} disabled={currentSlide === slides.length - 1}>
            <ArrowRight className="w-6 h-6" />
          </Button>
        </div>
      </div>
    </div>
  );
}