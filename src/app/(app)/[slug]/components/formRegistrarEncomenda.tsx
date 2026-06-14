"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition, useEffect } from "react";
import {
  Camera,
  Loader2,
  Search,
  ImageIcon,
  UserPlus,
  CheckCircle,
} from "lucide-react";

import { registroEncomendaSchema, RegistroEncomendaFormData } from "../schemas/schemaRegistroPorteiro";
import {
  registrarEncomendaPorteiro,
  buscarMoradoresPorNome,
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
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

type MoradorBusca = {
  id_usuario: string;
  nome_completo: string;
  bloco: string;
  apartamento: string;
};

interface FormRegistrarEncomendaProps {
  unidades: unknown[];
  porteiroId: string;
  condominioId: string;
}

export function FormRegistrarEncomenda({
  porteiroId,
  condominioId,
}: FormRegistrarEncomendaProps) {
  const [isPending, startTransition] = useTransition();
  const [termoBusca, setTermoBusca] = useState("");
  const [listaMoradores, setListaMoradores] = useState<MoradorBusca[]>([]);
  const [previewFoto, setPreviewFoto] = useState<string | null>(null);
  const [modoManual, setModoManual] = useState(false);
  const [rastreioVerificado, setRastreioVerificado] = useState<boolean | null>(
    null,
  );
  const [checandoRastreio, setChecandoRastreio] = useState(false);

  const form = useForm({
    resolver: zodResolver(registroEncomendaSchema),
    defaultValues: {
      id_usuario_morador: "",
      nome_manual_retirante: "",
      bloco_manual: "",
      apartamento_manual: "",
      tipo_encomenda: "",
      forma_entrega: "",
      codigo_rastreio: "",
      condicao: "",
      foto_pacote: "",
    },
  });

useEffect(() => {
    const moradorJaSelecionado = form.getValues("nome_manual_retirante") === termoBusca;

    if (termoBusca.trim().length >= 2 && !modoManual && !moradorJaSelecionado) {
      const delayDebounce = setTimeout(async () => {
        const dados = await buscarMoradoresPorNome(condominioId, termoBusca);
        setListaMoradores(dados);
      }, 300);
      return () => clearTimeout(delayDebounce);
    } else {
      setListaMoradores([]);
    }
  }, [termoBusca, condominioId, modoManual, form.getValues]);

  const handleValidarRastreio = async (
    e: React.FocusEvent<HTMLInputElement>,
  ) => {
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
    } catch {
      setRastreioVerificado(null);
    } finally {
      setChecandoRastreio(false);
    }
  };

  const handleSelecionarMorador = (morador: MoradorBusca) => {
    setModoManual(false);
    form.setValue("id_usuario_morador", morador.id_usuario);
    form.setValue("nome_manual_retirante", morador.nome_completo);
    form.setValue("bloco_manual", morador.bloco);
    form.setValue("apartamento_manual", morador.apartamento);
    setTermoBusca(morador.nome_completo);
    setListaMoradores([]);
  };

  const ativarInsercaoManual = () => {
    setModoManual(true);
    setListaMoradores([]);
    form.setValue("id_usuario_morador", null as unknown as string);
    form.setValue("bloco_manual", "");
    form.setValue("apartamento_manual", "");
  };

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewFoto(reader.result as string);
        form.setValue("foto_pacote", reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data: RegistroEncomendaFormData) => {
    startTransition(async () => {
      try {
        const res = await registrarEncomendaPorteiro(
          porteiroId,
          condominioId,
          data,
        );
        if (res.success) {
          alert(res.message);
          form.reset();
          setTermoBusca("");
          setPreviewFoto(null);
          setModoManual(false);
          setRastreioVerificado(null);
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          alert(err.message);
        } else {
          alert("Erro ao salvar");
        }
      }
    });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-sm border">
      <CardHeader>
        <CardTitle>Registrar Encomenda Surpresa</CardTitle>
        <CardDescription>
          Busque pelo nome do morador para carregar os dados automáticos ou
          digite manualmente.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="relative space-y-1.5">
              <FormLabel>Nome do Morador Destinatário *</FormLabel>
              <div className="relative">
                <Input
                  placeholder="Digite para pesquisar (Ex: Raquel...)"
                  value={termoBusca}
                  onChange={(e) => {
                    setTermoBusca(e.target.value);
                    if (modoManual)
                      form.setValue("nome_manual_retirante", e.target.value);
                  }}
                  disabled={isPending}
                  className="pl-9 font-medium"
                />
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              </div>

              {listaMoradores.length > 0 && (
                <div className="absolute z-50 w-full bg-background border rounded-md shadow-lg max-h-48 overflow-y-auto mt-1 divide-y">
                  {listaMoradores.map((m) => (
                    <button
                      key={m.id_usuario}
                      type="button"
                      onClick={() => handleSelecionarMorador(m)}
                      className="flex items-center justify-between w-full p-2.5 text-left text-sm hover:bg-muted transition-colors"
                    >
                      <span className="font-medium">{m.nome_completo}</span>
                      <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded font-mono">
                        Bloco {m.bloco} - Apt {m.apartamento}
                      </span>
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={ativarInsercaoManual}
                    className="flex items-center gap-2 w-full p-2.5 text-left text-xs text-sky-600 bg-sky-50/50 hover:bg-sky-50 font-semibold"
                  >
                    <UserPlus className="h-3.5 w-3.5" /> Não encontrou? Digitar
                    bloco/apartamento na mão
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="bloco_manual"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bloco / Torre *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex: Bloco Z"
                        {...field}
                        disabled={
                          isPending ||
                          (!modoManual &&
                            !!form.getValues("id_usuario_morador"))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="apartamento_manual"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Apartamento / Unidade *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex: 276"
                        {...field}
                        disabled={
                          isPending ||
                          (!modoManual &&
                            !!form.getValues("id_usuario_morador"))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
                        value={field.value || ""}
                        disabled={isPending}
                        onBlur={(e) => {
                          field.onBlur();
                          handleValidarRastreio(e);
                        }}
                      />
                      {checandoRastreio && (
                        <Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin text-muted-foreground" />
                      )}
                    </div>
                  </FormControl>
                  {rastreioVerificado === true && (
                    <p className="text-xs font-medium text-emerald-600 flex items-center gap-1 mt-1">
                      <CheckCircle className="h-3.5 w-3.5" /> Objeto localizado
                      nos Correios! Empresa alterada automaticamente.
                    </p>
                  )}
                  {rastreioVerificado === false && (
                    <p className="text-xs font-medium text-amber-600 mt-1">
                      ⚠️ Código digitado não encontrado ou não pertence aos
                      Correios.
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
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || undefined}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="PACOTE">
                          📦 Pacote / Caixa
                        </SelectItem>
                        <SelectItem value="ENVELOPE">
                          ✉️ Envelope / Carta
                        </SelectItem>
                        <SelectItem value="SACOLA">
                          🛍️ Sacola / Alimento
                        </SelectItem>
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
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || undefined}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Correios">💛 Correios</SelectItem>
                        <SelectItem value="Mercado Livre">
                          💛 Mercado Livre
                        </SelectItem>
                        <SelectItem value="Amazon">💙 Amazon</SelectItem>
                        <SelectItem value="Shopee">🧡 Shopee</SelectItem>
                        <SelectItem value="Entregador Particular">
                          🛵 Entregador / Motoboy
                        </SelectItem>
                      </SelectContent>
                    </Select>
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
                  <FormLabel>Estado / Condição do Pacote *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: Caixa sem avarias, amassada, lacrada..."
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-1.5">
              <FormLabel>
                Foto do Pacote (Opcional - Envia para o Telegram)
              </FormLabel>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full sm:w-auto relative gap-2"
                  disabled={isPending}
                >
                  <Camera className="h-4 w-4" />
                  Capturar Imagem do Pacote
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleFotoChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </Button>
                {previewFoto && (
                  <div className="flex items-center gap-2 text-xs text-emerald-600 font-medium">
                    <ImageIcon className="h-4 w-4" /> Imagem em anexo pronta
                    para o Telegram!
                  </div>
                )}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full font-semibold mt-2"
              disabled={
                isPending || (!form.getValues("bloco_manual") && !modoManual)
              }
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Registrar Entrada e Notificar Morador
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
