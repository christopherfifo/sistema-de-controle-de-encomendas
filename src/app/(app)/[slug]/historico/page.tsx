import { validateAndGetCondominioData } from "@/data/get-data-by-slug";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { db } from "@/lib/prisma";
import { SimpleSidebar } from "../components/sidebar";
import { PerfilUsuario, Prisma, StatusEncomenda } from "@prisma/client";
import { HistoricoPageSassContent } from "../pages/historicoPageSaas";

interface SlugPageProps {
  params: { slug: string };
  searchParams: {
    user?: string;
    perfil?: PerfilUsuario;
  };
}

export default async function HistoricoPage({
  params,
  searchParams = {},
}: SlugPageProps) {
  const { slug } = params;
  const { user, perfil } = searchParams;

  const data = await validateAndGetCondominioData(slug, user);
  const userName = data.user.nome_completo || "Usuário";
  const condominioName = data.condominio.nome_condominio;

  let whereClause: Prisma.EncomendaWhereInput = {
    unidade: {
      id_condominio: slug,
    },
    status: {
      in: [StatusEncomenda.ENTREGUE, StatusEncomenda.CANCELADA],
    },
  };

  if (perfil === PerfilUsuario.MORADOR) {
    const unitIds = data.user.unidades_residenciais.map((u) => u.id_unidade);
    whereClause.id_unidade = {
      in: unitIds,
    };
  }

  const encomendasDoHistorico = await db.encomenda.findMany({
    where: whereClause,
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
      retirada: {
        data_retirada: "desc",
      },
    },
  });

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
          <HistoricoPageSassContent
            encomendasDoHistorico={encomendasDoHistorico}
            condominioName={condominioName}
          />
        </div>
      </main>
    </div>
  );
}
