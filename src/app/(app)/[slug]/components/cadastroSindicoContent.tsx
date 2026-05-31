"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus } from "lucide-react";

export function CadastroSindicoContent() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Cadastro de Síndico</h2>
        <p className="text-muted-foreground">
          Registre novos síndicos para o condomínio.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-primary" />
            <CardTitle>Novo Síndico</CardTitle>
          </div>
          <CardDescription>Preencha os dados para cadastrar um novo gestor.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Conteúdo de cadastro de síndico em desenvolvimento.</p>
        </CardContent>
      </Card>
    </div>
  );
}
