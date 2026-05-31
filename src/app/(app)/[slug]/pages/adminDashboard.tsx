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

interface AdminDashboardProps {
  stats: {
    totalUnidades: number;
    unidadesOcupadas: number;
    totalBlocos: number;
    totalFuncionarios: number;
    totalEncomendasPendentes: number;
  };
  encomendasPendentes: Record<string, any>[];
  funcionarios: Record<string, any>[];
  unidades: Record<string, any>[];
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
                        <th className="h-10 px-2 text-left align-middle font-medium text-muted-foreground">Unidade</th>
                        <th className="h-10 px-2 text-left align-middle font-medium text-muted-foreground">Tipo</th>
                        <th className="h-10 px-2 text-left align-middle font-medium text-muted-foreground">Recebimento</th>
                        <th className="h-10 px-2 text-left align-middle font-medium text-muted-foreground">Status</th>
                      </tr>
                    </thead>
                    <tbody className="[&_tr:last-child]:border-0">
                      {encomendasPendentes.map((enc) => (
                        <tr key={enc.id_encomenda} className="border-b transition-colors hover:bg-muted/50">
                          <td className="p-2 align-middle font-medium">
                            {enc.unidade?.bloco_torre} - {enc.unidade?.numero_unidade}
                          </td>
                          <td className="p-2 align-middle uppercase text-xs">{enc.tipo_encomenda}</td>
                          <td className="p-2 align-middle text-muted-foreground">
                            {enc.data_recebimento ? new Date(enc.data_recebimento).toLocaleString() : ""}
                          </td>
                          <td className="p-2 align-middle">
                            <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-600 border-yellow-200">
                              Pendente
                            </Badge>
                          </td>
                        </tr>
                      ))}
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
              <CardDescription>Unidades ocupadas e seus moradores principais.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {unidades.map((u) => (
                  <div key={u.id_unidade} className="flex items-center justify-between p-3 border rounded-lg bg-muted/20">
                    <div>
                      <div className="font-bold">{u.bloco_torre} - {u.numero_unidade}</div>
                      <div className="text-xs text-muted-foreground">
                        {u.moradores && u.moradores.length > 0 
                          ? u.moradores[0].usuario?.nome_completo 
                          : "Sem moradores"}
                      </div>
                    </div>
                    {u.moradores && u.moradores.length > 0 ? (
                      <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/10">Ocupada</Badge>
                    ) : (
                      <Badge variant="outline" className="text-muted-foreground">Vaga</Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="staff" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Quadro de Funcionários</CardTitle>
              <CardDescription>Porteiros registrados no condomínio.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {funcionarios.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Nenhum funcionário cadastrado.</p>
                ) : (
                  funcionarios.map((f) => (
                    <div key={f.id_usuario} className="flex items-center justify-between p-4 border rounded-xl hover:bg-muted/30 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <UserCheck className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-bold">{f.nome_completo}</div>
                          <div className="text-xs text-muted-foreground">{f.email} | {f.telefone}</div>
                        </div>
                      </div>
                      <Badge variant={f.ativo ? "default" : "secondary"}>
                        {f.ativo ? "Ativo" : "Inativo"}
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}