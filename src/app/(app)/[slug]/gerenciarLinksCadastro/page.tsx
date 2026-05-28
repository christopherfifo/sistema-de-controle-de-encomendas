import { validateAndGetCondominioData } from "@/data/get-data-by-slug";
import { PerfilUsuario } from "@prisma/client";
import { redirect } from "next/navigation";
import { SimpleSidebar } from "../components/sidebar";
import { GerenciarLinksCadastroContent } from "../components/gerenciarLinksCadastroContent";

interface GerenciarLinksCadastroPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ user?: string }>;
}

export default async function GerenciarLinksCadastroPage({
  params,
  searchParams,
}: GerenciarLinksCadastroPageProps) {
  const { slug } = await params;
  const { user: sindicoId } = await searchParams;

  if (!sindicoId) redirect("/login");

  const data = await validateAndGetCondominioData(slug, sindicoId);
  if (data.user.perfil !== PerfilUsuario.SINDICO) {
    redirect(`/${slug}?user=${sindicoId}&perfil=${data.user.perfil}`);
  }

  const condominiosGerenciados = [
    {
      id_condominio: data.condominio.id_condominio,
      nome_condominio: data.condominio.nome_condominio,
      slug: slug,
    }
  ];

  const sidebarProps = {
    condominioId: slug,
    userId: sindicoId,
    perfil: data.user.perfil,
    userName: data.user.nome_completo,
    condominioName: data.condominio.nome_condominio,
  };

  return (
    <div className="flex min-h-screen">
      <div className="hidden md:block">
        <SimpleSidebar {...sidebarProps} />
      </div>

      <main className="flex-1 p-4 md:p-8">
        <GerenciarLinksCadastroContent condominios={condominiosGerenciados} />
      </main>
    </div>
  );
}