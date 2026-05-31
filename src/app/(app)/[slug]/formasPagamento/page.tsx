import { validateAndGetCondominioData } from "@/data/get-data-by-slug";
import { PerfilUsuario } from "@prisma/client";
import { redirect } from "next/navigation";
import { SimpleSidebar } from "../components/sidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { FormasPagamentoContent } from "../components/formasPagamentoContent";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ user?: string; perfil?: PerfilUsuario }>;
}

export default async function FormasPagamentoPage({
  params,
  searchParams,
}: PageProps) {
  const { slug } = await params;
  const { user, perfil } = await searchParams;

  if (!user) redirect("/login");

  const data = await validateAndGetCondominioData(slug, user);

  if (data.user.perfil !== PerfilUsuario.ADMINISTRADOR) {
    redirect(`/${slug}?user=${user}&perfil=${data.user.perfil}`);
  }

  const sidebarProps = {
    condominioId: slug,
    userId: user,
    perfil: data.user.perfil,
    userName: data.user.nome_completo,
    condominioName: data.condominio.nome_condominio,
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
          <h2 className="text-lg font-semibold ml-4">
            {data.condominio.nome_condominio}
          </h2>
        </header>

        <div className="p-4 md:p-8">
            <FormasPagamentoContent />
        </div>
      </main>
    </div>
  );
}
