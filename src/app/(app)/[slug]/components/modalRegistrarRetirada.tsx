"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition, useEffect } from "react";
import { Encomenda, Unidade } from "@prisma/client";
import { Loader2 } from "lucide-react";

import {
  retiradaEncomendaSchema,
  RetiradaEncomendaFormData,
} from "../schemas/schemaRetiradaPorteiro";
import { registrarRetiradaEncomenda } from "../helpers/encomendas";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

type EncomendaParaRetirada = Encomenda & {
  unidade: Pick<Unidade, "bloco_torre" | "numero_unidade">;
};

interface ModalRegistrarRetiradaProps {
  encomenda: EncomendaParaRetirada | null;
  porteiroId: string;
  condominioId: string; 
  onOpenChange: (open: boolean) => void;
  onRetiradaSuccess: () => void;
}

export function ModalRegistrarRetirada({
  encomenda,
  porteiroId,
  onOpenChange,
  onRetiradaSuccess,
}: ModalRegistrarRetiradaProps) {
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm<RetiradaEncomendaFormData>({
    resolver: zodResolver(retiradaEncomendaSchema),
    defaultValues: {
      token_retirante: "",
    },
  });

  const isOpen = !!encomenda;

  useEffect(() => {
    if (isOpen && encomenda) {
      setErrorMessage(null);
      form.reset({ token_retirante: "" });
    }
  }, [isOpen, encomenda, form]);

  const onSubmit = (data: RetiradaEncomendaFormData) => {
    if (!encomenda) return;

    setErrorMessage(null);

    startTransition(async () => {
      try {
        const result = await registrarRetiradaEncomenda(
          data,
          encomenda.id_encomenda,
          porteiroId,
        );

        if (result.success) {
          alert(result.message);
          onRetiradaSuccess();
        }
      } catch (error) {
        const msg =
          error instanceof Error ? error.message : "Erro desconhecido";
        setErrorMessage(msg);
      }
    });
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Registrar Retirada</DialogTitle>
          <DialogDescription>
            Solicite o token de segurança para liberar a encomenda da unidade{" "}
            <strong>
              {encomenda?.unidade.bloco_torre} - {encomenda?.unidade.numero_unidade}
            </strong>
            .
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 pt-4"
          >
            <FormField
              control={form.control}
              name="token_retirante"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Token do Morador *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: 123456"
                      maxLength={6}
                      {...field}
                      disabled={isPending}
                      className="text-center text-lg font-bold tracking-widest"
                    />
                  </FormControl>
                  <FormDescription>
                    Peça ao morador o código de 6 dígitos gerado no aplicativo dele.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {errorMessage && (
              <p className="text-sm font-medium text-destructive">
                {errorMessage}
              </p>
            )}

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isPending}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Validar e Entregar
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}