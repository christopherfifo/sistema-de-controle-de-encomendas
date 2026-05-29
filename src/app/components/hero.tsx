import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldCheck, Clock, Package, CheckCircle2, Search, Bell } from "lucide-react";
import { RoleModal } from "./role-modal";

const Hero = () => {
  const packages = [
    { name: "Caixa Amazon", unit: "Bloco A - 101", status: "Entregue", isDelivered: true },
    { name: "Pacote Sedex", unit: "Bloco B - 204", status: "Pendente", isDelivered: false },
    { name: "Envelope Mercado Livre", unit: "Bloco A - 302", status: "Entregue", isDelivered: true },
    { name: "Caixa Grande", unit: "Bloco C - 105", status: "Entregue", isDelivered: true },
  ];

  return (
    <section className="relative w-full pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-[#0A0A0A] border-b border-white/5">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          {/* Text content */}
          <div className="max-w-2xl z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 mb-6">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-semibold text-emerald-400 tracking-wider">
                SEGURANÇA E AGILIDADE
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight leading-[1.1] mb-6">
              A portaria do seu condomínio, <span className="text-emerald-400">totalmente digital.</span>
            </h1>
            
            <p className="text-lg text-gray-400 mb-8 leading-relaxed">
              O CondoDrop moderniza o recebimento de pacotes. Notificações automáticas, rastreamento em tempo real e fim do extravio de encomendas.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <RoleModal>
                <Button
                  size="lg"
                  className="w-full sm:w-auto h-12 bg-emerald-500 text-black hover:bg-emerald-600 rounded-md px-8 text-base font-semibold transition-all shadow-[0_0_20px_rgba(16,185,129,0.15)]"
                >
                  Começar Agora <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </RoleModal>
              
              <Button
                asChild
                size="lg"
                variant="outline"
                className="w-full sm:w-auto h-12 border-white/20 bg-transparent text-white hover:bg-white/5 rounded-md px-8 text-base"
              >
                <Link href="/login">Acessar minha conta</Link>
              </Button>
            </div>

            <div className="mt-10 flex items-center gap-6 text-sm text-gray-400 font-medium">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-500" /> Retirada Segura
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-emerald-500" /> Notificações na Hora
              </div>
            </div>
          </div>

          {/* Code Mockup Content instead of Image */}
          <div className="relative w-full h-[400px] lg:h-[550px] bg-[#111] border border-white/10 rounded-2xl p-4 shadow-2xl z-10 hidden md:block">
            <div className="absolute inset-0 bg-gradient-to-bl from-emerald-500/10 to-transparent rounded-2xl pointer-events-none"></div>
            
            {/* Window Chrome */}
            <div className="relative w-full h-full rounded-xl overflow-hidden bg-[#0A0A0A] border border-white/5 flex flex-col shadow-inner">
              
              {/* Fake Dashboard Header */}
              <div className="h-14 border-b border-white/5 bg-white/[0.02] flex items-center px-6 justify-between">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-md w-1/3 border border-white/5">
                  <Search className="h-3.5 w-3.5 text-gray-500" />
                  <div className="h-2 w-20 bg-white/10 rounded"></div>
                </div>
                <div className="flex items-center gap-4">
                  <Bell className="h-4 w-4 text-gray-500" />
                  <div className="h-6 w-6 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                    <span className="text-[10px] font-bold text-emerald-400">SY</span>
                  </div>
                </div>
              </div>

              {/* Fake Dashboard Body */}
              <div className="flex-1 p-6 flex flex-col gap-4 overflow-hidden relative">
                
                {/* Page Title & Stats */}
                <div className="flex items-end justify-between mb-4">
                  <div>
                    <div className="h-5 w-40 bg-white/20 rounded mb-2"></div>
                    <div className="h-3 w-64 bg-white/10 rounded"></div>
                  </div>
                  <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-md">
                    <div className="h-3 w-20 bg-emerald-500/50 rounded mb-1.5"></div>
                    <div className="h-5 w-10 bg-emerald-500 rounded"></div>
                  </div>
                </div>

                {/* List Items */}
                <div className="flex flex-col gap-3">
                  {packages.map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors group">
                      <div className="flex items-center gap-4">
                        <div className={`p-2.5 rounded-lg ${item.isDelivered ? 'bg-emerald-500/10' : 'bg-yellow-500/10'} group-hover:scale-110 transition-transform`}>
                          <Package className={`w-5 h-5 ${item.isDelivered ? 'text-emerald-500' : 'text-yellow-500'}`} />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white mb-1">{item.name}</div>
                          <div className="text-xs text-gray-500">{item.unit}</div>
                        </div>
                      </div>
                      <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${item.isDelivered ? 'border-emerald-500/20 bg-emerald-500/10' : 'border-yellow-500/20 bg-yellow-500/10'}`}>
                        {item.isDelivered ? (
                          <CheckCircle2 className={`w-3.5 h-3.5 text-emerald-400`} />
                        ) : (
                          <Clock className={`w-3.5 h-3.5 text-yellow-400`} />
                        )}
                        <span className={`text-[10px] font-bold tracking-wider uppercase ${item.isDelivered ? 'text-emerald-400' : 'text-yellow-400'}`}>
                          {item.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Fade out gradient at bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#0A0A0A] to-transparent pointer-events-none"></div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;