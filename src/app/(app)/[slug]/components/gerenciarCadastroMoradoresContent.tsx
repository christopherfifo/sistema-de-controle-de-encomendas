"use client";

import { useState, useTransition, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Search,
  UserMinus,
  UserCheck,
  Building,
  ShieldCheck,
  X,
  RefreshCw,
  LayoutList,
  LayoutGrid,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { maskCPF } from "@/helpers/cpf";
import {
  removerMoradorDoCondominio,
  reativarMoradorNoCondominio,
  alterarUnidadeMorador,
  promoverMoradorATitular,
} from "../helpers/actionMorador";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export interface GerenciarCadastroMoradoresContentProps {
  moradores: {
    id_usuario: string;
    nome_completo: string;
    cpf: string;
    email: string;
    telefone: string;
    ativo: boolean;
    data_criacao: string | Date;
    unidades_residenciais: {
      principal: boolean;
      unidade: {
        id_unidade: string;
        bloco_torre: string;
        numero_unidade: string;
        moradores: {
          principal: boolean;
          usuario: {
            id_usuario: string;
            nome_completo: string;
            cpf: string;
            telefone: string;
          };
        }[];
      };
    }[];
  }[];
  unidades: {
    id_unidade: string;
    bloco_torre: string;
    numero_unidade: string;
  }[];
  condominioId: string;
  sindicoId: string;
}

export function GerenciarCadastroMoradoresContent({
  moradores,
  unidades,
  condominioId,
  sindicoId,
}: GerenciarCadastroMoradoresContentProps) {
  const [isPending, startTransition] = useTransition();
  const [pesquisa, setPesquisa] = useState("");
  const [isSimplificado, setIsSimplificado] = useState(false);
  const [idsExpandidos, setIdsExpandidos] = useState<string[]>([]);

  const [modalAberto, setModalAberto] = useState(false);
  const [tipoOperacao, setTipoOperacao] = useState<"bloquear" | "reativar" | "alterarUnidade" | "promoverTitular">("bloquear");
  const [moradorAlvo, setMoradorAlvo] = useState<{ id: string; nome: string; idUnidade?: string } | null>(null);
  const [unidadeParaVincular, setUnidadeParaVincular] = useState("");
  const [tokenConfirmacao, setTokenConfirmacao] = useState("");

  const [tabAtual, setTabTabAtual] = useState<"ativos" | "inativos">("ativos");

  const moradoresAtivos = moradores.filter(m => m.ativo);
  const moradoresInativos = moradores.filter(m => !m.ativo);

  const moradoresParaExibir = (tabAtual === "ativos" ? moradoresAtivos : moradoresInativos).filter((m) =>
    m.nome_completo.toLowerCase().includes(pesquisa.toLowerCase()) ||
    m.cpf.includes(pesquisa) ||
    m.email.toLowerCase().includes(pesquisa.toLowerCase())
  );

  const toggleExpandir = (id: string) => {
    setIdsExpandidos((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const abrirModal = (tipo: "bloquear" | "reativar" | "alterarUnidade" | "promoverTitular", id: string, nome: string, idUnidade?: string) => {
    setTipoOperacao(tipo);
    setMoradorAlvo({ id, nome, idUnidade });
    setUnidadeParaVincular("");
    setTokenConfirmacao("");
    setModalAberto(true);
  };

  const handleExecutarOperacao = (e: React.FormEvent) => {
    e.preventDefault();
    if (!moradorAlvo || !tokenConfirmacao.trim()) return;

    startTransition(async () => {
      let res;
      if (tipoOperacao === "bloquear") {
        res = await removerMoradorDoCondominio({ moradorId: moradorAlvo.id, condominioId, sindicoId, tokenSindico: tokenConfirmacao });
      } else if (tipoOperacao === "reativar") {
        res = await reativarMoradorNoCondominio({ moradorId: moradorAlvo.id, condominioId, sindicoId, tokenSindico: tokenConfirmacao, idUnidade: unidadeParaVincular });
      } else if (tipoOperacao === "alterarUnidade") {
        res = await alterarUnidadeMorador({ moradorId: moradorAlvo.id, condominioId, sindicoId, tokenSindico: tokenConfirmacao, idUnidade: unidadeParaVincular });
      } else {
        res = await promoverMoradorATitular({ moradorId: moradorAlvo.id, condominioId, sindicoId, tokenSindico: tokenConfirmacao, idUnidade: moradorAlvo.idUnidade });
      }

      alert(res.message);
      if (res.success) setModalAberto(false);
    });
  };

  return (
    <div className="space-y-6 w-full max-w-5xl mx-auto p-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-3xl font-bold tracking-tight">Gestão de Moradores</h2>
          <p className="text-muted-foreground text-sm">Controle completo de ocupação, núcleos familiares e unidades.</p>
        </div>

        <div className="flex items-center gap-2 bg-muted/50 p-1.5 rounded-xl border border-border">
          <Button 
            variant={isSimplificado ? "ghost" : "secondary"} 
            size="sm" 
            onClick={() => setIsSimplificado(false)}
            className="gap-2 rounded-lg font-bold text-[10px] uppercase tracking-wider"
          >
            <LayoutGrid className="h-3.5 w-3.5" /> Detalhado
          </Button>
          <Button 
            variant={isSimplificado ? "secondary" : "ghost"} 
            size="sm" 
            onClick={() => setIsSimplificado(true)}
            className="gap-2 rounded-lg font-bold text-[10px] uppercase tracking-wider"
          >
            <LayoutList className="h-3.5 w-3.5" /> Simplificado
          </Button>
        </div>
      </div>

      <Separator />

      <Tabs value={tabAtual} onValueChange={(v) => setTabTabAtual(v as "ativos" | "inativos")} className="w-full">
        <TabsList className="flex flex-col sm:grid sm:grid-cols-2 w-full h-auto gap-2 p-1 mb-4">
          <TabsTrigger value="ativos" className="relative">
            Ativos
            <span className="ml-2 bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-[10px] font-bold">
              {moradoresAtivos.length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="inativos">
            Desativados / Histórico
            <span className="ml-2 bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-[10px] font-bold">
              {moradoresInativos.length}
            </span>
          </TabsTrigger>
        </TabsList>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={`Buscar em ${tabAtual === "ativos" ? "ativos" : "desativados"} por nome, CPF ou e-mail...`}
            className="pl-9 h-12 rounded-xl border-primary/20 focus-visible:ring-primary"
            value={pesquisa}
            onChange={(e) => setPesquisa(e.target.value)}
          />
        </div>

        <div className="grid gap-4">
          {moradoresParaExibir.length === 0 ? (
            <p className="text-center py-10 text-muted-foreground text-sm border-2 border-dashed rounded-2xl">
              Nenhum morador encontrado nesta categoria.
            </p>
          ) : (
            moradoresParaExibir.map((m) => {
              const expandido = idsExpandidos.includes(m.id_usuario);
              
              return (
                <Card key={m.id_usuario} className={`overflow-hidden border transition-all duration-200 ${!m.ativo ? "border-destructive/30 bg-destructive/[0.01]" : "border-border hover:border-primary/30"}`}>
                  <div 
                    className={`p-5 flex flex-col md:flex-row md:items-center justify-between gap-6 ${!isSimplificado && "cursor-pointer hover:bg-muted/10"}`}
                    onClick={() => !isSimplificado && toggleExpandir(m.id_usuario)}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`mt-1 p-2 rounded-xl hidden sm:block ${m.ativo ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"}`}>
                        <Building className="h-5 w-5" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`font-bold text-lg ${!m.ativo && "line-through text-muted-foreground"}`}>{m.nome_completo}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-black uppercase ${m.ativo ? "bg-emerald-100 text-emerald-700" : "bg-destructive/10 text-destructive"}`}>
                            {m.ativo ? "Ativo" : "Inativo"}
                          </span>
                          {m.unidades_residenciais.map(ur => (
                            <span key={ur.unidade.id_unidade} className="text-[10px] bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded-full font-bold">
                              {ur.unidade.bloco_torre} - Apt {ur.unidade.numero_unidade} {ur.principal && "(Titular)"}
                            </span>
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground font-medium">CPF: {maskCPF(m.cpf)} • {m.email}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 self-start md:self-center w-full md:w-auto mt-3 md:mt-0">
                      {m.ativo ? (
                        <>
                          <Button size="sm" variant="outline" className="gap-2 h-8 text-xs font-bold border-primary/20 text-primary hover:bg-primary/5 flex-1 md:flex-none" onClick={(e) => { e.stopPropagation(); abrirModal("alterarUnidade", m.id_usuario, m.nome_completo); }}>
                            <RefreshCw className="h-3.5 w-3.5" shrink-0 /> Mudar Unidade
                          </Button>
                          <Button size="sm" variant="destructive" className="gap-2 h-8 text-xs font-bold flex-1 md:flex-none" onClick={(e) => { e.stopPropagation(); abrirModal("bloquear", m.id_usuario, m.nome_completo); }}>
                            <UserMinus className="h-3.5 w-3.5" shrink-0 /> Desativar
                          </Button>
                        </>
                      ) : (
                        <Button size="sm" variant="outline" className="gap-2 h-8 text-xs font-bold border-emerald-600 text-emerald-600 hover:bg-emerald-50 flex-1 md:flex-none" onClick={(e) => { e.stopPropagation(); abrirModal("reativar", m.id_usuario, m.nome_completo); }}>
                          <UserCheck className="h-3.5 w-3.5" shrink-0 /> Reativar
                        </Button>
                      )}
                      
                      {!isSimplificado && (
                        <Button size="icon" variant="ghost" className="h-8 w-8 shrink-0">
                          {expandido ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </Button>
                      )}
                    </div>
                  </div>

                  {expandido && !isSimplificado && (
                    <CardContent className="border-t bg-muted/10 p-5 space-y-6 animate-in slide-in-from-top-2 duration-300">
                      <div className="grid gap-6 sm:grid-cols-2 text-sm">
                        <div className="space-y-2">
                          <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.15em]">Dados do Contato</p>
                          <div className="space-y-1">
                            <p className="font-bold">Telefone: <span className="font-medium text-muted-foreground ml-1">{m.telefone || "Não informado"}</span></p>
                            <p className="font-bold">Membro desde: <span className="font-medium text-muted-foreground ml-1">{new Date(m.data_criacao).toLocaleDateString("pt-BR")}</span></p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.15em] flex items-center gap-2">
                          <LayoutList className="h-3 w-3" /> Núcleos Familiares (Coabitantes)
                        </p>

                        {m.unidades_residenciais.map((ur) => {
                          const coabitantes = ur.unidade.moradores.filter(co => co.usuario.id_usuario !== m.id_usuario);
                          return (
                            <div key={ur.unidade.id_unidade} className="bg-background border rounded-2xl p-4 space-y-4 shadow-sm">
                              <div className="flex items-center justify-between">
                                <p className="text-xs font-black text-primary uppercase tracking-tight">
                                  Unidade {ur.unidade.numero_unidade} • Bloco {ur.unidade.bloco_torre}
                                </p>
                                {m.ativo && !ur.principal && (
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={(e) => { e.stopPropagation(); abrirModal("promoverTitular", m.id_usuario, m.nome_completo, ur.unidade.id_unidade); }}
                                    className="h-6 text-[9px] font-black uppercase text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 gap-1.5"
                                  >
                                    <UserCheck className="h-3 w-3" /> Tornar Titular
                                  </Button>
                                )}
                              </div>

                              {coabitantes.length === 0 ? (
                                <p className="text-xs text-muted-foreground italic pl-2">Nenhum familiar ou coabitante registrado nesta unidade.</p>
                              ) : (
                                <div className="grid gap-3 sm:grid-cols-2">
                                  {coabitantes.map((co) => (
                                    <div key={co.usuario.id_usuario} className="flex items-center gap-3 p-3 rounded-xl border border-muted/50 bg-muted/5">
                                      <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center font-bold text-xs text-muted-foreground">
                                        {co.usuario.nome_completo.charAt(0)}
                                      </div>
                                      <div className="min-w-0">
                                        <p className="text-xs font-bold truncate">
                                          {co.usuario.nome_completo} {co.principal && <span className="text-[8px] text-amber-600 bg-amber-50 border border-amber-200 px-1 rounded ml-1">Resp.</span>}
                                        </p>
                                        <p className="text-[10px] text-muted-foreground truncate">{co.usuario.telefone}</p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  )}
                </Card>
              );
            })
          )}
        </div>
      </Tabs>

      {modalAberto && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
          <Card className="w-full max-w-md shadow-2xl relative border-primary/20 rounded-3xl">
            <button onClick={() => setModalAberto(false)} className="absolute right-6 top-6 text-muted-foreground hover:text-foreground transition-colors"><X className="h-5 w-5" /></button>
            <CardHeader className="pb-6">
              <CardTitle className={`text-2xl flex items-center gap-3 ${tipoOperacao === "bloquear" ? "text-destructive" : "text-primary"}`}>
                <ShieldCheck className="h-6 w-6" />
                {tipoOperacao === "bloquear" ? "Bloquear Morador" : tipoOperacao === "reativar" ? "Reativar Cadastro" : tipoOperacao === "alterarUnidade" ? "Mudar Unidade" : "Definir Titular"}
              </CardTitle>
              <CardDescription className="text-sm font-medium pt-2">
                {tipoOperacao === "promoverTitular" ? "Promover morador a responsável pela unidade." : `Morador: ${moradorAlvo?.nome}`}
                {tipoOperacao === "promoverTitular" && <p className="mt-1 text-foreground font-bold">{moradorAlvo?.nome}</p>}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleExecutarOperacao} className="space-y-6">
                {(tipoOperacao === "reativar" || tipoOperacao === "alterarUnidade") && (
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Local de Destino</Label>
                    <select className="flex h-12 w-full rounded-2xl border border-input bg-background px-4 py-2 text-sm focus:ring-2 focus:ring-primary outline-none transition-all shadow-sm" value={unidadeParaVincular} onChange={(e) => setUnidadeParaVincular(e.target.value)} required>
                      <option value="">-- Selecione o Apartamento --</option>
                      {unidades.map((u) => <option key={u.id_unidade} value={u.id_unidade}>Bloco {u.bloco_torre} - Unidade {u.numero_unidade}</option>)}
                    </select>
                  </div>
                )}
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Token Administrativo (8 dígitos)</Label>
                  <Input type="password" placeholder="••••-••••" className="h-12 rounded-2xl text-center font-mono tracking-[0.5em] text-lg bg-muted/30 focus:bg-background transition-all" value={tokenConfirmacao} onChange={(e) => setTokenConfirmacao(e.target.value)} required disabled={isPending} />
                </div>
                <div className="flex gap-3 pt-2">
                  <Button type="submit" variant={tipoOperacao === "bloquear" ? "destructive" : "default"} className="flex-1 h-12 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-lg shadow-primary/20" disabled={isPending}>
                    {isPending ? "Processando..." : "Confirmar Alteração"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
