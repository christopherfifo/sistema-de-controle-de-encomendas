"use client";

import { useState, useTransition, useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Home, RefreshCw, CheckCircle2, Building, AlertCircle } from "lucide-react";
import { getUnidadesDoCondominio, adicionarUnidades, deletarUnidade, deletarBloco } from "../gerenciarUnidades/actions";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

interface GerenciarUnidadesContentProps {
  condominioId: string;
}

interface UnidadeComCount {
  id_unidade: string;
  bloco_torre: string;
  numero_unidade: string;
  _count: {
    moradores: number;
    encomendas: number;
  };
}

export function GerenciarUnidadesContent({ condominioId }: GerenciarUnidadesContentProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [unidades, setUnidades] = useState<UnidadeComCount[]>([]);
  const [limite, setLimite] = useState(0);
  const [totalAtual, setTotalAtual] = useState(0);
  
  const [novoBlocoNome, setNovoBlocoNome] = useState("");
  const [novoBlocoNumeros, setNovoBlocoNumeros] = useState("");

  const [existenteBlocoNome, setExistenteBlocoNome] = useState("");
  const [existenteBlocoNumeros, setExistenteBlocoNumeros] = useState("");
  
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const carregarDados = async () => {
    const res = await getUnidadesDoCondominio(condominioId);
    if (res.success) {
      setUnidades(res.unidades || []);
      setLimite(res.limite || 0);
      setTotalAtual(res.totalAtual || 0);
    }
  };

  useEffect(() => {
    carregarDados();
  }, [condominioId]);

  const handleAddNovoBloco = () => {
    setErrorMsg(null);
    setSuccessMsg(null);
    
    if (!novoBlocoNome.trim() || !novoBlocoNumeros.trim()) {
      setErrorMsg("Preencha o Bloco/Torre e pelo menos um número de unidade.");
      return;
    }

    startTransition(async () => {
      const res = await adicionarUnidades(condominioId, novoBlocoNome, novoBlocoNumeros, true);
      if (res.success) {
        setSuccessMsg("Novo bloco e unidades adicionados com sucesso!");
        setNovoBlocoNome("");
        setNovoBlocoNumeros("");
        carregarDados();
        router.refresh();
      } else {
        setErrorMsg(res.error || "Erro ao adicionar unidades.");
      }
    });
  };

  const handleAddExistente = () => {
    setErrorMsg(null);
    setSuccessMsg(null);
    
    if (!existenteBlocoNome.trim() || !existenteBlocoNumeros.trim()) {
      setErrorMsg("Selecione o Bloco/Torre e preencha pelo menos um número de unidade.");
      return;
    }

    startTransition(async () => {
      const res = await adicionarUnidades(condominioId, existenteBlocoNome, existenteBlocoNumeros);
      if (res.success) {
        setSuccessMsg("Unidades adicionadas ao bloco com sucesso!");
        setExistenteBlocoNome("");
        setExistenteBlocoNumeros("");
        carregarDados();
        router.refresh();
      } else {
        setErrorMsg(res.error || "Erro ao adicionar unidades.");
      }
    });
  };

  const handleDeleteUnidade = (id: string) => {
    toast("Tem certeza que deseja excluir esta unidade?", {
      action: {
        label: "Confirmar",
        onClick: () => {
          setErrorMsg(null);
          setSuccessMsg(null);
          
          startTransition(async () => {
            const res = await deletarUnidade(id);
            if (res.success) {
              setSuccessMsg("Unidade excluída com sucesso.");
              carregarDados();
              router.refresh();
            } else {
              setErrorMsg(res.error || "Erro ao excluir unidade.");
            }
          });
        }
      },
      cancel: { label: "Cancelar", onClick: () => {} }
    });
  };

  const handleDeleteBloco = (nomeBloco: string) => {
    toast(`ATENÇÃO: Tem certeza que deseja excluir o bloco '${nomeBloco}' inteiro e todas as suas unidades?`, {
      action: {
        label: "Confirmar",
        onClick: () => {
          setErrorMsg(null);
          setSuccessMsg(null);
          
          startTransition(async () => {
            const res = await deletarBloco(condominioId, nomeBloco);
            if (res.success) {
              setSuccessMsg(`Bloco '${nomeBloco}' excluído com sucesso.`);
              carregarDados();
              router.refresh();
            } else {
              setErrorMsg(res.error || "Erro ao excluir o bloco.");
            }
          });
        }
      },
      cancel: { label: "Cancelar", onClick: () => {} }
    });
  };

  // Group units by block
  const blocos = useMemo(() => {
    const agrupado: Record<string, UnidadeComCount[]> = {};
    unidades.forEach(u => {
      if (!agrupado[u.bloco_torre]) {
        agrupado[u.bloco_torre] = [];
      }
      agrupado[u.bloco_torre].push(u);
    });
    return agrupado;
  }, [unidades]);

  const nomeBlocos = Object.keys(blocos).sort();

  const percentualUso = limite > 0 ? (totalAtual / limite) * 100 : 0;
  const pertoDoLimite = percentualUso >= 90;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Gerenciar Unidades</h2>
        <p className="text-muted-foreground">
          Adicione e remova blocos e apartamentos, gerenciando o limite do seu plano.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="h-5 w-5 text-primary" />
              Resumo do Plano
            </CardTitle>
            <CardDescription>Uso atual de unidades</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1 text-sm">
                  <span className="font-medium text-muted-foreground">Ocupadas: {totalAtual}</span>
                  <span className="font-medium text-muted-foreground">Limite: {limite}</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2.5">
                  <div 
                    className={`h-2.5 rounded-full ${pertoDoLimite ? 'bg-red-500' : 'bg-primary'}`} 
                    style={{ width: `${Math.min(percentualUso, 100)}%` }}
                  ></div>
                </div>
                {pertoDoLimite && (
                  <p className="text-xs text-red-500 mt-2 font-medium">Atenção: Você está próximo do limite do seu plano.</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Adicionar Unidades</CardTitle>
            <CardDescription>Escolha entre criar um novo bloco ou adicionar a um existente.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {errorMsg && (
                <div className="bg-red-50 text-red-900 border border-red-200 p-4 rounded-md flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-semibold text-sm">Erro</h4>
                    <p className="text-sm mt-1">{errorMsg}</p>
                  </div>
                </div>
              )}
              {successMsg && (
                <div className="bg-green-50 text-green-900 border border-green-200 p-4 rounded-md flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 mt-0.5 shrink-0 stroke-green-600" />
                  <div>
                    <h4 className="font-semibold text-sm">Sucesso</h4>
                    <p className="text-sm mt-1">{successMsg}</p>
                  </div>
                </div>
              )}

              <Tabs defaultValue="existente" className="w-full">
                <TabsList className="flex flex-col sm:grid sm:grid-cols-2 w-full h-auto gap-2 p-1">
                  <TabsTrigger value="existente">Adicionar a Bloco Existente</TabsTrigger>
                  <TabsTrigger value="novo">Criar Novo Bloco</TabsTrigger>
                </TabsList>
                
                <TabsContent value="existente" className="space-y-4 mt-4">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="w-full md:w-1/3">
                      <Label htmlFor="blocoExistente">Selecione o Bloco</Label>
                      <select 
                        id="blocoExistente"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        value={existenteBlocoNome}
                        onChange={(e) => setExistenteBlocoNome(e.target.value)}
                      >
                        <option value="" disabled>Escolha um bloco</option>
                        {nomeBlocos.map(b => (
                          <option key={b} value={b}>{b}</option>
                        ))}
                      </select>
                    </div>
                    <div className="w-full md:w-2/3">
                      <Label htmlFor="numerosExistente">Números (separados por vírgula)</Label>
                      <Input 
                        id="numerosExistente" 
                        placeholder="Ex: 101, 102, 103, 201" 
                        value={existenteBlocoNumeros}
                        onChange={(e) => setExistenteBlocoNumeros(e.target.value)}
                      />
                    </div>
                  </div>
                  <Button onClick={handleAddExistente} disabled={isPending || !existenteBlocoNome || !existenteBlocoNumeros} className="w-full md:w-auto">
                    {isPending ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                    Adicionar a Bloco Existente
                  </Button>
                </TabsContent>

                <TabsContent value="novo" className="space-y-4 mt-4">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="w-full md:w-1/3">
                      <Label htmlFor="blocoNovo">Nome do Novo Bloco / Torre</Label>
                      <Input 
                        id="blocoNovo" 
                        placeholder="Ex: Bloco A" 
                        value={novoBlocoNome}
                        onChange={(e) => setNovoBlocoNome(e.target.value.toUpperCase())}
                      />
                    </div>
                    <div className="w-full md:w-2/3">
                      <Label htmlFor="numerosNovo">Números Iniciais (vírgula)</Label>
                      <Input 
                        id="numerosNovo" 
                        placeholder="Ex: 101, 102, 103, 201" 
                        value={novoBlocoNumeros}
                        onChange={(e) => setNovoBlocoNumeros(e.target.value)}
                      />
                    </div>
                  </div>
                  <Button onClick={handleAddNovoBloco} disabled={isPending || !novoBlocoNome || !novoBlocoNumeros} className="w-full md:w-auto">
                    {isPending ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Building className="mr-2 h-4 w-4" />}
                    Criar Novo Bloco
                  </Button>
                </TabsContent>
              </Tabs>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Unidades Cadastradas</CardTitle>
          <CardDescription>Lista de todos os blocos e unidades do condomínio.</CardDescription>
          <div className="bg-yellow-50 text-yellow-800 p-3 rounded-md text-xs border border-yellow-200 mt-2">
            <span className="font-semibold">Nota:</span> Blocos e unidades que possuem histórico de encomendas não podem ser excluídos para manter a integridade dos dados. A exclusão de unidades inativará os moradores vinculados a ela.
          </div>
        </CardHeader>
        <CardContent>
          {Object.keys(blocos).length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">Nenhuma unidade cadastrada.</p>
          ) : (
            <div className="space-y-6 mt-2">
              {nomeBlocos.map((nomeBloco) => {
                const unidadesDoBloco = blocos[nomeBloco];
                const blocoTemEncomendas = unidadesDoBloco.some((u: UnidadeComCount) => u._count.encomendas > 0);

                return (
                  <div key={nomeBloco} className="border rounded-lg p-4 bg-card">
                    <div className="flex items-center justify-between border-b pb-2 mb-3">
                      <h3 className="font-bold text-lg flex items-center">
                        <Home className="mr-2 h-5 w-5 text-muted-foreground" />
                        {nomeBloco} 
                        <span className="ml-2 text-xs bg-muted px-2 py-1 rounded-full text-muted-foreground font-normal">
                          {unidadesDoBloco.length} unid.
                        </span>
                      </h3>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDeleteBloco(nomeBloco)}
                        disabled={isPending || blocoTemEncomendas}
                        title={blocoTemEncomendas ? "Este bloco possui unidades com histórico de encomendas e não pode ser excluído." : "Excluir bloco inteiro"}
                        className="h-8"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Excluir Bloco
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {unidadesDoBloco.map((unidade: UnidadeComCount) => {
                        const unidadeTemEncomendas = unidade._count.encomendas > 0;
                        return (
                          <div 
                            key={unidade.id_unidade} 
                            className="flex items-center bg-background border rounded-md px-3 py-2 min-w-[120px] justify-between group hover:border-primary transition-colors"
                          >
                            <span className="font-medium">{unidade.numero_unidade}</span>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-6 w-6 opacity-0 group-hover:opacity-100 text-destructive hover:bg-destructive/10"
                              onClick={() => handleDeleteUnidade(unidade.id_unidade)}
                              disabled={isPending || unidadeTemEncomendas}
                              title={unidadeTemEncomendas ? "Possui histórico de encomendas e não pode ser excluído." : "Excluir unidade"}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}