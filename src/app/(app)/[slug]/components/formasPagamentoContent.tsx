"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Banknote } from "lucide-react";

export function FormasPagamentoContent() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Formas de Pagamento</h2>
        <p className="text-muted-foreground">
          Gerencie seus cartões e outras formas de pagamento.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Banknote className="h-5 w-5 text-primary" />
            <CardTitle>Métodos Salvos</CardTitle>
          </div>
          <CardDescription>Adicione ou remova formas de pagamento.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Conteúdo de formas de pagamento em desenvolvimento.</p>
        </CardContent>
      </Card>
    </div>
  );
}
