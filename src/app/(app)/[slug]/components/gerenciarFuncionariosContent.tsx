"use client";

import { useState, useTransition } from "react";
import { useForm, Control } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Loader2,
  ShieldAlert,
  UserX,
  UserCheck,
  Trash2,
  Edit2,
  UserPlus,
  CheckCircle,
  KeyRound,
  Copy,
  Check,
} from "lucide-react";

import {
  registroPorteiroSchema,
  edicaoPorteiroSchema,
  RegistroPorteiroFormData,
  EdicaoPorteiroFormData,
} from "../schemas/schemaPorteiro";
import {
  adicionarPorteiro,
  atualizarPorteiro,
  transformarMoradorEmPorteiro,
  alternarStatusPorteiro,
  excluirPorteiro,
} from "../helpers/actionPorteiro";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { maskCPF } from "@/helpers/cpf";
import { toast } from "sonner";

interface PorteiroInfo {
  id_usuario: string;
  nome_completo: string;
  cpf: string;
  email: string;
  telefone: string;
  ativo: boolean;
  token_acesso: string | null;
  unidades_residenciais: {
    principal: boolean;
    unidade: {
      id_unidade: string;
      bloco_torre: string;
      numero_unidade: string;
    };
  }[];
}

interface MoradorInfo {
  id_usuario: string;
  nome_completo: string;
  cpf: string;
  email: string;
}

interface UnidadeInfo {
  id_unidade: string;
  bloco_torre: string;
  numero_unidade: string;
}

interface GerenciarFuncionariosContentProps {
  porteiros: PorteiroInfo[];
  moradores: MoradorInfo[];
  unidades: UnidadeInfo[];
  condominioId: string;
  sindicoId: string;
  nomeCondominio: string;
}

function formatarTokenVisual(token: string | null): string {
  if (!token) return "---";
  if (token.length === 6) {
    return `${token.slice(0, 3)}-${token.slice(3, 6)}`;
  }
  if (token.length === 8) {
    return `${token.slice(0, 4)}-${token.slice(4, 8)}`;
  }
  return token;
}

