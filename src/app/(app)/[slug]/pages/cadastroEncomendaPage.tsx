"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, PackagePlus } from "lucide-react";

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

  const form = useForm<CadastroEncomendaFormData>({
    resolver: zodResolver(cadastroEncomendaSchema),
    defaultValues: {
      id_unidade: unidadesDoMorador[0]?.unidade.id_unidade || "",
      tipo_encomenda: "Pacote",
      forma_entrega: "Correios",
      tamanho: "Médio",
      codigo_rastreio: "",
      condicao: "",
    },
  });

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
    <Card>
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
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="id_unidade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unidade de Destino</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
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
                          {u.unidade.bloco_torre} - {u.unidade.numero_unidade}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                    <FormLabel>Tipo de Encomenda</FormLabel>
                    <Input
                      {...field}
                      placeholder="Ex: Pacote, Caixa, Envelope"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="forma_entrega"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Forma de Entrega</FormLabel>
                    <Input {...field} placeholder="Ex: Correios, Amazon, ML" />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="tamanho"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tamanho</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
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
                name="codigo_rastreio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Código de Rastreio (Opcional)</FormLabel>
                    <Input {...field} placeholder="BR123456789BR" />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="condicao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações (Opcional)</FormLabel>
                  <Textarea
                    {...field}
                    placeholder="Ex: Pacote frágil, deixar com vizinho, etc."
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isPending} className="w-full">
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Cadastrar Encomenda
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
