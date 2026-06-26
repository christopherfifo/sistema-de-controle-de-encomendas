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
    <section id="sobre" className="bg-background py-24 border-b">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="mb-16 text-center lg:text-left">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Desenhado para o ecossistema do condomínio
          </h2>
          <p className="text-muted-foreground max-w-2xl text-lg mx-auto lg:mx-0">
            O CondoDrop atende às necessidades específicas de quem gerencia o
            prédio e de quem mora nele. Uma plataforma única para conectar a
            portaria à sua casa.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="bg-muted/30 border border-border rounded-2xl p-8 lg:p-10 hover:border-emerald-500/20 transition-colors flex flex-col h-full">
            <div className="h-12 w-12 bg-emerald-500/10 rounded-lg flex items-center justify-center mb-6">
              <Building2 className="h-6 w-6 text-emerald-500" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Para a Administração
            </h3>
            <p className="text-muted-foreground mb-8 flex-1">
              Tenha controle absoluto sobre a entrada e saída de pacotes. Reduza
              filas na portaria, evite extravios e tenha um histórico auditável
              de cada entrega.
            </p>
            <div className="space-y-4 mb-10">
              <div className="flex items-center gap-3 text-sm text-foreground/80">
                <ShieldCheck className="h-5 w-5 text-emerald-500" /> Histórico
                100% auditável
              </div>
              <div className="flex items-center gap-3 text-sm text-foreground/80">
                <UserCircle className="h-5 w-5 text-emerald-500" /> Gestão de
                moradores e porteiros
              </div>
            </div>

            <div className="relative h-72 w-full rounded-xl overflow-hidden border border-border bg-background flex flex-col shadow-inner">
              <div className="h-8 bg-muted/50 border-b border-border flex items-center px-4 gap-2">
                <div className="w-2 h-2 rounded-full bg-border"></div>
                <div className="w-2 h-2 rounded-full bg-border"></div>
                <div className="w-2 h-2 rounded-full bg-border"></div>
              </div>
              <div className="flex-1 p-4 grid grid-cols-2 gap-3">
                <div className="bg-emerald-500/5 rounded-lg p-3 border border-emerald-500/10 flex flex-col justify-between">
                  <Package className="w-5 h-5 text-emerald-500 mb-2" />
                  <div>
                    <div className="text-2xl font-bold text-foreground">124</div>
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">
                      Pacotes Entregues
                    </div>
                  </div>
                </div>
                <div className="bg-yellow-500/5 rounded-lg p-3 border border-yellow-500/10 flex flex-col justify-between">
                  <Clock className="w-5 h-5 text-yellow-500 mb-2" />
                  <div>
                    <div className="text-2xl font-bold text-foreground">12</div>
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">
                      Aguardando
                    </div>
                  </div>
                </div>
                <div className="col-span-2 bg-muted/50 rounded-lg p-3 border border-border flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center border">
                      <UserCircle className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="text-xs text-foreground font-medium mb-0.5">
                        Carlos (Porteiro)
                      </div>
                      <div className="text-[10px] text-emerald-500">
                        Online agora
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-muted/30 border border-border rounded-2xl p-8 lg:p-10 hover:border-blue-500/20 transition-colors flex flex-col h-full">
            <div className="h-12 w-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-6">
              <UserCircle className="h-6 w-6 text-blue-500" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Para os Moradores
            </h3>
            <p className="text-muted-foreground mb-8 flex-1">
              Acompanhe suas encomendas em tempo real. Saiba exatamente quando
              seu pacote chegou e agilize a retirada na portaria com segurança.
            </p>
            <div className="space-y-4 mb-10">
              <div className="flex items-center gap-3 text-sm text-foreground/80">
                <BellRing className="h-5 w-5 text-blue-500" /> Alertas no
                Telegram e Email
              </div>
              <div className="flex items-center gap-3 text-sm text-foreground/80">
                <QrCode className="h-5 w-5 text-blue-500" /> Retirada rápida com
                código
              </div>
            </div>

            <div className="relative h-72 w-full rounded-xl overflow-hidden border border-border bg-gradient-to-b from-muted to-background flex items-center justify-center p-4">
              <div className="w-[160px] h-[120%] bg-foreground border-[4px] border-border rounded-[28px] flex flex-col overflow-hidden relative shadow-2xl">
                <div className="absolute top-0 inset-x-0 h-4 bg-foreground flex justify-center z-20">
                  <div className="w-12 h-3 bg-background/20 rounded-b-xl border-b border-x border-border/10"></div>
                </div>
                <div className="flex-1 bg-background p-3 flex flex-col gap-3 pt-6 relative z-10">
                  <div className="flex items-center justify-between pb-2 border-b">
                    <div className="h-2 w-16 bg-muted rounded"></div>
                    <div className="w-4 h-4 rounded-full bg-blue-500/10 flex items-center justify-center border">
                      <UserCircle className="w-2.5 h-2.5 text-blue-500" />
                    </div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-blue-500/5 border border-blue-500/10 flex items-start gap-2 relative">
                    <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-blue-500 animate-ping"></div>
                    <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-blue-500"></div>
                    <BellRing className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                    <div className="flex flex-col gap-1">
                      <div className="h-1.5 w-16 bg-blue-500 rounded"></div>
                      <div className="h-1.5 w-10 bg-blue-500/50 rounded"></div>
                    </div>
                  </div>
                  <div className="mt-auto bg-card p-3 rounded-lg flex items-center justify-center relative shadow-sm border">
                    <QrCode className="w-12 h-12 text-foreground" />
                    <div className="absolute inset-0 overflow-hidden rounded-lg">
                      <div className="w-full h-0.5 bg-blue-500/30 shadow-[0_0_8px_#3b82f6] absolute top-1/2 -translate-y-1/2"></div>
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
