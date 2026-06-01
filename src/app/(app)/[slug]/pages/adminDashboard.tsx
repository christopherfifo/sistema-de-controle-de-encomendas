"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Package, 
  Home, 
  Building2, 
  Info, 
  UserCheck
} from "lucide-react";

interface EncomendaAdmin {
  id_encomenda: string;
  tipo_encomenda: string;
  data_recebimento: string | Date | null;
  tamanho: string;
  forma_entrega: string;
  codigo_rastreio: string | null;
  condicao: string | null;
  unidade?: {
    bloco_torre: string;
    numero_unidade: string;
  };
  usuario_cadastro?: {
    nome_completo: string;
    telefone: string;
    email: string;
  } | null;
  porteiro_recebimento?: {
    nome_completo: string;
  } | null;
}

interface UnidadeAdmin {
  id_unidade: string;
  bloco_torre: string;
  numero_unidade: string;
  moradores?: {
    principal: boolean;
    usuario?: {
      nome_completo: string;
      email: string;
      telefone: string;
      cpf: string;
    };
  }[];
}

interface FuncionarioAdmin {
  id_usuario: string;
  nome_completo: string;
  email: string;
  telefone: string;
  cpf: string;
  perfil: string;
  data_criacao: string | Date;
  ativo: boolean;
}

interface AdminDashboardProps {
  stats: {
    totalUnidades: number;
    unidadesOcupadas: number;
    totalBlocos: number;
    totalFuncionarios: number;
    totalEncomendasPendentes: number;
  };
  encomendasPendentes: Record<string, unknown>[];
  funcionarios: Record<string, unknown>[];
  unidades: Record<string, unknown>[];
}

