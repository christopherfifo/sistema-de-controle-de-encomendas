import { validateAndGetCondominioData } from "@/data/get-data-by-slug";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { redirect } from "next/navigation";
import { SimpleSidebar } from "../components/sidebar";
import { PerfilUsuario } from "@prisma/client";
import { 
  GerenciarCadastroMoradoresContent, 
  GerenciarCadastroMoradoresContentProps 
} from "../components/gerenciarCadastroMoradoresContent";
import { db } from "@/lib/prisma";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ user?: string; perfil?: PerfilUsuario }>;
}

export default async function GestaoMoradoresPage({
  params,
  searchParams,
}: PageProps) {
  const { slug } = await params;
  const { user, perfil } = await searchParams;

  if (!user) redirect("/login");

  const data = await validateAndGetCondominioData(slug, user);

  if (data.user.perfil !== PerfilUsuario.SINDICO && data.user.perfil !== PerfilUsuario.ADMINISTRADOR) {
    redirect(`/${slug}?user=${user}`);
  }

  const moradores = await db.usuario.findMany({
    where: {
      id_condominio: slug,
      perfil: PerfilUsuario.MORADOR,
    },
    select: {
      id_usuario: true,
      nome_completo: true,
      cpf: true,
      email: true,
      telefone: true,
      ativo: true,
      data_criacao: true,
      unidades_residenciais: {
        select: {
          principal: true,
          unidade: {
            select: {
              id_unidade: true,
              bloco_torre: true,
              numero_unidade: true,
              moradores: {
                select: {
                  principal: true,
                  usuario: {
                    select: {
                      id_usuario: true,
                      nome_completo: true,
                      cpf: true,
                      telefone: true,
                    }
                  }
                }
              }
            },
          },
        },
      },
    },
    orderBy: { nome_completo: "asc" },
  });

  const unidades = await db.unidade.findMany({
    where: { id_condominio: slug },
    select: {
      id_unidade: true,
      bloco_torre: true,
      numero_unidade: true,
    },
    orderBy: [{ bloco_torre: "asc" }, { numero_unidade: "asc" }],
  });

  const sidebarProps = {
    condominioId: slug,
    userId: user,
    perfil: perfil || data.user.perfil,
    userName: data.user.nome_completo,
    condominioName: data.condominio.nome_condominio,
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
          <h2 className="text-lg font-semibold ml-4">{data.condominio.nome_condominio}</h2>
        </header>

        <div className="p-4 md:p-8">
          <GerenciarCadastroMoradoresContent 
            moradores={moradores as unknown as GerenciarCadastroMoradoresContentProps["moradores"]} 
            unidades={unidades}
            condominioId={slug}
            sindicoId={user}
          />
        </div>
      </main>
    </div>
  );
}
