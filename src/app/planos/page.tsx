import { getPlanos } from "./actionPlanos";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CheckCircle2,
  Home,
  Building,
  Building2,
  Crown,
  Mail,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SyncPlanosClient } from "./SyncPlanosClient";

const infoPlanos: Record<
  string,
  { descricao: string; icone: React.ElementType; cor: string; suporte: boolean }
> = {
  "Plano Light": {
    descricao: "Ideal para pequenos prédios e condomínios de poucas casas.",
    icone: Home,
    cor: "text-blue-500",
    suporte: false,
  },
  "Plano Profissional": {
    descricao: "A solução completa para condomínios de médio porte.",
    icone: Building,
    cor: "text-yellow-500",
    suporte: false,
  },
  "Plano Premium": {
    descricao:
      "Gestão robusta para grandes condomínios com várias torres, com Suporte Prioritário.",
    icone: Building2,
    cor: "text-purple-500",
    suporte: true,
  },
  "Plano Enterprise": {
    descricao:
      "Poder total para grandes complexos e gestores de larga escala, com Suporte Prioritário.",
    icone: Crown,
    cor: "text-orange-500",
    suporte: true,
  },
};

export default async function PlanosPage() {
  const planos = await getPlanos();
  const maxUnits =
    planos.length > 0 ? Math.max(...planos.map((p) => p.limite_unidades)) : 800;

  return (
    <div className="container mx-auto py-16 px-4 relative">
      <div className="absolute top-6 left-4 lg:left-0">
        <Button
          variant="ghost"
          asChild
          className="gap-2 hover:bg-primary/5 text-muted-foreground hover:text-primary transition-colors"
        >
          <Link href="/">
            <ArrowLeft className="w-4 h-4" />
            Voltar para Home
          </Link>
        </Button>
      </div>

      <SyncPlanosClient />
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-6xl mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Planos e Preços
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Encontre o plano perfeito para o seu condomínio.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-[90rem] mx-auto">
        {planos.map((plano) => {
          const info = infoPlanos[plano.nome_plano] || {
            descricao: "O plano perfeito para as suas necessidades.",
            icone: Building,
            cor: "text-primary",
            suporte: false,
          };
          const Icone = info.icone;

          return (
            <Card
              key={plano.id_plano}
              className="group flex flex-col h-full border-2 border-muted hover:border-primary/50 transition-all duration-300 hover:shadow-xl"
            >
              <CardHeader className="text-center pb-2">
                <div
                  className={`mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4 ${info.cor}`}
                >
                  <Icone className="w-6 h-6" />
                </div>
                <CardTitle className="text-xl font-bold">
                  {plano.nome_plano}
                </CardTitle>
                <CardDescription className="pt-4 h-24 flex items-center justify-center text-xs">
                  {info.descricao}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="text-center mb-8">
                  <div className="flex items-center justify-center">
                    <span className="text-xs font-semibold text-muted-foreground self-start mt-2 mr-1">
                      R$
                    </span>
                    <span className="text-4xl font-extrabold tracking-tight">
                      {Number(plano.valor).toFixed(2).replace(".", ",")}
                    </span>
                    <span className="text-muted-foreground ml-1 self-end mb-2 text-xs">
                      /mês
                    </span>
                  </div>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm font-medium">
                      Até {plano.limite_unidades} Unidades (Aptos)
                    </span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm font-medium">
                      {plano.nome_plano === "Plano Light"
                        ? "Até 5 Administradores"
                        : "Administradores Ilimitados"}
                    </span>
                  </li>
                  <li className="flex items-center gap-3 border-t pt-3">
                    <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                    <span className="text-xs">Gestão de Encomendas</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                    <span className="text-xs">Notificações via Telegram</span>
                  </li>
                  {info.suporte && (
                    <li className="flex items-center gap-3">
                      <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                      <span className="text-xs">Suporte Prioritário</span>
                    </li>
                  )}
                </ul>
              </CardContent>
              <CardFooter className="pt-6">
                <Button
                  asChild
                  className="w-full h-10 text-sm font-semibold shadow-sm hover:shadow-md transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground"
                  variant="outline"
                >
                  <Link href={`/cadastro?planoId=${plano.id_plano}`}>
                    Assinar Agora
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      <div className="mt-16 text-center max-w-2xl mx-auto">
        <p className="text-muted-foreground mb-4">
          Possui um condomínio com mais de {maxUnits} unidades ou necessidades
          específicas?
        </p>
        <a
          href={`mailto:contato@condodrop.com.br?subject=Orçamento de Plano Personalizado&body=Olá, gostaria de um orçamento para um condomínio com mais de ${maxUnits} unidades.`}
          className="text-primary font-semibold hover:underline inline-flex items-center gap-2"
        >
          <Mail className="w-5 h-5" />
          Fale conosco para um orçamento personalizado
        </a>
      </div>
    </div>
  );
}
