import { validateAndGetCondominioData } from "@/data/get-data-by-slug";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { redirect } from "next/navigation";

import { SimpleSidebar } from "../components/sidebar"; 
import { PerfilUsuario } from "@prisma/client";
import { VincularTelegramContent } from "../components/vincularTelegramContent";


interface TelegramPageProps {
  params: { slug: string };
  searchParams: {
    user?: string;
    perfil?: PerfilUsuario;
  };
}

export default async function TelegramConfigPage({
  params,
  searchParams = {},
}: TelegramPageProps) {
  const { slug } = await params;
  const { user, perfil } = await searchParams;

  const data = await validateAndGetCondominioData(slug, user);
  const userName = data.user.nome_completo || "Usuário";
  const condominioName = data.condominio.nome_condominio;

  if (!user) {
    redirect(`/${slug}`);
  }

  const sidebarProps = {
    condominioId: slug,
    userId: user,
    perfil: data.user.perfil,
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
          <h2 className="text-lg font-semibold ml-4">Notificações por Telegram</h2>
        </header>

        <section className="p-4 md:p-6 space-y-6">
          <h1 className="text-2xl font-bold tracking-tight hidden md:block">Ajustes do Perfil</h1>
          <hr className="hidden md:block border-muted" />
          
          <VincularTelegramContent
            userId={user as string}
          />
        </section>
      </main>
    </div>
  );
}