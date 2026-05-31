"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, ArrowUpCircle, CheckCircle2 } from "lucide-react";

export function PlanosContent() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Planos & Upgrade</h2>
        <p className="text-muted-foreground">
          Gerencie o plano atual do seu condomínio e explore opções de upgrade.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              <CardTitle>Plano Atual</CardTitle>
            </div>
            <CardDescription>Sua assinatura vigente no momento.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-2xl font-bold text-primary">Plano Profissional</div>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                Até 200 Unidades
              </li>
              <li className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                Suporte 24/7
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <ArrowUpCircle className="h-5 w-5 text-primary" />
              <CardTitle>Disponível para Upgrade</CardTitle>
            </div>
            <CardDescription>Aumente seus limites e recursos.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-2xl font-bold">Plano Premium</div>
            <p className="text-sm text-muted-foreground">
              Ideal para condomínios com mais de 200 unidades e necessidade de gestão avançada.
            </p>
            <button className="w-full bg-primary text-primary-foreground py-2 rounded-md font-medium hover:bg-primary/90 transition-colors">
              Ver Detalhes do Upgrade
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}