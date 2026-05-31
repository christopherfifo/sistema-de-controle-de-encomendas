"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpCircle } from "lucide-react";

export function UpgradeContent() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Upgrade</h2>
        <p className="text-muted-foreground">
          Aumente os limites do seu plano atual.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <ArrowUpCircle className="h-5 w-5 text-primary" />
            <CardTitle>Opções de Upgrade</CardTitle>
          </div>
          <CardDescription>Escolha um plano superior para mais recursos.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Conteúdo de upgrade em desenvolvimento.</p>
        </CardContent>
      </Card>
    </div>
  );
}
