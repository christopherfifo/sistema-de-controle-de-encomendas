import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Layers } from "lucide-react";

const PlansSummary = () => {
  return (
    <section id="planos" className="bg-muted/30 py-24 border-b">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 mb-6">
              <Layers className="h-4 h-4 text-emerald-500" />
              <span className="text-xs font-semibold text-emerald-500 tracking-wider">
                FLEXIBILIDADE PARA VOCÊ
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              O plano certo para o tamanho do seu condomínio
            </h2>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Seja para um pequeno prédio ou um grande complexo com múltiplas torres, 
              temos a solução ideal. Nossos planos são escaláveis e se adaptam 
              perfeitamente à sua necessidade de gestão.
            </p>
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-10">
              <div className="flex items-center gap-2 text-sm text-foreground/80">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                Gestão Ilimitada
              </div>
              <div className="flex items-center gap-2 text-sm text-foreground/80">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                Suporte Especializado
              </div>
              <div className="flex items-center gap-2 text-sm text-foreground/80">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                Escalabilidade
              </div>
            </div>
            <Button
              asChild
              size="lg"
              className="bg-emerald-500 text-emerald-950 hover:bg-emerald-600 rounded-md px-8 text-base font-semibold transition-all shadow-[0_0_20px_rgba(16,185,129,0.15)]"
            >
              <Link href="/planos">
                Ver Todos os Planos <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="flex-1 w-full max-w-md lg:max-w-none">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 bg-background border border-border rounded-2xl shadow-sm hover:border-emerald-500/30 transition-colors">
                <div className="h-10 w-10 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4">
                  <div className="h-5 w-5 rounded-full border-2 border-blue-500"></div>
                </div>
                <h4 className="font-bold text-foreground mb-1">Light</h4>
                <p className="text-xs text-muted-foreground">Para pequenos prédios</p>
              </div>
              <div className="p-6 bg-background border border-border rounded-2xl shadow-sm hover:border-emerald-500/30 transition-colors">
                <div className="h-10 w-10 bg-yellow-500/10 rounded-lg flex items-center justify-center mb-4">
                   <div className="h-5 w-5 rounded-sm border-2 border-yellow-500"></div>
                </div>
                <h4 className="font-bold text-foreground mb-1">Profissional</h4>
                <p className="text-xs text-muted-foreground">Médio porte</p>
              </div>
              <div className="p-6 bg-background border border-border rounded-2xl shadow-sm hover:border-emerald-500/30 transition-colors">
                <div className="h-10 w-10 bg-purple-500/10 rounded-lg flex items-center justify-center mb-4">
                   <div className="grid grid-cols-2 gap-0.5">
                     <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                     <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                     <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                     <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                   </div>
                </div>
                <h4 className="font-bold text-foreground mb-1">Premium</h4>
                <p className="text-xs text-muted-foreground">Grandes condomínios</p>
              </div>
              <div className="p-6 bg-background border border-border rounded-2xl shadow-sm hover:border-emerald-500/30 transition-colors">
                <div className="h-10 w-10 bg-orange-500/10 rounded-lg flex items-center justify-center mb-4">
                   <div className="w-5 h-5 border-2 border-orange-500 rotate-45"></div>
                </div>
                <h4 className="font-bold text-foreground mb-1">Enterprise</h4>
                <p className="text-xs text-muted-foreground">Complexos de luxo</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlansSummary;
