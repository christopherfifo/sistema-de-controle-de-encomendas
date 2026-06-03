import React from 'react';
import { Zap, BellRing, ShieldCheck, Box, Package, Send } from 'lucide-react';

export default function Slide2Solucao() {
  return (
    <div className="flex flex-col justify-center h-full px-12 md:px-32">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto w-full">
        
        {/* Lado Esquerdo - Textos */}
        <div className="space-y-10 animate-in fade-in slide-in-from-left-4 duration-500 delay-150 fill-mode-both">
          <h2 className="text-5xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-white leading-[1.1]">
            <span className="text-emerald-400">Rastreabilidade</span> e<br/>controle integrado.
          </h2>
          
          <div className="space-y-8">
            <div className="flex gap-6 items-start group animate-in fade-in slide-in-from-bottom-4 duration-300 delay-300 fill-mode-both">
              <div className="w-14 h-14 bg-zinc-900 border border-white/10 rounded-2xl flex items-center justify-center shrink-0 group-hover:border-emerald-500/50 group-hover:bg-emerald-500/10 transition-colors">
                <Zap className="w-7 h-7 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Registro Otimizado</h3>
                <p className="text-xl text-zinc-400 font-light leading-relaxed">Registro ágil de pacotes pela portaria, digitalizando o controle e gerando um histórico auditável do fluxo.</p>
              </div>
            </div>

            <div className="flex gap-6 items-start group animate-in fade-in slide-in-from-bottom-4 duration-300 delay-500 fill-mode-both">
              <div className="w-14 h-14 bg-zinc-900 border border-white/10 rounded-2xl flex items-center justify-center shrink-0 group-hover:border-blue-500/50 group-hover:bg-blue-500/10 transition-colors">
                <BellRing className="w-7 h-7 text-blue-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Notificação Automática</h3>
                <p className="text-xl text-zinc-400 font-light leading-relaxed">Disparo automático de alertas via integração com API do Telegram e E-mail após o recebimento.</p>
              </div>
            </div>

            <div className="flex gap-6 items-start group animate-in fade-in slide-in-from-bottom-4 duration-300 delay-700 fill-mode-both">
              <div className="w-14 h-14 bg-zinc-900 border border-white/10 rounded-2xl flex items-center justify-center shrink-0 group-hover:border-purple-500/50 group-hover:bg-purple-500/10 transition-colors">
                <ShieldCheck className="w-7 h-7 text-purple-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Retirada Autenticada</h3>
                <p className="text-xl text-zinc-400 font-light leading-relaxed">Validação via token de segurança, garantindo a entrega apenas ao destinatário correto.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Lado Direito - Mocks Visuais */}
        <div className="relative w-full h-[600px] hidden lg:block perspective-1000 animate-in fade-in slide-in-from-right-4 duration-500 delay-500 fill-mode-both">
          <div className="absolute inset-0 bg-emerald-500/20 blur-[100px] rounded-full animate-[pulse_6s_ease-in-out_infinite]"></div>
          
          {/* Mock da Interface Web (Dashboard) */}
          <div className="absolute right-0 top-12 w-[110%] bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden transform rotate-[-2deg] hover:rotate-0 transition-transform duration-300">
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
          <div className="absolute -left-12 bottom-20 z-20" style={{ animation: 'floatTelegram 6s ease-in-out infinite' }}>
            <div className="bg-[#182533] border border-[#2b3a4a] p-5 rounded-2xl rounded-bl-none shadow-2xl transform rotate-3 hover:scale-105 transition-transform duration-300 min-w-[280px]">
               <div className="flex items-center gap-3 mb-3">
                 <div className="w-10 h-10 bg-[#2AABEE] rounded-full flex items-center justify-center shrink-0">
                    <Send className="w-5 h-5 text-white -ml-1 mt-0.5" />
                 </div>
                 <span className="text-white font-bold text-base">CondoDrop Bot</span>
               </div>
               <p className="text-blue-50 text-base leading-relaxed mb-1">📦 <strong>Nova Encomenda!</strong><br/>Seu pacote (Amazon) está te esperando na portaria.</p>
               <div className="flex justify-end w-full mt-1">
                 <span className="text-xs text-blue-300/50">Agora mesmo</span>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
