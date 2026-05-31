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
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { ResetarSenhaForm } from "./components/resetarSenhaForm";

export default function ResetarSenhaPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/40 p-4 py-8">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Redefinir Senha</CardTitle>
          <CardDescription>Crie uma nova senha para sua conta.</CardDescription>
        </CardHeader>

        <CardContent>
          <Suspense
            fallback={
              <div className="flex justify-center p-4">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            }
          >
            <ResetarSenhaForm />
          </Suspense>
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <Button variant="outline" className="w-full" asChild>
            <Link href="/login">Voltar para o Login</Link>
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}
