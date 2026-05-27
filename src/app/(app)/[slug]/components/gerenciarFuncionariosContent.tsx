"use client";

import { useState, useTransition } from "react";
import { useForm, Control } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, ShieldAlert, UserX, UserCheck, Trash2, Edit2, UserPlus, CheckCircle } from "lucide-react";

import { registroPorteiroSchema, edicaoPorteiroSchema, RegistroPorteiroFormData, EdicaoPorteiroFormData } from "../schemas/schemaPorteiro";
import { adicionarPorteiro, atualizarPorteiro, transformarMoradorEmPorteiro, alternarStatusPorteiro, excluirPorteiro } from "../helpers/actionPorteiro";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { maskCPF } from "@/helpers/cpf";

interface GerenciarFuncionariosContentProps {
  porteiros: any[];
  moradores: any[];
  unidades: any[];
  condominioId: string;
  sindicoId: string;
  nomeCondominio: string;
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
  const [editandoPorteiroId, setEditandoPorteiroId] = useState<string | null>(null);

  const formCadastro = useForm<RegistroPorteiroFormData>({
    resolver: zodResolver(registroPorteiroSchema),
    defaultValues: { 
      nomeCompleto: "", 
      email: "", 
      cpf: "", 
      telefone: "", 
      senha: "", 
      moraNoCondominio: false, 
      id_unidade: "" 
    }
  });

  const formEdicao = useForm<EdicaoPorteiroFormData>({
    resolver: zodResolver(edicaoPorteiroSchema),
    defaultValues: { 
      id_usuario: "", 
      nomeCompleto: "", 
      email: "", 
      telefone: "", 
      moraNoCondominio: false, 
      id_unidade: "" 
    }
  });

  const watchMoraCadastro = formCadastro.watch("moraNoCondominio");
  const watchMoraEdicao = formEdicao.watch("moraNoCondominio");

  const handleEntrarModoEdicao = (porteiro: any) => {
    setEditandoPorteiroId(porteiro.id_usuario);
    const primeiraUnidade = porteiro.unidades_residenciais?.[0]?.id_unidade || "";
    
    formEdicao.reset({
      id_usuario: porteiro.id_usuario,
      nomeCompleto: porteiro.nome_completo,
      email: porteiro.email,
      telefone: porteiro.telefone,
      moraNoCondominio: porteiro.unidades_residenciais?.length > 0,
      id_unidade: primeiraUnidade
    });
    setActiveTab("formulario");
  };

  const onCadastrarSubmit = (data: RegistroPorteiroFormData) => {
    const dadosTratados = {
      ...data,
      id_unidade: data.moraNoCondominio ? data.id_unidade : "",
    };

    startTransition(async () => {
      const res = await adicionarPorteiro(dadosTratados, condominioId, sindicoId);
      alert(res.message);
      if (res.success) { formCadastro.reset(); setActiveTab("lista"); }
    });
  };

  const onEditarSubmit = (data: EdicaoPorteiroFormData) => {
    const dadosTratados = {
      ...data,
      id_unidade: data.moraNoCondominio ? data.id_unidade : "",
    };

    startTransition(async () => {
      const res = await atualizarPorteiro(dadosTratados, condominioId, sindicoId);
      alert(res.message);
      if (res.success) { setEditandoPorteiroId(null); formEdicao.reset(); setActiveTab("lista"); }
    });
  };

  const handlePromoverMorador = (moradorId: string, nome: string) => {
    if (confirm(`Confirmar a contratação de "${nome}" como Porteiro do sistema? Ele manterá os dados de moradia originais.`)) {
      startTransition(async () => {
        const res = await transformarMoradorEmPorteiro(moradorId, condominioId, sindicoId);
        alert(res.message);
      });
    }
  };

  const handleAlternarStatus = (id: string, ativo: boolean) => {
    if (confirm("Deseja alterar o status de atividade deste funcionário?")) {
      startTransition(async () => { await alternarStatusPorteiro(id, ativo, condominioId); });
    }
  };

