import { validateAndGetCondominioData } from "@/data/get-data-by-slug";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { redirect } from "next/navigation";

import { SimpleSidebar } from "../../[slug]/components/sidebar";
import { db } from "@/lib/prisma";
import { PerfilUsuario, Prisma, StatusEncomenda } from "@prisma/client";
import { HistoricoPorteiroPageContent } from "../../[slug]/pages/historicoPorteiroPage";
import { Encomenda, Unidade, Usuario, Retirada } from "@prisma/client";

interface SlugPageProps {
  params: { slug: string };
  searchParams: {
    user?: string;
    perfil?: PerfilUsuario;
  };
}

type EncomendaComDetalhes = Encomenda & {
  unidade: Pick<Unidade, "bloco_torre" | "numero_unidade">;
  retirada:
    | (Retirada & {
        usuario_retirada: Pick<Usuario, "id_usuario" | "nome_completo">;
      })
    | null;
  porteiro_recebimento: Pick<Usuario, "id_usuario" | "nome_completo"> | null;
};

async function getHistoricoPorteiro(
  slug: string,
  userId: string,
): Promise<EncomendaComDetalhes[]> {
  const encomendas = await db.encomenda.findMany({
    where: {
      unidade: {
        id_condominio: slug,
      },
      status: {
        in: [StatusEncomenda.ENTREGUE, StatusEncomenda.CANCELADA],
      },
    },
    include: {
      unidade: {
        select: {
          bloco_torre: true,
          numero_unidade: true,
        },
      },
      retirada: {
        include: {
          usuario_retirada: {
            select: {
              id_usuario: true,
              nome_completo: true,
            },
          },
        },
      },
      porteiro_recebimento: {
        select: {
          id_usuario: true,
          nome_completo: true,
        },
      },
    },

    orderBy: {
      data_recebimento: "desc",
    },
  });

  return encomendas as EncomendaComDetalhes[];
}

export default async function HistoricoPorteiroPage({
  params,
  searchParams = {},
}: SlugPageProps) {
  const { slug } = params;
  const { user, perfil } = searchParams;

  const data = await validateAndGetCondominioData(slug, user);
  const userName = data.user.nome_completo || "Usuário";
  const condominioName = data.condominio.nome_condominio;

  if (data.user.perfil !== PerfilUsuario.PORTEIRO) {
    redirect(`/${slug}?user=${user}&perfil=${data.user.perfil}`);
  }

  const encomendasDoHistorico = await getHistoricoPorteiro(slug, user!);

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
          <h2 className="text-lg font-semibold ml-4">Histórico da Portaria</h2>
        </header>

        <section className="p-4 md:p-6 space-y-6">
          <HistoricoPorteiroPageContent
            encomendasDoHistorico={encomendasDoHistorico}
            condominioName={condominioName}
            porteiroId={user!}
          />
        </section>
      </main>
    </div>
  );
}
