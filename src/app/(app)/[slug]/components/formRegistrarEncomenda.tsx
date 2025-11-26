"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { Unidade } from "@prisma/client";
import { Loader2 } from "lucide-react";

import {
  registroEncomendaSchema,
  RegistroEncomendaFormData,
} from "../schemas/schemaRegistroPorteiro";
import { registrarEncomendaPorteiro } from "../helpers/encomendas";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type FormRegistrarEncomendaProps = {
  unidades: Pick<Unidade, "id_unidade" | "bloco_torre" | "numero_unidade">[];
  porteiroId: string;
  condominioId: string;
};

export function FormRegistrarEncomenda({
  unidades,
  porteiroId,
  condominioId,
}: FormRegistrarEncomendaProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<RegistroEncomendaFormData>({
    resolver: zodResolver(registroEncomendaSchema),
    defaultValues: {
      id_unidade: undefined,
      tipo_encomenda: "",
      forma_entrega: "",
      tamanho: "Pequeno",
      codigo_rastreio: "",
      condicao: "",
    },
  });

  const onSubmit = (data: RegistroEncomendaFormData) => {
    startTransition(async () => {
      try {
        const result = await registrarEncomendaPorteiro(
          porteiroId,
          condominioId,
          data,
        );

        if (result.success) {
          alert(result.message);
          form.reset();
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Ocorreu um erro desconhecido";
        alert(`Erro: ${errorMessage}`);
      }
    });
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Registrar Recebimento de Pacote</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="id_unidade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unidade de Destino *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isPending}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a unidade..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {unidades.map((unidade) => (
                        <SelectItem
                          key={unidade.id_unidade}
                          value={unidade.id_unidade}
                        >
                          {unidade.bloco_torre} - {unidade.numero_unidade}
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
                    <FormLabel>Tipo *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Caixa, Envelope, Pacote"
                        {...field}
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tamanho"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tamanho *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isPending}
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
            </div>

            <FormField
              control={form.control}
              name="forma_entrega"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Transportadora / Origem *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Correios, Mercado Livre, Amazon..."
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
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
                    <Input
                      placeholder="QB123456789BR"
                      {...field}
                      value={field.value ?? ""}
                      disabled={isPending}
                    />
                  </FormControl>
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
                    <Textarea
                      placeholder="Ex: Caixa amassada, pacote frágil..."
                      {...field}
                      value={field.value ?? ""}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormDescription>
                    Alguma observação sobre a condição do pacote?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Registrar Encomenda
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
