"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

export function FaturasContent() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Faturas</h2>
        <p className="text-muted-foreground">
          Gerencie e baixe suas faturas mensais.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <CardTitle>Minhas Faturas</CardTitle>
          </div>
          <CardDescription>Acesse o detalhamento das suas cobranças.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Conteúdo de faturas em desenvolvimento.</p>
        </CardContent>
      </Card>
    </div>
  );
}
