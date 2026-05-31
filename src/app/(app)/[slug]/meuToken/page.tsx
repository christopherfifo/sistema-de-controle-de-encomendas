import { validateAndGetCondominioData } from "@/data/get-data-by-slug";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { redirect } from "next/navigation";
import { SimpleSidebar } from "../components/sidebar";
import { PerfilUsuario } from "@prisma/client";
import { TokenUsuarioContent } from "../components/tokenUsuarioContent";

interface TokenPageProps {
  params: Promise<{ slug: string }> | { slug: string };
  searchParams:
    | Promise<{
        user?: string;
        perfil?: PerfilUsuario;
      }>
    | {
        user?: string;
        perfil?: PerfilUsuario;
      };
}

export default async function MeuTokenPage({
  params,
  searchParams,
}: TokenPageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const { slug } = resolvedParams;
  const { user, perfil } = resolvedSearchParams;

  if (!user) redirect("/login");

  const data = await validateAndGetCondominioData(slug, user);
  const userName = data.user.nome_completo || "Usuário";
  const condominioName = data.condominio.nome_condominio;

  const sidebarProps = {
    condominioId: slug,
    userId: user,
    perfil: perfil || data.user.perfil,
    userName: userName,
    condominioName: condominioName,
  };

  const dadosDoUsuario = {
    nome_completo: userName,
    perfil: perfil || data.user.perfil,
    token_acesso: data.user.token_acesso || "SEM-TOKEN",
  };

  return (
    <div className="flex min-h-screen">
      <div className="hidden md:block">
        <SimpleSidebar {...sidebarProps} />
      </div>

      <main className="flex-1 bg-muted/10">
        <header className="flex items-center p-4 border-b md:hidden sticky top-0 bg-background z-10">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Abrir menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col p-0 w-64">
              <SimpleSidebar {...sidebarProps} />
            </SheetContent>
          </Sheet>
          <h2 className="text-lg font-semibold ml-4">{condominioName}</h2>
        </header>

        <div className="p-4 md:p-8 flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] md:min-h-screen">
          <div className="w-full max-w-sm">
            <TokenUsuarioContent usuario={dadosDoUsuario} />
          </div>
        </div>
      </main>
    </div>
  );
}
