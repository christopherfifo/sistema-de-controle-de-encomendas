"use client";

import { useState, useTransition } from "react";
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
  ChevronDown,
  ChevronUp,
  UserMinus,
  UserCheck,
  Users,
  Building,
  ShieldCheck,
  X,
  RefreshCw,
} from "lucide-react";
import { maskCPF } from "@/helpers/cpf";
import {
  removerMoradorDoCondominio,
  reativarMoradorNoCondominio,
  alterarUnidadeMorador,
} from "../helpers/actionMorador";

interface GerenciarMoradoresContentProps {
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

export function GerenciarMoradoresContent({
  moradores,
  unidades,
  condominioId,
  sindicoId,
}: GerenciarMoradoresContentProps) {
  const [isPending, startTransition] = useTransition();

  const [pesquisa, setPesquisa] = useState("");
  const [blocoSelecionado, setBlocoSelecionado] = useState("");
  const [unidadeSelecionada, setUnidadeSelecionada] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("ativos");

  const [idsExpandidos, setIdsExpandidos] = useState<string[]>([]);

  const [modalAberto, setModalAberto] = useState(false);
  const [tipoOperacao, setTipoOperacao] = useState<"bloquear" | "reativar" | "alterarUnidade">(
    "bloquear",
  );
  const [moradorAlvo, setMoradorAlvo] = useState<{
    id: string;
    nome: string;
  } | null>(null);
  const [unidadeParaVincular, setUnidadeParaVincular] = useState("");
  const [tokenConfirmacao, setTokenConfirmacao] = useState("");

  const blocosDisponiveis = Array.from(
    new Set(
      moradores.flatMap((m) =>
        m.unidades_residenciais.map((ur) => ur.unidade.bloco_torre),
      ),
    ),
  ).sort() as string[];

  const toggleExpandir = (id: string) => {
    setIdsExpandidos((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const moradoresFiltrados = moradores.filter((m) => {
    const correspondePesquisa =
      m.nome_completo.toLowerCase().includes(pesquisa.toLowerCase()) ||
      m.email.toLowerCase().includes(pesquisa.toLowerCase()) ||
      m.cpf.includes(pesquisa);

    const correspondeBloco = blocoSelecionado
      ? m.unidades_residenciais.some(
          (ur) => ur.unidade.bloco_torre === blocoSelecionado,
        )
      : true;

    const correspondeUnidade = unidadeSelecionada
      ? m.unidades_residenciais.some(
          (ur) => ur.unidade.numero_unidade === unidadeSelecionada,
        )
      : true;

    const correspondeStatus =
      filtroStatus === "ativos"
        ? m.ativo === true
        : filtroStatus === "bloqueados"
          ? m.ativo === false
          : true;

    return (
      correspondePesquisa &&
      correspondeBloco &&
      correspondeUnidade &&
      correspondeStatus
    );
  });

  const abrirModal = (
    tipo: "bloquear" | "reativar" | "alterarUnidade",
    id: string,
    nome: string,
  ) => {
    setTipoOperacao(tipo);
    setMoradorAlvo({ id, nome });
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
        res = await removerMoradorDoCondominio({
          moradorId: moradorAlvo.id,
          condominioId,
          sindicoId,
          tokenSindico: tokenConfirmacao,
        });
      } else if (tipoOperacao === "reativar") {
        res = await reativarMoradorNoCondominio({
          moradorId: moradorAlvo.id,
          condominioId,
          sindicoId,
          tokenSindico: tokenConfirmacao,
          idUnidade: unidadeParaVincular,
        });
      } else {
        res = await alterarUnidadeMorador({
          moradorId: moradorAlvo.id,
          condominioId,
          sindicoId,
          tokenSindico: tokenConfirmacao,
          idUnidade: unidadeParaVincular,
        });
      }

      alert(res.message);
      if (res.success) {
        setModalAberto(false);
        setMoradorAlvo(null);
        setTokenConfirmacao("");
      }
    });
  };

  return (
    <div className="space-y-6 w-full max-w-5xl">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          Controle de Ocupação & Cadastro
        </h2>
        <p className="text-muted-foreground">
          Gerencie desligamentos, reativações e visualize núcleos familiares em
          tempo real.
        </p>
      </div>

      <Separator />

      <Card className="bg-muted/30">
        <CardContent className="pt-6 grid gap-4 sm:grid-cols-4">
          <div className="space-y-1.5">
            <Label htmlFor="search">Buscar Morador</Label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Nome, CPF ou E-mail..."
                className="pl-9"
                value={pesquisa}
                onChange={(e) => setPesquisa(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="bloco">Bloco / Torre</Label>
            <select
              id="bloco"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={blocoSelecionado}
              onChange={(e) => {
                setBlocoSelecionado(e.target.value);
                setUnidadeSelecionada("");
              }}
            >
              <option value="">Todos os Blocos</option>
              {blocosDisponiveis.map((b) => (
                <option key={b} value={b}>
                  Bloco / Torre {b}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="unidade">Apartamento</Label>
            <Input
              id="unidade"
              placeholder="Ex: 102, 44-A"
              value={unidadeSelecionada}
              onChange={(e) => setUnidadeSelecionada(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="status">Status Cadastral</Label>
            <select
              id="status"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-semibold text-primary"
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value)}
            >
              <option value="ativos">Apenas Contas Ativas</option>
              <option value="bloqueados">Apenas Contas Bloqueadas</option>
              <option value="todos">Mostrar Ambos (Todos)</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {moradoresFiltrados.map((m) => {
          const expandido = idsExpandidos.includes(m.id_usuario);

          return (
            <Card
              key={m.id_usuario}
              className={`overflow-hidden border transition-all duration-200 ${!m.ativo && "border-destructive/30 bg-destructive/[0.01]"}`}
            >
              <div
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-muted/20 select-none"
                onClick={() => toggleExpandir(m.id_usuario)}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`mt-1 p-2 rounded-lg hidden sm:block ${m.ativo ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"}`}
                  >
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`font-bold text-lg ${!m.ativo && "line-through text-muted-foreground"}`}
                      >
                        {m.nome_completo}
                      </span>

                      <span
                        className={`text-[10px] px-2 py-0.5 font-bold rounded-full ${m.ativo ? "bg-green-100 text-green-700" : "bg-destructive/10 text-destructive"}`}
                      >
                        {m.ativo ? "Ativo" : "Bloqueado"}
                      </span>

                      {m.unidades_residenciais.map((ur) => (
                        <span
                          key={ur.unidade.id_unidade}
                          className="text-[10px] bg-blue-100 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full font-semibold"
                        >
                          {ur.unidade.bloco_torre} - Apt{" "}
                          {ur.unidade.numero_unidade}{" "}
                          {ur.principal && "(Titular)"}
                        </span>
                      ))}

                      {m.unidades_residenciais.length === 0 && !m.ativo && (
                        <span className="text-[10px] bg-muted text-muted-foreground px-2 py-0.5 rounded-full font-semibold italic">
                          Sem unidade vinculada
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      CPF: {maskCPF(m.cpf)} • E-mail: {m.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  {m.ativo && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1.5 h-8 text-xs border-primary text-primary hover:bg-primary/5"
                      onClick={(e) => {
                        e.stopPropagation();
                        abrirModal("alterarUnidade", m.id_usuario, m.nome_completo);
                      }}
                    >
                      <RefreshCw className="h-3.5 w-3.5" /> Mudar Unidade
                    </Button>
                  )}
                  {m.ativo ? (
                    <Button
                      size="sm"
                      variant="destructive"
                      className="gap-1.5 h-8 text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        abrirModal("bloquear", m.id_usuario, m.nome_completo);
                      }}
                    >
                      <UserMinus className="h-3.5 w-3.5" /> Desvincular
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1.5 h-8 text-xs border-green-600 text-green-600 hover:bg-green-50"
                      onClick={(e) => {
                        e.stopPropagation();
                        abrirModal("reativar", m.id_usuario, m.nome_completo);
                      }}
                    >
                      <UserCheck className="h-3.5 w-3.5" /> Reativar Conta
                    </Button>
                  )}
                  <Button size="icon" variant="ghost" className="h-8 w-8">
                    {expandido ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {expandido && (
                <CardContent className="border-t bg-muted/10 p-4 space-y-4 animate-in slide-in-from-top-2 duration-200">
                  <div className="grid gap-4 sm:grid-cols-2 text-sm">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                        Dados da Conta
                      </p>
                      <p>
                        <strong>Telefone:</strong>{" "}
                        {m.telefone || "Não informado"}
                      </p>
                      <p>
                        <strong>Situação Cadastral:</strong>{" "}
                        {m.ativo
                          ? "✓ Liberado para as dependências"
                          : "✕ Acesso cortado da portaria"}
                      </p>
                      <p>
                        <strong>Data de Entrada:</strong>{" "}
                        {new Date(m.data_criacao).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider flex items-center gap-1">
                      <Building className="h-3.5 w-3.5" /> Moradores Coabitantes
                      da Unidade
                    </p>

                    {m.unidades_residenciais.map((ur) => {
                      const coabitantes = ur.unidade.moradores.filter(
                        (co) => co.usuario.id_usuario !== m.id_usuario,
                      );

                      return (
                        <div
                          key={ur.unidade.id_unidade}
                          className="bg-background border rounded-lg p-3 space-y-2"
                        >
                          <p className="text-xs font-bold text-primary">
                            Residentes do Apartamento{" "}
                            {ur.unidade.numero_unidade} (Bloco{" "}
                            {ur.unidade.bloco_torre}):
                          </p>

                          {coabitantes.length === 0 ? (
                            <p className="text-xs text-muted-foreground italic pl-2">
                              Nenhum familiar ou coabitante registrado nesta
                              unidade.
                            </p>
                          ) : (
                            <div className="divide-y text-xs">
                              {coabitantes.map((co) => (
                                <div
                                  key={co.usuario.id_usuario}
                                  className="flex justify-between items-center py-2 first:pt-0 last:pb-0"
                                >
                                  <div>
                                    <p className="font-semibold">
                                      {co.usuario.nome_completo}{" "}
                                      {co.principal && (
                                        <span className="text-[9px] text-amber-600 bg-amber-50 border border-amber-200 px-1 rounded">
                                          (Responsável)
                                        </span>
                                      )}
                                    </p>
                                    <p className="text-[11px] text-muted-foreground">
                                      CPF: {maskCPF(co.usuario.cpf)}
                                    </p>
                                  </div>
                                  <p className="text-muted-foreground">
                                    {co.usuario.telefone}
                                  </p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                    {m.unidades_residenciais.length === 0 && (
                      <p className="text-xs text-muted-foreground italic p-2 bg-background border rounded-lg">
                        Este usuário não possui nenhuma unidade associada no
                        momento. Reative-o para vinculá-lo a uma moradia.
                      </p>
                    )}
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}

        {moradoresFiltrados.length === 0 && (
          <p className="text-sm text-center text-muted-foreground py-10 border border-dashed rounded-xl">
            Nenhum registro encontrado para os filtros selecionados.
          </p>
        )}
      </div>

      {modalAberto && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <Card className="w-full max-w-md shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setModalAberto(false)}
              className="absolute right-4 top-4 text-muted-foreground hover:text-foreground p-1 rounded-md"
            >
              <X className="h-4 w-4" />
            </button>

            <CardHeader>
              <CardTitle
                className={`text-xl flex items-center gap-2 ${tipoOperacao === "bloquear" ? "text-destructive" : "text-primary"}`}
              >
                <ShieldCheck className="h-5 w-5" />{" "}
                {tipoOperacao === "bloquear"
                  ? "Bloquear Morador"
                  : tipoOperacao === "reativar"
                  ? "Reativar Cadastro"
                  : "Mudar Unidade"}
              </CardTitle>
              <CardDescription>
                {tipoOperacao === "bloquear" ? (
                  <>
                    Esta ação cortará os acessos de{" "}
                    <strong>{moradorAlvo?.nome}</strong> e limpará seus vínculos
                    com os apartamentos.
                  </>
                ) : tipoOperacao === "reativar" ? (
                  <>
                    Você está prestes a reativar a credencial de{" "}
                    <strong>{moradorAlvo?.nome}</strong> para reingresso no
                    condomínio.
                  </>
                ) : (
                  <>
                    Transfira <strong>{moradorAlvo?.nome}</strong> para uma nova unidade habitacional.
                  </>
                )}
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleExecutarOperacao} className="space-y-4">
                {(tipoOperacao === "reativar" || tipoOperacao === "alterarUnidade") && (
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="modal-unidade"
                      className="font-semibold text-xs"
                    >
                      {tipoOperacao === "reativar" ? "Vincular à Unidade" : "Nova Unidade Habitacional"}
                    </Label>
                    <select
                      id="modal-unidade"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={unidadeParaVincular}
                      onChange={(e) => setUnidadeParaVincular(e.target.value)}
                      required
                    >
                      <option value="">
                        -- Selecione o Apartamento de Destino --
                      </option>
                      {unidades.map((u) => (
                        <option key={u.id_unidade} value={u.id_unidade}>
                          Torre/Bloco {u.bloco_torre} - Apt {u.numero_unidade}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="space-y-2">
                  <Label
                    htmlFor="token-input"
                    className="text-sm font-semibold"
                  >
                    Token de Acesso do Síndico
                  </Label>
                  <Input
                    id="token-input"
                    type="password"
                    maxLength={9}
                    placeholder="Ex: 0000-0000"
                    className="font-mono text-center tracking-widest text-lg"
                    value={tokenConfirmacao}
                    onChange={(e) => setTokenConfirmacao(e.target.value)}
                    disabled={isPending}
                    required
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    type="submit"
                    variant={
                      tipoOperacao === "bloquear" ? "destructive" : "default"
                    }
                    className={`flex-1 ${tipoOperacao !== "bloquear" && "bg-primary hover:bg-primary/90"}`}
                    disabled={isPending}
                  >
                    {isPending
                      ? "Processando..."
                      : tipoOperacao === "bloquear"
                        ? "Confirmar Bloqueio"
                        : tipoOperacao === "reativar"
                        ? "Confirmar Reativação"
                        : "Confirmar Mudança"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setModalAberto(false)}
                    disabled={isPending}
                  >
                    Cancelar
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
