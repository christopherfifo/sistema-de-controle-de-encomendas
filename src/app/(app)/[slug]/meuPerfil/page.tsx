import { validateAndGetCondominioData } from "@/data/get-data-by-slug";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { redirect } from "next/navigation";
import { SimpleSidebar } from "../components/sidebar";
import { PerfilUsuario } from "@prisma/client";
import { MeuPerfilContent } from "../components/meuPerfilContent";

interface PerfilPageProps {
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

export default async function MeuPerfilPage({
  params,
  searchParams,
}: PerfilPageProps) {
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
    id_usuario: data.user.id_usuario,
    nome_completo: data.user.nome_completo,
    cpf: data.user.cpf,
    email: data.user.email,
    telefone: data.user.telefone,
    telegram_chat_id: data.user.telegram_chat_id,
  };

  return (
    <div className="flex min-h-screen">
      <div className="hidden md:block">
        <SimpleSidebar {...sidebarProps} />
      </div>

      <main className="flex-1 bg-muted/10 min-w-0 overflow-x-hidden">
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
          <h2 className="text-lg font-semibold ml-4 truncate">{condominioName}</h2>
        </header>

        <div className="p-4 md:p-8 flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] md:min-h-screen">
          <MeuPerfilContent user={dadosDoUsuario} />
        </div>
      </main>
    </div>
  );
}
