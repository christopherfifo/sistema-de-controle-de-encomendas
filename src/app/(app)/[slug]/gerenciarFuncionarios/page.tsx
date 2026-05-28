import { db } from "@/lib/prisma";
import { validateAndGetCondominioData } from "@/data/get-data-by-slug";
import { PerfilUsuario } from "@prisma/client";
import { redirect } from "next/navigation";
import { GerenciarFuncionariosContent } from "../components/gerenciarFuncionariosContent";
import { SimpleSidebar } from "../components/sidebar";

export default async function GerenciarFuncionariosPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ user?: string }>;
}) {
  const { slug } = await params;
  const { user: sindicoId } = await searchParams;

  if (!sindicoId) redirect("/login");

  const data = await validateAndGetCondominioData(slug, sindicoId);
  if (data.user.perfil !== PerfilUsuario.SINDICO) {
    redirect(`/${slug}?user=${sindicoId}&perfil=${data.user.perfil}`);
  }

  const porteiros = await db.usuario.findMany({
    where: { id_condominio: data.condominio.id_condominio, perfil: PerfilUsuario.PORTEIRO },
    select: {
      id_usuario: true,
      nome_completo: true,
      email: true,
      cpf: true,
      telefone: true,
      ativo: true,
      token_acesso: true, 
      unidades_residenciais: { include: { unidade: true } }
    },
    orderBy: { nome_completo: "asc" },
  });

  const moradores = await db.usuario.findMany({
    where: { id_condominio: data.condominio.id_condominio, perfil: PerfilUsuario.MORADOR },
    select: { id_usuario: true, nome_completo: true, cpf: true, email: true },
    orderBy: { nome_completo: "asc" }
  });

  const unidades = await db.unidade.findMany({
    where: { id_condominio: data.condominio.id_condominio },
    orderBy: [{ bloco_torre: "asc" }, { numero_unidade: "asc" }]
  });

  const sidebarProps = {
    condominioId: slug,
    userId: sindicoId,
    perfil: data.user.perfil,
    userName: data.user.nome_completo,
    condominioName: data.condominio.nome_condominio,
  };

  return (
    <div className="flex min-h-screen">
      <div className="hidden md:block"><SimpleSidebar {...sidebarProps} /></div>
      <main className="flex-1 p-4 md:p-8">
        <GerenciarFuncionariosContent
          porteiros={porteiros}
          moradores={moradores}
          unidades={unidades}
          condominioId={data.condominio.id_condominio}
          sindicoId={sindicoId}
          nomeCondominio={data.condominio.nome_condominio}
        />
      </main>
    </div>
  );
}