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
import { LoginForm } from "./loginForm";
import { ThemeToggle } from "@/components/theme-toggle";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/40 p-4 relative">
      <div className="absolute top-4 right-4">
        <ThemeToggle variant="ghost" />
      </div>
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Login</CardTitle>
          <CardDescription>
            Acesse sua conta para gerenciar as encomendas.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <LoginForm />
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <p className="text-center text-sm">Não tem uma conta? Cadastre-se</p>

          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1 border-solid outline-black"
              asChild
            >
              <Link href="/cadastroMorador">Morador</Link>
            </Button>
            <Button
              variant="outline"
              className="flex-1 border-solid outline-black"
              asChild
            >
              <Link href="/cadastro">Empresa</Link>
            </Button>
          </div>
          <Button variant="link" size="sm" asChild>
            <Link href="/">Voltar para a Home</Link>
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}