export function GerenciarFuncionariosContent({
  porteiros,
  moradores,
  unidades,
  condominioId,
  sindicoId,
  nomeCondominio,
}: GerenciarFuncionariosContentProps) {
  const [isPending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState("lista");
  const [editandoPorteiroId, setEditandoPorteiroId] = useState<string | null>(
    null,
  );
  const [tokenPorteiroEdicao, setTokenPorteiroEdicao] = useState<string>("");
  const [copiadoId, setCopiadoId] = useState<string | null>(null);

  const formCadastro = useForm<RegistroPorteiroFormData>({
    resolver: zodResolver(registroPorteiroSchema),
    defaultValues: {
      nomeCompleto: "",
      email: "",
      cpf: "",
      telefone: "",
      senha: "",
      moraNoCondominio: false,
      id_unidade: "",
    },
  });

  const formEdicao = useForm<EdicaoPorteiroFormData>({
    resolver: zodResolver(edicaoPorteiroSchema),
    defaultValues: {
      id_usuario: "",
      nomeCompleto: "",
      email: "",
      telefone: "",
      moraNoCondominio: false,
      id_unidade: "",
    },
  });

  const watchMoraCadastro = formCadastro.watch("moraNoCondominio");
  const watchMoraEdicao = formEdicao.watch("moraNoCondominio");

  const handleCopiarToken = (token: string | null, idContexto: string) => {
    if (!token || token === "---") return;
    navigator.clipboard.writeText(token);
    setCopiadoId(idContexto);
    setTimeout(() => setCopiadoId(null), 2000);
  };

  const handleEntrarModoEdicao = (porteiro: PorteiroInfo) => {
    setEditandoPorteiroId(porteiro.id_usuario);
    setTokenPorteiroEdicao(porteiro.token_acesso || "");
    const primeiraUnidade =
      porteiro.unidades_residenciais?.[0]?.unidade?.id_unidade || "";

    formEdicao.reset({
      id_usuario: porteiro.id_usuario,
      nomeCompleto: porteiro.nome_completo,
      email: porteiro.email,
      telefone: porteiro.telefone,
      moraNoCondominio: porteiro.unidades_residenciais?.length > 0,
      id_unidade: primeiraUnidade,
    });
    setActiveTab("formulario");
  };

  const onCadastrarSubmit = (data: RegistroPorteiroFormData) => {
    const dadosTratados = {
      ...data,
      id_unidade: data.moraNoCondominio ? data.id_unidade : "",
    };

    startTransition(async () => {
      const res = await adicionarPorteiro(
        dadosTratados,
        condominioId,
        sindicoId,
      );

      if (res.success) {
        toast.success("Ação realizada com sucesso!");
        formCadastro.reset();
        setActiveTab("lista");
      } else {
        toast.info(res.message);
      }
    });
  };

  const onEditarSubmit = (data: EdicaoPorteiroFormData) => {
    const dadosTratados = {
      ...data,
      id_unidade: data.moraNoCondominio ? data.id_unidade : "",
    };

    startTransition(async () => {
      const res = await atualizarPorteiro(
        dadosTratados,
        condominioId,
        sindicoId,
      );
      toast.info(res.message);
      if (res.success) {
        setEditandoPorteiroId(null);
        setTokenPorteiroEdicao("");
        formEdicao.reset();
        setActiveTab("lista");
      }
    });
  };

  const handlePromoverMorador = (moradorId: string, nome: string) => {
    toast(`Confirmar a contratação de "${nome}" como Porteiro do sistema?`, {
      description: "Ele manterá os dados de moradia originais.",
      action: {
        label: "Confirmar",
        onClick: () => {
          startTransition(async () => {
            const res = await transformarMoradorEmPorteiro(
              moradorId,
              condominioId,
              sindicoId,
            );

            if (res.success) {
              toast.success("Ação realizada com sucesso!");
              setActiveTab("lista");
            } else {
              toast.info(res.message);
            }
          });
        }
      },
      cancel: { label: "Cancelar", onClick: () => {} }
    });
  };

  const handleAlternarStatus = (id: string, ativo: boolean) => {
    toast("Deseja alterar o status de atividade deste funcionário?", {
      action: {
        label: "Confirmar",
        onClick: () => {
          startTransition(async () => {
            await alternarStatusPorteiro(id, ativo, condominioId);
          });
        }
      },
      cancel: { label: "Cancelar", onClick: () => {} }
    });
  };

  const handleExcluir = (id: string) => {
    toast("Excluir permanentemente?", {
      description: "Se houver histórico no banco, o sistema impedirá por segurança.",
      action: {
        label: "Confirmar",
        onClick: () => {
          startTransition(async () => {
            const res = await excluirPorteiro(id, condominioId);
            toast.info(res.message);
          });
        }
      },
      cancel: { label: "Cancelar", onClick: () => {} }
    });
  };

  return (
    <div className="space-y-6 w-full max-w-5xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          Recursos Humanos & Portaria
        </h2>
        <p className="text-muted-foreground">
          Gerenciamento completo e atribuições de cargos de {nomeCondominio}
        </p>
      </div>

      <Separator />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="flex flex-col sm:grid sm:grid-cols-3 w-full h-auto gap-2 p-1 max-w-md">
          <TabsTrigger value="lista">Equipe Atual</TabsTrigger>
          <TabsTrigger value="formulario">
            {editandoPorteiroId ? "Editando Funcionário" : "Novo Porteiro"}
          </TabsTrigger>
          <TabsTrigger value="promover">Contratar Morador</TabsTrigger>
        </TabsList>

        <TabsContent value="lista" className="space-y-4 pt-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-primary" /> Funcionários da
                Portaria
              </CardTitle>
              <CardDescription>
                Visualize o status de acesso e complemente informações de
                habitação dos porteiros.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {porteiros.map((p) => {
                const mora = p.unidades_residenciais?.length > 0;
                const estaCopiado = copiadoId === p.id_usuario;

                return (
                  <div
                    key={p.id_usuario}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-muted/40 border rounded-xl gap-4"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-lg">
                          {p.nome_completo}
                        </span>
                        <span
                          className={`text-[10px] px-2 py-0.5 font-bold rounded-full ${p.ativo ? "bg-green-100 text-green-700" : "bg-destructive/10 text-destructive"}`}
                        >
                          {p.ativo ? "Ativo" : "Bloqueado"}
                        </span>

                        <div className="text-[10px] pl-2 pr-1 py-0.5 font-mono font-bold bg-amber-100 text-amber-800 rounded-full flex items-center gap-1.5 border border-amber-200">
                          <KeyRound className="h-3 w-3" /> Token:{" "}
                          {formatarTokenVisual(p.token_acesso)}
                          {p.token_acesso && (
                            <button
                              type="button"
                              onClick={() =>
                                handleCopiarToken(p.token_acesso, p.id_usuario)
                              }
                              className="p-0.5 hover:bg-amber-200 rounded transition-colors text-amber-900"
                              title="Copiar token bruto"
                            >
                              {estaCopiado ? (
                                <Check className="h-3 w-3 text-green-600" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                            </button>
                          )}
                        </div>

                        {mora && (
                          <span className="text-[10px] px-2 py-0.5 font-bold bg-blue-100 text-blue-700 rounded-full">
                            Mora no local (
                            {p.unidades_residenciais[0].unidade.bloco_torre} -
                            Apt{" "}
                            {p.unidades_residenciais[0].unidade.numero_unidade})
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-2 gap-y-0.5">
                        <span>CPF: {maskCPF(p.cpf)}</span>
                        <span className="hidden sm:inline">•</span>
                        <span className="break-all min-w-0">Email: {p.email}</span>
                        <span className="hidden sm:inline">•</span>
                        <span>Tel: {p.telefone}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEntrarModoEdicao(p)}
                        title="Editar dados cadastrais / Moradia"
                      >
                        <Edit2 className="h-4 w-4 text-primary" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          handleAlternarStatus(p.id_usuario, p.ativo)
                        }
                      >
                        {p.ativo ? (
                          <UserX className="h-4 w-4 text-destructive" />
                        ) : (
                          <UserCheck className="h-4 w-4 text-green-600" />
                        )}
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleExcluir(p.id_usuario)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
              {porteiros.length === 0 && (
                <p className="text-sm text-center text-muted-foreground py-6">
                  Nenhum porteiro cadastrado.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="formulario" className="pt-2">
          <Card className="max-w-xl">
            <CardHeader>
              <CardTitle>
                {editandoPorteiroId
                  ? "Alterar Dados Básicos e Moradia"
                  : "Cadastrar Novo Porteiro Profissional"}
              </CardTitle>
              <CardDescription>
                {editandoPorteiroId
                  ? "CPFs, senhas e tokens de portaria são protegidos e não podem ser alterados pelo administrador."
                  : "Crie uma conta nova de funcionário com senha provisória de acesso."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {editandoPorteiroId ? (
                <Form {...formEdicao}>
                  <form
                    onSubmit={formEdicao.handleSubmit(onEditarSubmit)}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                        <KeyRound className="h-4 w-4" /> Token de Acesso à
                        Portaria (Imutável)
                      </label>
                      <div className="flex gap-2">
                        <Input
                          value={formatarTokenVisual(tokenPorteiroEdicao)}
                          disabled
                          className="bg-amber-50/50 dark:bg-amber-950/20 font-mono font-bold text-amber-700 border-amber-200"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          className="border-amber-200 text-amber-800 hover:bg-amber-50"
                          onClick={() =>
                            handleCopiarToken(
                              tokenPorteiroEdicao,
                              "form-edicao",
                            )
                          }
                          title="Copiar token original"
                        >
                          {copiadoId === "form-edicao" ? (
                            <Check className="h-4 w-4 text-green-600 mr-2" />
                          ) : (
                            <Copy className="h-4 w-4 mr-2" />
                          )}
                          {copiadoId === "form-edicao" ? "Copiado!" : "Copiar"}
                        </Button>
                      </div>
                    </div>

                    <FormField
                      control={
                        formEdicao.control as Control<EdicaoPorteiroFormData>
                      }
                      name="nomeCompleto"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome Completo</FormLabel>
                          <FormControl>
                            <Input {...field} disabled={isPending} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={
                        formEdicao.control as Control<EdicaoPorteiroFormData>
                      }
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email de Acesso</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              {...field}
                              disabled={isPending}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={
                        formEdicao.control as Control<EdicaoPorteiroFormData>
                      }
                      name="telefone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Telefone</FormLabel>
                          <FormControl>
                            <Input {...field} disabled={isPending} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={
                        formEdicao.control as Control<EdicaoPorteiroFormData>
                      }
                      name="moraNoCondominio"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 bg-muted/20">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={(checked) => {
                                field.onChange(checked);
                                if (!checked)
                                  formEdicao.setValue("id_unidade", "");
                              }}
                              disabled={isPending}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              Este funcionário reside no condomínio?
                            </FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />

                    {watchMoraEdicao && (
                      <FormField
                        control={
                          formEdicao.control as Control<EdicaoPorteiroFormData>
                        }
                        name="id_unidade"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Selecione a Unidade Habitacional
                            </FormLabel>
                            <select
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                              {...field}
                              disabled={isPending}
                            >
                              <option value="">
                                -- Selecione o Apartamento --
                              </option>
                              {unidades.map((u) => (
                                <option key={u.id_unidade} value={u.id_unidade}>
                                  {u.bloco_torre} - Apt {u.numero_unidade}
                                </option>
                              ))}
                            </select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    <div className="flex gap-2 pt-2">
                      <Button
                        type="submit"
                        className="flex-1"
                        disabled={isPending}
                      >
                        {isPending && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Salvar Alterações
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setEditandoPorteiroId(null);
                          setTokenPorteiroEdicao("");
                          formEdicao.reset();
                          setActiveTab("lista");
                        }}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </form>
                </Form>
              ) : (
                <Form {...formCadastro}>
                  <form
                    onSubmit={formCadastro.handleSubmit(onCadastrarSubmit)}
                    className="space-y-3"
                  >
                    <FormField
                      control={
                        formCadastro.control as Control<RegistroPorteiroFormData>
                      }
                      name="nomeCompleto"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome Completo</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Nome do funcionário"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={
                        formCadastro.control as Control<RegistroPorteiroFormData>
                      }
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="email@provedor.com"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={
                        formCadastro.control as Control<RegistroPorteiroFormData>
                      }
                      name="cpf"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CPF</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="000.000.000-00"
                              {...field}
                              onChange={(e) =>
                                field.onChange(maskCPF(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={
                        formCadastro.control as Control<RegistroPorteiroFormData>
                      }
                      name="telefone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Telefone</FormLabel>
                          <FormControl>
                            <Input placeholder="(11) 99999-0000" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={
                        formCadastro.control as Control<RegistroPorteiroFormData>
                      }
                      name="senha"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Senha Provisória do Porteiro</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Mínimo 6 caracteres"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={
                        formCadastro.control as Control<RegistroPorteiroFormData>
                      }
                      name="moraNoCondominio"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 bg-muted/20">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={(checked) => {
                                field.onChange(checked);
                                if (!checked)
                                  formCadastro.setValue("id_unidade", "");
                              }}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              Este funcionário reside no condomínio?
                            </FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />

                    {watchMoraCadastro && (
                      <FormField
                        control={
                          formCadastro.control as Control<RegistroPorteiroFormData>
                        }
                        name="id_unidade"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Selecione a Unidade Habitacional
                            </FormLabel>
                            <select
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                              {...field}
                            >
                              <option value="">
                                -- Selecione o Apartamento --
                              </option>
                              {unidades.map((u) => (
                                <option key={u.id_unidade} value={u.id_unidade}>
                                  {u.bloco_torre} - Apt {u.numero_unidade}
                                </option>
                              ))}
                            </select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    <Button
                      type="submit"
                      className="w-full mt-2"
                      disabled={isPending}
                    >
                      {isPending && <Loader2 className="animate-spin mr-2" />}
                      Cadastrar Profissional
                    </Button>
                  </form>
                </Form>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="promover" className="pt-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-primary" /> Promover Morador
                existente para Portaria
              </CardTitle>
              <CardDescription>
                Se um morador foi contratado para a portaria, mude o cargo dele
                aqui. Isso dará acessos às telas de entregas mantendo o
                histórico residencial intacto.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {moradores.map((m) => (
                <div
                  key={m.id_usuario}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-muted/30 border rounded-xl gap-4"
                >
                  <div className="min-w-0">
                    <p className="font-bold truncate">{m.nome_completo}</p>
                    <div className="text-xs text-muted-foreground mt-0.5 flex flex-col sm:flex-row sm:items-center sm:gap-x-2 gap-y-0.5">
                      <span>CPF: {maskCPF(m.cpf)}</span>
                      <span className="hidden sm:inline">•</span>
                      <span className="break-all">{m.email}</span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 border-primary text-primary hover:bg-primary/10 shrink-0 self-start sm:self-auto"
                    onClick={() =>
                      handlePromoverMorador(m.id_usuario, m.nome_completo)
                    }
                    disabled={isPending}
                  >
                    <CheckCircle className="h-4 w-4" /> Tornar Porteiro
                  </Button>
                </div>
              ))}
              {moradores.length === 0 && (
                <p className="text-sm text-center text-muted-foreground py-6">
                  Nenhum morador comum disponível para alteração de perfil.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
