"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, PackagePlus, CheckCircle } from "lucide-react";

import {
  cadastroEncomendaSchema,
  CadastroEncomendaFormData,
} from "../schemas/schemaCadastroEncomendas";

import { cadastrarEncomendaMorador } from "../helpers/encomendas";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type UnidadeProps = {
  unidade: {
    id_unidade: string;
    bloco_torre: string;
    numero_unidade: string;
  };
};

interface CadastroEncomendaPageProps {
  unidadesDoMorador: UnidadeProps[];
  userId: string;
  condominioSlug: string;
}

export function CadastroEncomendaPageContent({
  unidadesDoMorador,
  userId,
  condominioSlug,
}: CadastroEncomendaPageProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const [rastreioVerificado, setRastreioVerificado] = useState<boolean | null>(null);
  const [checandoRastreio, setChecandoRastreio] = useState(false);

  const form = useForm<CadastroEncomendaFormData>({
    resolver: zodResolver(cadastroEncomendaSchema),
    defaultValues: {
      id_unidade: unidadesDoMorador[0]?.unidade.id_unidade || "",
      tipo_encomenda: "",
      forma_entrega: "",
      tamanho: "",
      codigo_rastreio: "",
      condicao: "",
    },
  });

  const handleValidarRastreio = async (e: React.FocusEvent<HTMLInputElement>) => {
    const codigo = e.target.value.trim();
    if (!codigo || codigo.length < 5) {
      setRastreioVerificado(null);
      return;
    }

    setChecandoRastreio(true);
    try {
      const resposta = await fetch(`/api/rastreio?codigo=${codigo}`);
      const dados = await resposta.json();
      
      if (dados.valido) {
        setRastreioVerificado(true);
        form.setValue("forma_entrega", "Correios");
      } else {
        setRastreioVerificado(false);
      }
    } catch (_err) {
      setRastreioVerificado(null);
    } finally {
      setChecandoRastreio(false);
    }
  };

  const onSubmit = (data: CadastroEncomendaFormData) => {
    startTransition(async () => {
      try {
        await cadastrarEncomendaMorador(userId, condominioSlug, data);
        alert("Encomenda pré-cadastrada com sucesso!");
        router.push(`/${condominioSlug}?user=${userId}&perfil=MORADOR`);
      } catch (error) {
        if (error instanceof Error) {
          alert(`Erro: ${error.message}`);
        } else {
          alert("Ocorreu um erro desconhecido.");
        }
      }
    });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-sm border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PackagePlus className="h-5 w-5" />
          Pré-cadastro de Encomenda
        </CardTitle>
        <CardDescription>
          Avise a portaria sobre uma encomenda que você está esperando.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="id_unidade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unidade de Destino *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || undefined}
                    disabled={unidadesDoMorador.length === 1}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a unidade..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {unidadesDoMorador.map((u) => (
                        <SelectItem
                          key={u.unidade.id_unidade}
                          value={u.unidade.id_unidade}
                        >
                          Bloco {u.unidade.bloco_torre} - Apt {u.unidade.numero_unidade}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="codigo_rastreio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Código de Rastreio (Opcional)</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        placeholder="Ex: AA123456789BR" 
                        {...field} 
                        disabled={isPending}
                        onBlur={(e) => {
                          field.onBlur();
                          handleValidarRastreio(e);
                        }}
                      />
                      {checandoRastreio && <Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin text-muted-foreground" />}
                    </div>
                  </FormControl>
                  {rastreioVerificado === true && (
                    <p className="text-xs font-medium text-emerald-600 flex items-center gap-1 mt-1">
                      <CheckCircle className="h-3.5 w-3.5" /> Objeto localizado nos Correios! Empresa alterada automaticamente.
                    </p>
                  )}
                  {rastreioVerificado === false && (
                    <p className="text-xs font-medium text-amber-600 mt-1">
                      ⚠️ Código digitado não encontrado ou não pertence aos Correios.
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="tipo_encomenda"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Encomenda *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || undefined}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="PACOTE">📦 Pacote / Caixa</SelectItem>
                        <SelectItem value="ENVELOPE">✉️ Envelope / Carta</SelectItem>
                        <SelectItem value="SACOLA">🛍️ Sacola / Alimento</SelectItem>
                        <SelectItem value="OUTRO">🏷️ Outros Volumes</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="forma_entrega"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Transportadora / Origem *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || undefined}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Correios">💛 Correios</SelectItem>
                        <SelectItem value="Mercado Livre">💛 Mercado Livre</SelectItem>
                        <SelectItem value="Amazon">💙 Amazon</SelectItem>
                        <SelectItem value="Shopee">🧡 Shopee</SelectItem>
                        <SelectItem value="Entregador Particular">🛵 Entregador / Motoboy</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="tamanho"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tamanho *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || undefined}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tamanho..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Pequeno">Pequeno</SelectItem>
                      <SelectItem value="Médio">Médio</SelectItem>
                      <SelectItem value="Grande">Grande</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="condicao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações (Opcional)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="Ex: Pacote frágil, deixar com vizinho, etc."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isPending} className="w-full font-semibold mt-2">
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Cadastrar Encomenda
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
