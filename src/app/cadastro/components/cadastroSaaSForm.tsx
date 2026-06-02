"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition, useEffect } from "react";
import {
  Eye,
  EyeOff,
  Loader2,
  CreditCard,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CadastroFormValues, cadastroSchema } from "../helpers/schemaCadastro";
import { maskCPF } from "@/helpers/cpf";
import { formatCNPJ } from "@/helpers/cnpj";
import {
  registerCondominioAndAdmin,
  consultarBandeiraCartao,
  validarEProcessarPagamento,
} from "../helpers/actionCadastro";
import { getPlanos } from "../../planos/actionPlanos";

export function CadastroSaaSForm() {
  const [step, setStep] = useState<1 | 2>(1);
  const [showPassword, setShowPassword] = useState(false);
  const [bandeira, setBandeira] = useState<string>("Desconhecida");
  const [planos, setPlanos] = useState<
    { id_plano: string; nome_plano: string; valor: string | number }[]
  >([]);

  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const searchParams = useSearchParams();
  const planoIdFromUrl = searchParams.get("planoId");

  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();

  useEffect(() => {
    async function loadPlanos() {
      const p = await getPlanos();
      setPlanos(p);

      // Se tiver um plano na URL, garante que o formulário o selecione
      if (planoIdFromUrl) {
        form.setValue("planoId", planoIdFromUrl);
      }
    }
    loadPlanos();
  }, [planoIdFromUrl]);

  function maskPhone(value: string) {
    const digits = (value || "").replace(/\D/g, "");
    if (!digits) return "";
    if (digits.length <= 2) return `(${digits}`;
    if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    if (digits.length <= 10)
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(
      7,
      11,
    )}`;
  }

  function formatValidade(value: string) {
    const digits = value.replace(/\D/g, "");
    if (digits.length >= 3) {
      return `${digits.slice(0, 2)}/${digits.slice(2, 6)}`;
    }
    return digits;
  }

  const form = useForm<CadastroFormValues>({
    resolver: zodResolver(cadastroSchema),
    defaultValues: {
      nomeCompleto: "",
      email: "",
      cpf: "",
      senha: "",
      nomeCondominio: "",
      cnpj: "",
      telefone: "",
      planoId: planoIdFromUrl || "",
      aceiteTermos: false,
      numeroCartao: "",
      nomeTitularCartao: "",
      validadeCartao: "",
      cvvCartao: "",
    },
  });

  async function handleNextStep() {
    const isValid = await form.trigger([
      "nomeCompleto",
      "email",
      "cpf",
      "senha",
      "telefone",
      "nomeCondominio",
      "cnpj",
      "planoId",
    ]);

    if (isValid) {
      setStep(2);
      window.scrollTo(0, 0);
    }
  }

  function handlePrevStep() {
    setStep(1);
    window.scrollTo(0, 0);
  }

  async function handleCartaoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value.replace(/\D/g, "");
    form.setValue("numeroCartao", val, { shouldValidate: true });

    if (val.length >= 6) {
      try {
        const data = await consultarBandeiraCartao(val.slice(0, 6));
        if (data && data.bandeira) {
          setBandeira(data.bandeira);
        } else {
          setBandeira("Desconhecida");
        }
      } catch (e) {
        // Ignora erro de rede silenciosamente
        setBandeira("Desconhecida");
      }
    } else {
      setBandeira("Desconhecida");
    }
  }

  async function onSubmit(values: CadastroFormValues) {
    if (step !== 2) return;

    setError(undefined);
    setSuccess(undefined);

    const selectedPlano = planos.find((p) => p.id_plano === values.planoId);
    const valorPlano = selectedPlano ? Number(selectedPlano.valor) : 99.9;
    const descricaoPlano = selectedPlano
      ? `Assinatura ${selectedPlano.nome_plano}`
      : "Assinatura Sistema Condomínio";

    startTransition(async () => {
      try {
        const validatePayload = {
          numero: values.numeroCartao,
          nome_titular: values.nomeTitularCartao,
          validade: values.validadeCartao,
          cvv: values.cvvCartao,
        };

        const pagamentoRes = await validarEProcessarPagamento(
          validatePayload,
          valorPlano,
          descricaoPlano,
        );

        if (pagamentoRes.error) {
          setError(pagamentoRes.error);
          return;
        }

        // Cadastro após pagamento com sucesso
        const result = await registerCondominioAndAdmin(values);

        if (result.error) {
          setError(result.error);
        } else if (result.success) {
          setSuccess(
            "Pagamento aprovado e cadastro realizado com sucesso! Redirecionando...",
          );
          form.reset();
          setTimeout(() => {
            router.push(`/`);
          }, 2000);
        }
      } catch (err) {
        setError("Ocorreu um erro de conexão ao processar. Tente novamente.");
      }
    });
  }

  const selectedPlanoId = form.watch("planoId");
  const selectedPlanoDisplay = planos.find(
    (p) => p.id_plano === selectedPlanoId,
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Indicador de Passos */}
        <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground mb-4">
          <span className={`font-medium ${step === 1 ? "text-primary" : ""}`}>
            1. Dados
          </span>
          <span className="text-muted-foreground/50">/</span>
          <span className={`font-medium ${step === 2 ? "text-primary" : ""}`}>
            2. Pagamento
          </span>
        </div>

        {error && (
          <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-center text-sm text-destructive">
            {error}
          </div>
        )}
        {success && (
          <div className="rounded-md border border-green-500/50 bg-green-500/10 p-3 text-center text-sm text-green-700">
            {success}
          </div>
        )}

        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
            <fieldset
              className="space-y-4 rounded-lg border p-4"
              disabled={isPending}
            >
              <legend className="-ml-1 px-1 text-sm font-medium">
                Escolha seu Plano
              </legend>
              <FormField
                control={form.control}
                name="planoId"
                render={({ field }) => (
                  <FormItem>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o plano ideal" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {planos.map((plano) => (
                          <SelectItem
                            key={plano.id_plano}
                            value={plano.id_plano}
                          >
                            {plano.nome_plano} - R${" "}
                            {Number(plano.valor).toFixed(2).replace(".", ",")}{" "}
                            /mês
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormLabel className="flex flex-col items-start">
                      <Link
                        href="/planos"
                        target="_blank"
                        className="text-xs text-primary hover:underline font-normal"
                      >
                        Ver detalhes dos planos
                      </Link>
                    </FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </fieldset>

            <fieldset
              className="space-y-4 rounded-lg border p-4"
              disabled={isPending}
            >
              <legend className="-ml-1 px-1 text-sm font-medium">
                Dados do Responsável pela Contratação
              </legend>
              <FormField
                control={form.control}
                name="nomeCompleto"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome Completo</FormLabel>
                    <FormControl>
                      <Input placeholder="Seu nome" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="seu@email.com"
                          {...field}
                          type="email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cpf"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CPF</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="000.000.000-00"
                          {...field}
                          value={field.value}
                          onChange={(e) => {
                            const maskedValue = maskCPF(e.target.value);
                            field.onChange(maskedValue);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="telefone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="(00) 00000-0000"
                          {...field}
                          value={field.value}
                          onChange={(e) => {
                            const masked = maskPhone(e.target.value);
                            field.onChange(masked);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="senha"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Senha</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input
                            placeholder="••••••••"
                            {...field}
                            type={showPassword ? "text" : "password"}
                            className="pr-10"
                          />
                        </FormControl>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-1/2 h-6 w-6 -translate-y-1/2 text-muted-foreground"
                          onClick={() => setShowPassword(!showPassword)}
                          aria-label={
                            showPassword ? "Esconder senha" : "Mostrar senha"
                          }
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </fieldset>

            <fieldset
              className="space-y-4 rounded-lg border p-4"
              disabled={isPending}
            >
              <legend className="-ml-1 px-1 text-sm font-medium">
                Dados do Condomínio
              </legend>
              <FormField
                control={form.control}
                name="nomeCondominio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Condomínio</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Residencial Flores" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cnpj"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CNPJ do Condomínio</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="00.000.000/0001-00"
                        {...field}
                        value={field.value}
                        onChange={(e) => {
                          const masked = formatCNPJ(e.target.value);
                          field.onChange(masked);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </fieldset>

            <Button
              type="button"
              className="w-full"
              size="lg"
              onClick={handleNextStep}
            >
              Próximo
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <fieldset
              className="space-y-4 rounded-lg border p-4"
              disabled={isPending}
            >
              <legend className="-ml-1 px-1 text-sm font-medium flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                Pagamento (Assinatura{" "}
                {selectedPlanoDisplay
                  ? selectedPlanoDisplay.nome_plano
                  : "Mensal"}{" "}
                - R${" "}
                {selectedPlanoDisplay
                  ? Number(selectedPlanoDisplay.valor)
                      .toFixed(2)
                      .replace(".", ",")
                  : "99,90"}
                )
              </legend>

              <FormField
                control={form.control}
                name="numeroCartao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número do Cartão</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          placeholder="0000 0000 0000 0000"
                          {...field}
                          value={field.value.replace(/(\d{4})/g, "$1 ").trim()}
                          onChange={handleCartaoChange}
                          maxLength={19}
                        />
                      </FormControl>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground">
                        {bandeira}
                      </div>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="nomeTitularCartao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Titular</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome impresso no cartão" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="validadeCartao"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Validade</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="MM/AA"
                          {...field}
                          value={field.value}
                          onChange={(e) => {
                            const formatted = formatValidade(e.target.value);
                            field.onChange(formatted);
                          }}
                          maxLength={7}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cvvCartao"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CVV</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="123"
                          {...field}
                          value={field.value.replace(/\D/g, "")}
                          maxLength={4}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </fieldset>

            <FormField
              control={form.control}
              name="aceiteTermos"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-sm font-normal text-muted-foreground leading-relaxed">
                      <span>
                        Li e aceito as condições contratuais do sistema,
                        incluindo os{" "}
                        <Link
                          href="/termos"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          Termos de Uso
                        </Link>
                        , a{" "}
                        <Link
                          href="/privacidade"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          Política de Privacidade
                        </Link>{" "}
                        e o acordo de suporte{" "}
                        <Link
                          href="/sla"
                          className="text-primary hover:underline"
                        >
                          [SLA]
                        </Link>
                        .
                      </span>
                    </FormLabel>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                className="w-1/3"
                onClick={handlePrevStep}
                disabled={isPending}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
              </Button>
              <Button type="submit" className="w-2/3" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processando...
                  </>
                ) : (
                  "Assinar e Criar Conta"
                )}
              </Button>
            </div>
          </div>
        )}
      </form>
    </Form>
  );
}
