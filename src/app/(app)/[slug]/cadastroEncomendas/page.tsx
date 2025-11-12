
import { validateAndGetCondominioData } from "@/data/get-data-by-slug";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

import { redirect } from "next/navigation";
import { SimpleSidebar } from "../components/sidebar";
import { CadastroEncomendaPageContent } from "../pages/cadastroEncomendaPage";

interface SlugPageProps {
  params: { slug: string };
  searchParams: {
    user?: string;
    perfil?: string;
  };
}

export default async function CadastrarPage({
  params,
  searchParams = {},
}: SlugPageProps) {
  const { slug } = params;
  const { user, perfil } = searchParams;

  const data = await validateAndGetCondominioData(slug, user);
  const userName = data.user.nome_completo || "Usuário";
  const condominioName = data.condominio.nome_condominio;

  const unidadesDoMorador = data.user.unidades_residenciais;

  if (!unidadesDoMorador || unidadesDoMorador.length === 0) {
    redirect(`/${slug}?user=${user}&perfil=${perfil}`);
  }

  const sidebarProps = {
    condominioId: slug,
    userId: user,
    perfil: perfil,
    userName: userName,
    condominioName: condominioName,
  };

  return (
    <div className="flex min-h-screen">
      <div className="hidden md:block">
        <SimpleSidebar {...sidebarProps} />
      </div>

      <main className="flex-1">
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

        <div className="p-4 md:p-8 pt-6">
          <CadastroEncomendaPageContent
            unidadesDoMorador={unidadesDoMorador}
            userId={user!}
            condominioSlug={slug}
          />
        </div>
      </main>
    </div>
  );
}
