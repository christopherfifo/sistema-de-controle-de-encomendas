"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet } from "lucide-react";

export function PagamentosContent() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Pagamentos</h2>
        <p className="text-muted-foreground">
          Histórico de transações e pagamentos realizados.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-primary" />
            <CardTitle>Histórico de Pagamentos</CardTitle>
          </div>
          <CardDescription>Visualize todos os pagamentos efetuados.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Conteúdo de pagamentos em desenvolvimento.</p>
        </CardContent>
      </Card>
    </div>
  );
}