  const handleExcluir = (id: string) => {
    if (confirm("Excluir permanentemente? Se houver histórico no banco, o sistema impedirá por segurança.")) {
      startTransition(async () => { const res = await excluirPorteiro(id, condominioId); alert(res.message); });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Recursos Humanos & Portaria</h2>
        <p className="text-muted-foreground">Gerenciamento completo e atribuições de cargos de {nomeCondominio}</p>
      </div>

      <Separator />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="lista">Equipe Atual</TabsTrigger>
          <TabsTrigger value="formulario">{editandoPorteiroId ? "Editando Funcionário" : "Novo Porteiro"}</TabsTrigger>
          <TabsTrigger value="promover">Contratar Morador</TabsTrigger>
        </TabsList>

        <TabsContent value="lista" className="space-y-4 pt-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><ShieldAlert className="h-5 w-5 text-primary" /> Funcionários da Portaria</CardTitle>
              <CardDescription>Visualize o status de acesso e complemente informações de habitação dos porteiros.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {porteiros.map((p) => {
                const mora = p.unidades_residenciais?.length > 0;
                return (
                  <div key={p.id_usuario} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-muted/40 border rounded-xl gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-lg">{p.nome_completo}</span>
                        <span className={`text-[10px] px-2 py-0.5 font-bold rounded-full ${p.ativo ? "bg-green-100 text-green-700" : "bg-destructive/10 text-destructive"}`}>
                          {p.ativo ? "Ativo" : "Bloqueado"}
                        </span>
                        {mora && (
                          <span className="text-[10px] px-2 py-0.5 font-bold bg-blue-100 text-blue-700 rounded-full">
                            Mora no local ({p.unidades_residenciais[0].unidade.bloco_torre} - Apt {p.unidades_residenciais[0].unidade.numero_unidade})
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">CPF: {maskCPF(p.cpf)} • Email: {p.email} • Tel: {p.telefone}</p>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <Button variant="outline" size="icon" onClick={() => handleEntrarModoEdicao(p)} title="Editar dados cadastrais / Moradia">
                        <Edit2 className="h-4 w-4 text-primary" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => handleAlternarStatus(p.id_usuario, p.ativo)}>
                        {p.ativo ? <UserX className="h-4 w-4 text-destructive" /> : <UserCheck className="h-4 w-4 text-green-600" />}
                      </Button>
                      <Button variant="destructive" size="icon" onClick={() => handleExcluir(p.id_usuario)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
              {porteiros.length === 0 && <p className="text-sm text-center text-muted-foreground py-6">Nenhum porteiro cadastrado.</p>}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="formulario" className="pt-2">
          <Card className="max-w-xl">
            <CardHeader>
              <CardTitle>{editandoPorteiroId ? "Alterar Dados Básicos e Moradia" : "Cadastrar Novo Porteiro Profissional"}</CardTitle>
              <CardDescription>
                {editandoPorteiroId ? "CPFs e senhas são criptografados e não podem ser alterados pelo administrador." : "Crie uma conta nova de funcionário com senha provisória de acesso."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {editandoPorteiroId ? (
                <Form {...formEdicao}>
                  <form onSubmit={formEdicao.handleSubmit(onEditarSubmit)} className="space-y-4">
                    <FormField control={formEdicao.control as Control<any>} name="nomeCompleto" render={({ field }) => (
                      <FormItem><FormLabel>Nome Completo</FormLabel><FormControl><Input {...field} disabled={isPending} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={formEdicao.control as Control<any>} name="email" render={({ field }) => (
                      <FormItem><FormLabel>Email de Acesso</FormLabel><FormControl><Input type="email" {...field} disabled={isPending} /></FormControl><FormMessage /></FormItem>
                    )} />
                    
                    <FormField control={formEdicao.control as Control<any>} name="telefone" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telefone</FormLabel>
                        <FormControl>
                          <Input {...field} disabled={isPending} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField control={formEdicao.control as Control<any>} name="moraNoCondominio" render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 bg-muted/20">
                        <FormControl>
                          <Checkbox 
                            checked={field.value} 
                            onCheckedChange={(checked) => {
                              field.onChange(checked);
                              if (!checked) formEdicao.setValue("id_unidade", "");
                            }} 
                            disabled={isPending} 
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none"><FormLabel>Este funcionário reside no condomínio?</FormLabel></div>
                      </FormItem>
                    )} />

                    {watchMoraEdicao && (
                      <FormField control={formEdicao.control as Control<any>} name="id_unidade" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Selecione a Unidade Habitacional</FormLabel>
                          <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" {...field} disabled={isPending}>
                            <option value="">-- Selecione o Apartamento --</option>
                            {unidades.map(u => <option key={u.id_unidade} value={u.id_unidade}>{u.bloco_torre} - Apt {u.numero_unidade}</option>)}
                          </select>
                          <FormMessage />
                        </FormItem>
                      )} />
                    )}

                    <div className="flex gap-2 pt-2">
                      <Button type="submit" className="flex-1" disabled={isPending}>{isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Salvar Alterações</Button>
                      <Button type="button" variant="outline" onClick={() => { setEditandoPorteiroId(null); formEdicao.reset(); setActiveTab("lista"); }}>Cancelar</Button>
                    </div>
                  </form>
                </Form>
              ) : (
                <Form {...formCadastro}>
                  <form onSubmit={formCadastro.handleSubmit(onCadastrarSubmit)} className="space-y-3">
                    <FormField control={formCadastro.control as Control<any>} name="nomeCompleto" render={({ field }) => (
                      <FormItem><FormLabel>Nome Completo</FormLabel><FormControl><Input placeholder="Nome do funcionário" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={formCadastro.control as Control<any>} name="email" render={({ field }) => (
                      <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" placeholder="email@provedor.com" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={formCadastro.control as Control<any>} name="cpf" render={({ field }) => (
                      <FormItem><FormLabel>CPF</FormLabel><FormControl><Input placeholder="000.000.000-00" {...field} onChange={e => field.onChange(maskCPF(e.target.value))} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={formCadastro.control as Control<any>} name="telefone" render={({ field }) => (
                      <FormItem><FormLabel>Telefone</FormLabel><FormControl><Input placeholder="(11) 99999-0000" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={formCadastro.control as Control<any>} name="senha" render={({ field }) => (
                      <FormItem><FormLabel>Senha Provisória do Porteiro</FormLabel><FormControl><Input type="password" placeholder="Mínimo 6 caracteres" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />

                    <FormField control={formCadastro.control as Control<any>} name="moraNoCondominio" render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 bg-muted/20">
                        <FormControl>
                          <Checkbox 
                            checked={field.value} 
                            onCheckedChange={(checked) => {
                              field.onChange(checked);
                              if (!checked) formCadastro.setValue("id_unidade", "");
                            }} 
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none"><FormLabel>Este funcionário reside no condomínio?</FormLabel></div>
                      </FormItem>
                    )} />

                    {watchMoraCadastro && (
                      <FormField control={formCadastro.control as Control<any>} name="id_unidade" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Selecione a Unidade Habitacional</FormLabel>
                          <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" {...field}>
                            <option value="">-- Selecione o Apartamento --</option>
                            {unidades.map(u => <option key={u.id_unidade} value={u.id_unidade}>{u.bloco_torre} - Apt {u.numero_unidade}</option>)}
                          </select>
                          <FormMessage />
                        </FormItem>
                      )} />
                    )}

                    <Button type="submit" className="w-full mt-2" disabled={isPending}>{isPending && <Loader2 className="animate-spin mr-2" />}Cadastrar Profissional</Button>
                  </form>
                </Form>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="promover" className="pt-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><UserPlus className="h-5 w-5 text-primary" /> Promover Morador existente para Portaria</CardTitle>
              <CardDescription>Se um morador foi contratado para a portaria, mude o cargo dele aqui. Isso dará acessos às telas de entregas mantendo o histórico residencial intacto.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {moradores.map((m) => (
                <div key={m.id_usuario} className="flex items-center justify-between p-4 bg-muted/30 border rounded-xl">
                  <div>
                    <p className="font-bold">{m.nome_completo}</p>
                    <p className="text-xs text-muted-foreground">CPF: {maskCPF(m.cpf)} • {m.email}</p>
                  </div>
                  <Button variant="outline" size="sm" className="gap-2 border-primary text-primary hover:bg-primary/10" onClick={() => handlePromoverMorador(m.id_usuario, m.nome_completo)} disabled={isPending}>
                    <CheckCircle className="h-4 w-4" /> Tornar Porteiro
                  </Button>
                </div>
              ))}
              {moradores.length === 0 && <p className="text-sm text-center text-muted-foreground py-6">Nenhum morador comum disponível para alteração de perfil.</p>}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}