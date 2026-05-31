import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CadastroSaaSForm } from "./components/cadastroSaaSForm";
import { ThemeToggle } from "@/components/theme-toggle";

import { Suspense } from "react";

export default function CadastroPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/40 p-4 py-8 relative">
      <div className="absolute top-4 right-4">
        <ThemeToggle variant="ghost" />
      </div>
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Crie sua Conta</CardTitle>
          <CardDescription>
            Cadastre seu condomínio para começar a usar o sistema.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Suspense
            fallback={
              <div className="flex items-center justify-center py-8">
                Carregando formulário...
              </div>
            }
          >
            <CadastroSaaSForm />
          </Suspense>
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <Button variant="outline" className="w-full" asChild>
            <Link href="/login">Já tem uma conta? Faça Login</Link>
          </Button>
          <Button variant="link" className="w-full text-sm" asChild>
            <Link href="/">Voltar para a Home</Link>
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}