export function AdminDashboard({ stats, encomendasPendentes, funcionarios, unidades }: AdminDashboardProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Painel Administrativo</h2>
        <p className="text-muted-foreground">
          Supervisão geral do condomínio e da plataforma.
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="packages">Encomendas ({stats.totalEncomendasPendentes})</TabsTrigger>
          <TabsTrigger value="units">Unidades ({stats.unidadesOcupadas}/{stats.totalUnidades})</TabsTrigger>
          <TabsTrigger value="staff">Equipe ({stats.totalFuncionarios})</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Unidades Ocupadas</CardTitle>
                <Home className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.unidadesOcupadas} / {stats.totalUnidades}</div>
                <p className="text-xs text-muted-foreground">Ocupação atual</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Blocos / Torres</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalBlocos}</div>
                <p className="text-xs text-muted-foreground">Total cadastrado</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Portaria</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalFuncionarios}</div>
                <p className="text-xs text-muted-foreground">Porteiros ativos</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalEncomendasPendentes}</div>
                <p className="text-xs text-muted-foreground">Aguardando retirada</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Informativo</CardTitle>
              <CardDescription>Resumo de atividades recentes e alertas.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <Info className="h-4 w-4 mt-0.5 text-blue-500" />
                <p>O sistema está operando normalmente. Todas as notificações do Telegram estão sendo enviadas.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="packages" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Encomendas Aguardando Retirada</CardTitle>
              <CardDescription>Visualize o que está na portaria no momento.</CardDescription>
            </CardHeader>
            <CardContent>
              {encomendasPendentes.length === 0 ? (
                <p className="text-sm text-muted-foreground">Nenhuma encomenda pendente no momento.</p>
              ) : (
                <div className="relative w-full overflow-auto">
                  <table className="w-full caption-bottom text-sm">
                    <thead className="[&_tr]:border-b">
                      <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                        <th className="h-10 px-2 text-left align-middle font-medium text-muted-foreground">ID / Unidade</th>
                        <th className="h-10 px-2 text-left align-middle font-medium text-muted-foreground">Detalhes</th>
                        <th className="h-10 px-2 text-left align-middle font-medium text-muted-foreground">Destinatário</th>
                        <th className="h-10 px-2 text-left align-middle font-medium text-muted-foreground">Recebimento</th>
                        <th className="h-10 px-2 text-left align-middle font-medium text-muted-foreground">Status</th>
                      </tr>
                    </thead>
                    <tbody className="[&_tr:last-child]:border-0">
                      {encomendasPendentes.map((_enc) => {
                        const enc = _enc as unknown as EncomendaAdmin;
                        return (
                        <tr key={enc.id_encomenda} className="border-b transition-colors hover:bg-muted/50">
                          <td className="p-2 align-middle font-medium">
                            <div className="text-xs text-muted-foreground mb-1" title={enc.id_encomenda}>
                              {enc.id_encomenda.split('-')[0]}...
                            </div>
                            {enc.unidade?.bloco_torre} - {enc.unidade?.numero_unidade}
                          </td>
                          <td className="p-2 align-middle text-xs">
                            <div className="font-semibold uppercase">{enc.tipo_encomenda} ({enc.tamanho})</div>
                            {enc.forma_entrega && <div>Entrega: {enc.forma_entrega}</div>}
                            {enc.codigo_rastreio && <div>Rastreio: {enc.codigo_rastreio}</div>}
                          </td>
                          <td className="p-2 align-middle text-xs">
                            {enc.usuario_cadastro ? (
                              <>
                                <div className="font-semibold">{enc.usuario_cadastro.nome_completo}</div>
                                <div className="text-muted-foreground">{enc.usuario_cadastro.telefone}</div>
                              </>
                            ) : (
                              <span className="text-muted-foreground italic">Não especificado</span>
                            )}
                          </td>
                          <td className="p-2 align-middle text-xs">
                            <div>{enc.data_recebimento ? new Date(enc.data_recebimento).toLocaleString() : ""}</div>
                            {enc.porteiro_recebimento && (
                              <div className="text-muted-foreground mt-1">Por: {enc.porteiro_recebimento.nome_completo}</div>
                            )}
                          </td>
                          <td className="p-2 align-middle">
                            <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-600 border-yellow-200">
                              Pendente
                            </Badge>
                          </td>
                        </tr>
                      )})}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="units" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Relação de Unidades</CardTitle>
              <CardDescription>Informações detalhadas sobre os grupos familiares em cada unidade.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {unidades.map((_u) => {
                  const u = _u as unknown as UnidadeAdmin;
                  return (
                  <div key={u.id_unidade} className="flex flex-col p-4 border rounded-lg bg-card shadow-sm">
                    <div className="flex items-center justify-between mb-3 border-b pb-2">
                      <div className="font-bold text-lg">{u.bloco_torre} - {u.numero_unidade}</div>
                      {u.moradores && u.moradores.length > 0 ? (
                        <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/10">Ocupada</Badge>
                      ) : (
                        <Badge variant="outline" className="text-muted-foreground">Vaga</Badge>
                      )}
                    </div>
                    
                    <div className="space-y-2 flex-1">
                      {u.moradores && u.moradores.length > 0 ? (
                        u.moradores.map((m, idx) => (
                          <div key={idx} className="flex justify-between items-start text-sm p-2 rounded-md bg-muted/30">
                            <div>
                              <div className="font-medium flex items-center gap-2">
                                {m.usuario?.nome_completo}
                                {m.principal && <Badge variant="secondary" className="text-[10px] h-4 px-1 py-0">Responsável</Badge>}
                              </div>
                              <div className="text-xs text-muted-foreground mt-0.5">
                                {m.usuario?.telefone} • {m.usuario?.email}
                              </div>
                            </div>
                            <div className="text-xs text-muted-foreground font-mono">
                              {m.usuario?.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-sm text-muted-foreground italic text-center py-4">Nenhum morador registrado.</div>
                      )}
                    </div>
                  </div>
                )})}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="staff" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Quadro de Funcionários</CardTitle>
              <CardDescription>Todos os funcionários registrados, incluindo porteiros e síndicos.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {funcionarios.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Nenhum funcionário cadastrado.</p>
                ) : (
                  funcionarios.map((_f) => {
                    const f = _f as unknown as FuncionarioAdmin;
                    return (
                    <div key={f.id_usuario} className="flex flex-col p-4 border rounded-xl bg-card shadow-sm hover:border-primary/50 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                            <UserCheck className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <div className="font-bold text-base">{f.nome_completo}</div>
                            <Badge variant="outline" className="mt-1 font-mono text-xs uppercase bg-muted">
                              {f.perfil}
                            </Badge>
                          </div>
                        </div>
                        <Badge variant={f.ativo ? "default" : "secondary"}>
                          {f.ativo ? "Ativo" : "Inativo"}
                        </Badge>
                      </div>
                      
                      <div className="space-y-1.5 text-sm bg-muted/30 p-3 rounded-lg mt-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Email:</span>
                          <span className="font-medium">{f.email}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Telefone:</span>
                          <span className="font-medium">{f.telefone}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">CPF:</span>
                          <span className="font-mono">{f.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Data Cadastro:</span>
                          <span>{new Date(f.data_criacao).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  )})
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}