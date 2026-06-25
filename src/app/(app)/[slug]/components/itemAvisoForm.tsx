"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition, useState } from "react";
import { Loader2, Camera, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  confirmarChegadaSchema,
  ConfirmarChegadaFormData,
} from "../schemas/schemaRetiradaPorteiro";
import { confirmarChegadaEncomendaMorador } from "../helpers/encomendas";

interface ItemAvisoFormProps {
  encomendaId: string;
  porteiroId: string;
  onSuccess: (encomendaId: string) => void;
}

export function ItemAvisoForm({
  encomendaId,
  porteiroId,
  onSuccess,
}: ItemAvisoFormProps) {
  const [isPending, startTransition] = useTransition();
  const [fileName, setFileName] = useState<string | null>(null);

  const form = useForm<ConfirmarChegadaFormData>({
    resolver: zodResolver(confirmarChegadaSchema),
    defaultValues: {
      condicaoPorteiro: "",
    },
  });

  const onSubmit = (data: ConfirmarChegadaFormData) => {
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("condicaoPorteiro", data.condicaoPorteiro);

        if (
          data.foto_pacote &&
          data.foto_pacote instanceof FileList &&
          data.foto_pacote.length > 0
        ) {
          formData.append("foto", data.foto_pacote[0]);
        }

        const result = await confirmarChegadaEncomendaMorador(
          encomendaId,
          porteiroId,
          formData,
        );

        if (result.success) {
          alert(result.message);
          onSuccess(encomendaId);
        }
      } catch (error) {
        alert(
          error instanceof Error
            ? error.message
            : "Erro ao confirmar recebimento",
        );
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <h4 className="text-sm font-semibold">Confirmar Entrada Física:</h4>

        <FormField
          control={form.control}
          name="condicaoPorteiro"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Condição/Estado do Pacote *</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Ex: Caixa em perfeito estado, sem avarias..."
                  disabled={isPending}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="foto_pacote"
          render={({ field: { ref, name, onBlur, onChange } }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2 cursor-pointer border p-2 rounded-md hover:bg-muted w-fit transition-colors">
                <Camera className="h-4 w-4" />
                <span>
                  {fileName ? "Alterar Foto" : "Capturar / Fazer Upload"}
                </span>
              </FormLabel>

              {fileName && (
                <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>{fileName} selecionada</span>
                </div>
              )}

              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  ref={ref}
                  name={name}
                  onBlur={onBlur}
                  disabled={isPending}
                  onChange={(e) => {
                    const files = e.target.files;
                    if (files && files.length > 0) {
                      setFileName(files[0].name);
                      onChange(files);
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          size="sm"
          className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-medium"
          disabled={isPending}
        >
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Confirmar Chegada e Notificar
        </Button>
      </form>
    </Form>
  );
}
