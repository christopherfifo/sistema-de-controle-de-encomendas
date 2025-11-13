"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition, useEffect } from "react";
import { Encomenda, Unidade, Usuario } from "@prisma/client";
import { Loader2 } from "lucide-react";

import {
  retiradaEncomendaSchema,
  RetiradaEncomendaFormData,
} from "../schemas/schemaRetiradaPorteiro";
import {
  getMoradoresDaUnidade,
  registrarRetiradaEncomenda,
} from "../helpers/encomendas";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  condominioId,
  onOpenChange,
  onRetiradaSuccess,
}: ModalRegistrarRetiradaProps) {
  const [isPending, startTransition] = useTransition();
  const [isFetchingMoradores, setIsFetchingMoradores] = useState(false);
  const [moradores, setMoradores] = useState<Pick<Usuario, "id_usuario" | "nome_completo">[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm<RetiradaEncomendaFormData>({
    resolver: zodResolver(retiradaEncomendaSchema),
    defaultValues: {
      id_usuario_retirada: undefined,
      documento_retirante: "",
    },
  });

  const isOpen = !!encomenda;

  useEffect(() => {
    if (isOpen && encomenda) {
      setErrorMessage(null);
      setMoradores([]);
      form.reset();
      
      const fetchMoradores = async () => {
        setIsFetchingMoradores(true);
        try {
          const moradoresDaUnidade = await getMoradoresDaUnidade(
            encomenda.id_unidade,
            condominioId,
          );
          setMoradores(moradoresDaUnidade);
        } catch (error) {
          const msg = error instanceof Error ? error.message : "Erro desconhecido";
          setErrorMessage(`Erro ao buscar moradores: ${msg}`);
        } finally {
          setIsFetchingMoradores(false);
        }
      };
      
      fetchMoradores();
    }
  }, [isOpen, encomenda, condominioId, form]);

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
        const msg = error instanceof Error ? error.message : "Erro desconhecido";
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
            Confirme quem está retirando a encomenda para a unidade{" "}
            <strong>
              {encomenda?.unidade.bloco_torre} - {encomenda?.unidade.numero_unidade}
            </strong>
            .
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            
            <FormField
              control={form.control}
              name="id_usuario_retirada"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Morador *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isPending || isFetchingMoradores}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={
                          isFetchingMoradores 
                            ? "Carregando moradores..." 
                            : "Selecione o morador..."
                        } />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {moradores.length > 0 ? (
                        moradores.map((morador) => (
                          <SelectItem
                            key={morador.id_usuario}
                            value={morador.id_usuario}
                          >
                            {morador.nome_completo}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="null" disabled>
                          Nenhum morador encontrado
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="documento_retirante"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Documento (RG/CPF) *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Somente números"
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
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
              <Button type="submit" disabled={isPending || isFetchingMoradores}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Confirmar Retirada
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}