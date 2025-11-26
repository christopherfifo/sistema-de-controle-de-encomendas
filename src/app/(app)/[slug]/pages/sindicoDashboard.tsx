"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, PlusCircle, Home, Maximize2 } from "lucide-react";

import {
  registroUnidadeSchema,
  RegistroUnidadeFormData,
} from "../schemas/schemaSindico";
import { adicionarUnidade, getSindicoData } from "../helpers/actionSindico";

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

type CondominioData = Awaited<ReturnType<typeof getSindicoData>>;

interface SindicoDashboardProps {
  condominioData: CondominioData & { id_condominio: string };
  sindicoId: string;

}

export function SindicoDashboard({
  condominioData,
  sindicoId,
}: SindicoDashboardProps) {
  const [isPending, startTransition] = useTransition();
  const form = useForm<RegistroUnidadeFormData>({
    resolver: zodResolver(registroUnidadeSchema),
    defaultValues: {
      bloco_torre: "",
      numero_unidade: "",
    },
  });

  const onSubmit = (data: RegistroUnidadeFormData) => {
    startTransition(async () => {
      const result = await adicionarUnidade(
        data,
        condominioData.id_condominio,
        sindicoId,
      );

      if (result.success) {
        alert(result.message);
        form.reset();
      } else {
        alert(`Erro: ${result.message}`);
      }
    });
  };

  const unidadesAtuais = condominioData.unidades.length;
  const limiteMaximo = condominioData.plano?.limite_unidades ?? 0;
  const unidadesRestantes = limiteMaximo - unidadesAtuais;

  const nomePlano = condominioData.plano?.nome_plano ?? "Plano não definido";

  return (
    <>
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Configuração do Condomínio
          </h2>
          <p className="text-muted-foreground">
            Gerencie unidades, blocos e limites de {condominioData.nome_condominio}
          </p>
        </div>
      </div>

      <Separator />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Card de Resumo de Unidades */}
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Limite de Unidades
            </CardTitle>
            <Maximize2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {unidadesAtuais} / {limiteMaximo}
            </div>
            <p className="text-xs text-muted-foreground">
              {unidadesRestantes} unidades restantes no {nomePlano}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PlusCircle className="h-5 w-5" />
              Adicionar Unidade
            </CardTitle>
            <CardDescription>
              Cadastre um novo bloco/torre e número de apartamento.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="bloco_torre"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bloco / Torre *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ex: Bloco A, Torre 1"
                          {...field}
                          disabled={isPending || unidadesRestantes <= 0 || limiteMaximo === 0}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="numero_unidade"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número da Unidade *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ex: 101, 204"
                          {...field}
                          disabled={isPending || unidadesRestantes <= 0 || limiteMaximo === 0}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isPending || unidadesRestantes <= 0 || limiteMaximo === 0}
                >
                  {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {limiteMaximo === 0
                    ? "Plano Inválido"
                    : unidadesRestantes <= 0
                    ? "Limite Atingido"
                    : "Cadastrar Unidade"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="h-5 w-5" />
            Unidades Cadastradas ({unidadesAtuais})
          </CardTitle>
          <CardDescription>
            Todas as unidades registradas no condomínio.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 max-h-96 overflow-y-auto p-2">
            {condominioData.unidades.map((unidade) => (
              <div
                key={unidade.id_unidade}
                className="p-3 bg-muted/50 rounded-lg text-center shadow-sm hover:bg-muted transition-colors border"
              >
                <div className="font-semibold text-primary">
                  {unidade.bloco_torre}
                </div>
                <div className="text-lg font-bold">
                  {unidade.numero_unidade}
                </div>
              </div>
            ))}
          </div>
          {condominioData.unidades.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              Nenhuma unidade cadastrada. Adicione uma acima.
            </p>
          )}
        </CardContent>
      </Card>
    </>
  );
}