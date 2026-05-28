"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition, useEffect, useRef } from "react";
import { Encomenda, Unidade } from "@prisma/client";
import { Loader2, Camera, ScanQrCode, UserCheck } from "lucide-react";
import { Html5Qrcode } from "html5-qrcode"; 

import { RetiradaEncomendaFormData, retiradaEncomendaSchema } from "../schemas/schemaRetiradaPorteiro";
import { registrarRetiradaEncomenda } from "../helpers/encomendas";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  const [abaAtiva, setAbaAtiva] = useState<"TOKEN" | "MANUAL">("TOKEN");
  const [scannerAtivo, setScannerAtivo] = useState(false);
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);

  const form = useForm<any>({
    resolver: zodResolver(retiradaEncomendaSchema),
    defaultValues: {
      tipo_confirmacao: "TOKEN",
      token_retirante: "",
      cpf_retirante: "",
      id_usuario_retirada: null,
    },
  });

  const isOpen = !!encomenda;

  useEffect(() => {
    if (isOpen) {
      setErrorMessage(null);
      setScannerAtivo(false);
      form.reset({
        tipo_confirmacao: abaAtiva,
        token_retirante: "",
        cpf_retirante: "",
        id_usuario_retirada: null,
      });
    }
    return () => {
      stopScanner();
    };
  }, [isOpen, encomenda, abaAtiva]);

  const toggleScanner = async () => {
    if (scannerAtivo) {
      await stopScanner();
    } else {
      setScannerAtivo(true);
      setErrorMessage(null);

      setTimeout(async () => {
        const element = document.getElementById("reader-qr");
        if (!element) {
          setScannerAtivo(false);
          return;
        }

        try {
          const html5QrCode = new Html5Qrcode("reader-qr");
          html5QrCodeRef.current = html5QrCode;

          await html5QrCode.start(
            { facingMode: "environment" },
            {
              fps: 10,
              qrbox: { width: 220, height: 220 },
            },
            (decodedText) => {
              form.setValue("token_retirante", decodedText);
              stopScanner();
            },
            () => {
            }
          );
        } catch (err: any) {
          console.error("Erro ao acessar a câmera de vídeo:", err);
          setErrorMessage("Não foi possível acessar a câmera. Verifique as permissões do navegador.");
          setScannerAtivo(false);
          html5QrCodeRef.current = null;
        }
      }, 300);
    }
  };

  const stopScanner = async () => {
    if (html5QrCodeRef.current) {
      if (html5QrCodeRef.current.isScanning) {
        try {
          await html5QrCodeRef.current.stop();
        } catch (err) {
          console.error("Erro ao parar câmera:", err);
        }
      }
      html5QrCodeRef.current = null;
    }
    setScannerAtivo(false);
  };

  const onSubmit = (data: any) => {
    if (!encomenda) return;
    setErrorMessage(null);
    stopScanner();

    startTransition(async () => {
      try {
        const result = await registrarRetiradaEncomenda(data, encomenda.id_encomenda, porteiroId);
        if (result.success) {
          alert(result.message);
          onRetiradaSuccess();
        }
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : "Erro desconhecido");
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) { stopScanner(); onOpenChange(false); } }}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Registrar Saída de Encomenda</DialogTitle>
          <DialogDescription>
            Unidade: <strong>{encomenda?.unidade.bloco_torre} - {encomenda?.unidade.numero_unidade}</strong>
          </DialogDescription>
        </DialogHeader>

        <Tabs 
          value={abaAtiva} 
          onValueChange={(v) => {
            const novaAba = v as "TOKEN" | "MANUAL";
            setAbaAtiva(novaAba);
            form.setValue("tipo_confirmacao", novaAba);
            stopScanner();
          }} 
          className="w-full"
        >
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="TOKEN" className="gap-2">
              <ScanQrCode className="h-4 w-4" /> Token / QR Code
            </TabsTrigger>
            <TabsTrigger value="MANUAL" className="gap-2">
              <UserCheck className="h-4 w-4" /> Sem Celular (Manual)
            </TabsTrigger>
          </TabsList>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
              
              <TabsContent value="TOKEN" className="space-y-4 m-0">
                <div className="flex flex-col items-center gap-2">
                  <Button type="button" variant="outline" className="w-full gap-2" onClick={toggleScanner}>
                    <Camera className="h-4 w-4" />
                    {scannerAtivo ? "Desligar Câmera Reader" : "Escanear QR Code com a Câmera"}
                  </Button>
                  
                  {scannerAtivo && (
                    <div 
                      id="reader-qr" 
                      className="w-full overflow-hidden rounded-md border bg-black mt-2 min-h-[250px] relative [&_video]:w-full [&_video]:object-cover"
                    />
                  )}
                </div>

                <FormField
                  control={form.control}
                  name="token_retirante"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Código do Morador (8 dígitos)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ex: 12345678"
                          maxLength={8}
                          {...field}
                          value={field.value || ""}
                          disabled={isPending}
                          className="text-center text-xl font-bold tracking-widest"
                        />
                      </FormControl>
                      <FormDescription>Digite ou use a câmera para capturar o código.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="MANUAL" className="space-y-4 m-0">
                <FormField
                  control={form.control}
                  name="cpf_retirante"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CPF do Retirante *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="000.000.000-00"
                          {...field}
                          value={field.value || ""}
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormDescription>Digite o CPF do morador para validar a entrega sem o token do celular.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              {errorMessage && (
                <p className="text-sm font-medium text-destructive bg-destructive/10 p-2 rounded border border-destructive/20 text-center">
                  ⚠️ {errorMessage}
                </p>
              )}

              <DialogFooter className="pt-4 gap-2 sm:gap-0">
                <Button type="button" variant="outline" onClick={() => { stopScanner(); onOpenChange(false); }} disabled={isPending}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Confirmar e Entregar
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
