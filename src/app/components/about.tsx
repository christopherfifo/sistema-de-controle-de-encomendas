import {
  Building2,
  UserCircle,
  QrCode,
  BellRing,
  Package,
  Clock,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";

const About = () => {
  return (
    <section id="sobre" className="bg-[#0A0A0A] py-24 border-b border-white/5">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="mb-16 text-center lg:text-left">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Desenhado para o ecossistema do condomínio
          </h2>
          <p className="text-gray-400 max-w-2xl text-lg mx-auto lg:mx-0">
            O CondoDrop atende às necessidades específicas de quem gerencia o
            prédio e de quem mora nele. Uma plataforma única para conectar a
            portaria à sua casa.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Feature block 1: Admin */}
          <div className="bg-[#111] border border-white/5 rounded-2xl p-8 lg:p-10 hover:border-white/10 transition-colors flex flex-col h-full">
            <div className="h-12 w-12 bg-emerald-500/10 rounded-lg flex items-center justify-center mb-6">
              <Building2 className="h-6 w-6 text-emerald-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">
              Para a Administração
            </h3>
            <p className="text-gray-400 mb-8 flex-1">
              Tenha controle absoluto sobre a entrada e saída de pacotes. Reduza
              filas na portaria, evite extravios e tenha um histórico auditável
              de cada entrega.
            </p>
            <div className="space-y-4 mb-10">
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <ShieldCheck className="h-5 w-5 text-emerald-500" /> Histórico
                100% auditável
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <UserCircle className="h-5 w-5 text-emerald-500" /> Gestão de
                moradores e porteiros
              </div>
            </div>

            {/* UI Mockup - Admin Widgets */}
            <div className="relative h-72 w-full rounded-xl overflow-hidden border border-white/10 bg-[#0A0A0A] flex flex-col shadow-inner">
              <div className="h-8 bg-white/[0.02] border-b border-white/5 flex items-center px-4 gap-2">
                <div className="w-2 h-2 rounded-full bg-white/10"></div>
                <div className="w-2 h-2 rounded-full bg-white/10"></div>
                <div className="w-2 h-2 rounded-full bg-white/10"></div>
              </div>
              <div className="flex-1 p-4 grid grid-cols-2 gap-3">
                <div className="bg-emerald-500/5 rounded-lg p-3 border border-emerald-500/10 flex flex-col justify-between">
                  <Package className="w-5 h-5 text-emerald-400 mb-2" />
                  <div>
                    <div className="text-2xl font-bold text-white">124</div>
                    <div className="text-[10px] text-gray-400 uppercase tracking-wider mt-1">
                      Pacotes Entregues
                    </div>
                  </div>
                </div>
                <div className="bg-yellow-500/5 rounded-lg p-3 border border-yellow-500/10 flex flex-col justify-between">
                  <Clock className="w-5 h-5 text-yellow-400 mb-2" />
                  <div>
                    <div className="text-2xl font-bold text-white">12</div>
                    <div className="text-[10px] text-gray-400 uppercase tracking-wider mt-1">
                      Aguardando
                    </div>
                  </div>
                </div>
                <div className="col-span-2 bg-white/5 rounded-lg p-3 border border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                      <UserCircle className="w-4 h-4 text-gray-400" />
                    </div>
                    <div>
                      <div className="text-xs text-white font-medium mb-0.5">
                        Carlos (Porteiro)
                      </div>
                      <div className="text-[10px] text-emerald-400">
                        Online agora
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Feature block 2: Resident */}
          <div className="bg-[#111] border border-white/5 rounded-2xl p-8 lg:p-10 hover:border-white/10 transition-colors flex flex-col h-full">
            <div className="h-12 w-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-6">
              <UserCircle className="h-6 w-6 text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">
              Para os Moradores
            </h3>
            <p className="text-gray-400 mb-8 flex-1">
              Acompanhe suas encomendas em tempo real. Saiba exatamente quando
              seu pacote chegou e agilize a retirada na portaria com segurança.
            </p>
            <div className="space-y-4 mb-10">
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <BellRing className="h-5 w-5 text-blue-500" /> Alertas no
                Telegram e Email
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <QrCode className="h-5 w-5 text-blue-500" /> Retirada rápida com
                código
              </div>
            </div>

            {/* UI Mockup - Resident Mobile */}
            <div className="relative h-72 w-full rounded-xl overflow-hidden border border-white/10 bg-gradient-to-b from-[#151515] to-[#0A0A0A] flex items-center justify-center p-4">
              {/* Mobile Phone shape */}
              <div className="w-[160px] h-[120%] bg-black border-[4px] border-white/10 rounded-[28px] flex flex-col overflow-hidden relative shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                <div className="absolute top-0 inset-x-0 h-4 bg-black flex justify-center z-20">
                  <div className="w-12 h-3 bg-[#111] rounded-b-xl border-b border-x border-white/5"></div>
                </div>
                <div className="flex-1 bg-[#0A0A0A] p-3 flex flex-col gap-3 pt-6 relative z-10">
                  {/* App header */}
                  <div className="flex items-center justify-between pb-2 border-b border-white/10">
                    <div className="h-2 w-16 bg-white/20 rounded"></div>
                    <div className="w-4 h-4 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <UserCircle className="w-2.5 h-2.5 text-blue-400" />
                    </div>
                  </div>
                  {/* Notification bubble */}
                  <div className="p-2.5 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-start gap-2 shadow-[0_0_15px_rgba(59,130,246,0.1)] relative">
                    <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-blue-500 animate-ping"></div>
                    <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-blue-500"></div>
                    <BellRing className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                    <div className="flex flex-col gap-1">
                      <div className="h-1.5 w-16 bg-blue-400 rounded"></div>
                      <div className="h-1.5 w-10 bg-blue-400/50 rounded"></div>
                    </div>
                  </div>
                  {/* QR Code placeholder */}
                  <div className="mt-auto bg-white p-3 rounded-lg flex items-center justify-center relative shadow-lg">
                    <QrCode className="w-12 h-12 text-black" />
                    {/* Fake Scan Line */}
                    <div className="absolute inset-0 overflow-hidden rounded-lg">
                      <div className="w-full h-0.5 bg-blue-500/50 shadow-[0_0_8px_#3b82f6] absolute top-1/2 -translate-y-1/2"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
