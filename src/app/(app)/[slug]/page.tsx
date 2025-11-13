import { validateAndGetCondominioData } from "@/data/get-data-by-slug";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { SimpleSidebar } from "./components/sidebar";
import { db } from "@/lib/prisma";
import { HomePageSaasContent } from "./pages/homePageSaas";
import { PerfilUsuario, StatusEncomenda } from "@prisma/client";
import { PorteiroDashboard } from "./components/porteiroDashboard";

interface SlugPageProps {
  params: { slug: string };
  searchParams: {
    user?: string;
    perfil?: PerfilUsuario;
  };
}

async function getMoradorData(userIds: string[], slug: string) {
  const unitIds = (
    await db.moradoresUnidades.findMany({
      where: { id_usuario: { in: userIds } },
      select: { id_unidade: true },
    })
  ).map((u) => u.id_unidade);

  if (unitIds.length === 0) {
    return { encomendasPendentes: [] };
  }

  const encomendasPendentes = await db.encomenda.findMany({
    where: {
      id_unidade: { in: unitIds },
      status: StatusEncomenda.PENDENTE,
      unidade: {
        id_condominio: slug,
      },
    },
    include: {
      unidade: {
        select: {
          bloco_torre: true,
          numero_unidade: true,
        },
      },
    },
    orderBy: {
      id_encomenda: "desc",
    },
  });
  return { encomendasPendentes };
}

async function getPorteiroData(condominioId: string) {
  const encomendasPendentes = await db.encomenda.findMany({
    where: {
      status: StatusEncomenda.PENDENTE,
      unidade: {
        id_condominio: condominioId,
      },
    },
    include: {
      unidade: {
        select: {
          bloco_torre: true,
          numero_unidade: true,
        },
      },
    },
    orderBy: {
      id_encomenda: "desc",
    },
  });

  const todasUnidades = await db.unidade.findMany({
    where: {
      id_condominio: condominioId,
    },
    select: {
      id_unidade: true,
      bloco_torre: true,
      numero_unidade: true,
    },
    orderBy: [
      { bloco_torre: "asc" },
      { numero_unidade: "asc" }
    ],
  });

  return { encomendasPendentes, todasUnidades };
}

export default async function SlugPage({
  params,
  searchParams = {},
}: SlugPageProps) {
  const { slug } = params;
  const { user: userId, perfil } = searchParams;

  const data = await validateAndGetCondominioData(slug, userId);
  const userName = data.user.nome_completo || "Usuário";
  const condominioName = data.condominio.nome_condominio;

  const sidebarProps = {
    condominioId: slug,
    userId: userId,
    perfil: perfil,
    userName: userName,
    condominioName: condominioName,
  };

  let pageContent = null;
  let pageTitle = "Dashboard";

  switch (perfil) {
    case PerfilUsuario.MORADOR:
      const { encomendasPendentes } = await getMoradorData([userId!], slug);
      pageContent = (
        <HomePageSaasContent
          informationsOfUserAndCondominio={data}
          slug={slug}
          user={userId}
          perfil={perfil}
          encomendasPendentes={encomendasPendentes}
          userId={userId}
        />
      );
      pageTitle = "Minhas Encomendas";
      break;

    case PerfilUsuario.PORTEIRO:
      const { encomendasPendentes: pEncomendas, todasUnidades } = await getPorteiroData(slug);
      pageContent = (
        <PorteiroDashboard
          encomendasPendentes={pEncomendas}
          unidadesDoCondominio={todasUnidades}
          porteiroId={userId!}
          condominioId={slug}
        />
      );
      pageTitle = "Painel da Portaria";
      break;

    case PerfilUsuario.SINDICO:
      pageTitle = "Painel do Síndico";
      break;

    default:
      pageContent = <p>Perfil de usuário não reconhecido.</p>;
  }

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
          <h2 className="text-lg font-semibold ml-4">{pageTitle}</h2>
        </header>

        <div className="p-4 md:p-8 pt-6">
          {pageContent}
        </div>
      </main>
    </div>
  );
}