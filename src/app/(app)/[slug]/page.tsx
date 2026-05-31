import { validateAndGetCondominioData } from "@/data/get-data-by-slug";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { SimpleSidebar } from "./components/sidebar";
import { db } from "@/lib/prisma";
import { HomePageSaasContent } from "./pages/homePageSaas";
import { PerfilUsuario, StatusEncomenda } from "@prisma/client";
import { PorteiroDashboard } from "./components/porteiroDashboard";

import { getSindicoData } from "./helpers/actionSindico";
import { SindicoDashboard } from "./pages/sindicoDashboard";

interface SlugPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    user?: string;
    perfil?: PerfilUsuario;
  }>;
}

async function getMoradorData(unitIds: string[], idCondominio: string) {
  if (unitIds.length === 0) {
    return { encomendasPendentes: [] };
  }

  const encomendasPendentes = await db.encomenda.findMany({
    where: {
      id_unidade: { in: unitIds },
      status: StatusEncomenda.PENDENTE,
      unidade: {
        id_condominio: idCondominio,
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
      data_recebimento: "desc",
    },
  });

  return { encomendasPendentes };
}

async function getPorteiroData(idCondominio: string) {
  const encomendasPendentes = await db.encomenda.findMany({
    where: {
      status: StatusEncomenda.PENDENTE,
      unidade: {
        id_condominio: idCondominio,
      },
    },
    include: {
      usuario_cadastro: {
        select: { nome_completo: true },
      },
      unidade: {
        select: {
          bloco_torre: true,
          numero_unidade: true,
          moradores: {
            include: {
              usuario: {
                select: {
                  id_usuario: true,
                  nome_completo: true,
                },
              },
            },
          },
        },
      },
    },
    orderBy: {
      id_encomenda: "desc",
    },
  });

  const todasUnidades = await db.unidade.findMany({
    where: {
      id_condominio: idCondominio,
    },
    select: {
      id_unidade: true,
      bloco_torre: true,
      numero_unidade: true,
    },
    orderBy: [{ bloco_torre: "asc" }, { numero_unidade: "asc" }],
  });

  return { encomendasPendentes, todasUnidades };
}

export default async function SlugPage({
  params,
  searchParams,
}: SlugPageProps) {
  const { slug } = await params;
  const { user: userId, perfil } = await searchParams;

  const data = await validateAndGetCondominioData(slug, userId);
  const userName = data.user.nome_completo || "Usuário";
  const condominioName = data.condominio.nome_condominio;
  const idCondominioReal = data.condominio.id_condominio;

  let pageContent: React.ReactNode = (
    <p>Bem-vindo ao Painel. Selecione uma opção no menu.</p>
  );
  let pageTitle = "Painel";

  switch (perfil) {
    case PerfilUsuario.MORADOR:
      const userUnitIds = data.user.unidades_residenciais.map(
        (u) => u.unidade.id_unidade,
      );

      const { encomendasPendentes: mEncomendas } = await getMoradorData(
        userUnitIds,
        idCondominioReal,
      );

      pageContent = (
        <HomePageSaasContent
          informationsOfUserAndCondominio={data}
          slug={slug}
          user={userId}
          perfil={perfil}
          encomendasPendentes={mEncomendas}
          userId={userId}
        />
      );
      pageTitle = "Minhas Encomendas";
      break;

    case PerfilUsuario.PORTEIRO:
      const { encomendasPendentes: pEncomendas, todasUnidades } =
        await getPorteiroData(idCondominioReal);

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
      const sindicoData = await getSindicoData(idCondominioReal);
      pageContent = (
        <SindicoDashboard
          condominioData={{ ...sindicoData, id_condominio: idCondominioReal }}
          sindicoId={userId!}
        />
      );
      pageTitle = "Configuração do Condomínio";
      break;

    default:
      pageContent = <p>Perfil de usuário não reconhecido.</p>;
  }

  const sidebarProps = {
    condominioId: slug,
    userId: userId,
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
              <div className="sr-only">
                <SheetTitle>Menu de Navegação</SheetTitle>
                <SheetDescription>Abra as ferramentas e configurações do condomínio</SheetDescription>
              </div>

              <SimpleSidebar {...sidebarProps} />
            </SheetContent>
          </Sheet>
          <h2 className="text-lg font-semibold ml-4">{pageTitle}</h2>
        </header>

        <section className="p-4 md:p-6 space-y-6">{pageContent}</section>
      </main>
    </div>
  );
}