"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition, useEffect } from "react";
import { Eye, EyeOff, Loader2, Check, ChevronsUpDown } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import {
  CadastroFormValues,
  cadastroSchema,
} from "../helpers/schemaCadastroMorador";
import { maskCPF } from "@/helpers/cpf";
import {
  registerMorador,
  getUnidadesByCodigoAcesso,
} from "../helpers/actionCadastroMorador";
import { cn } from "@/lib/utils";

export function CadastroFormsMorador() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const codigoFromUrl =
    searchParams.get("codigo_acesso") ||
    searchParams.get("codigoAcesso") ||
    searchParams.get("codigo") ||
    searchParams.get("condominio");

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();

  const [showPassword, setShowPassword] = useState(false);

  const [unidadesData, setUnidadesData] = useState<{
    blocos: string[];
    unidadesPorBloco: Record<string, string[]>;
  } | null>(null);
  const [isFetchingUnidades, setIsFetchingUnidades] = useState(false);
  const [blocoOpen, setBlocoOpen] = useState(false);
  const [apartamentoOpen, setApartamentoOpen] = useState(false);

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

  const form = useForm<CadastroFormValues>({
    resolver: zodResolver(cadastroSchema),
    defaultValues: {
      nomeCompleto: "",
      email: "",
      cpf: "",
      senha: "",
      telefone: "",
      codigo_acesso: codigoFromUrl || "",
      bloco: "",
      apartamento: "",
      aceiteTermos: false,
    },
  });

  const codigoAcessoWatch = form.watch("codigo_acesso");
  const blocoWatch = form.watch("bloco");

  useEffect(() => {
    const fetchUnidades = async () => {
      if (codigoAcessoWatch && codigoAcessoWatch.length >= 5) {
        setIsFetchingUnidades(true);
        const data = await getUnidadesByCodigoAcesso(codigoAcessoWatch);
        setUnidadesData(data);
        setIsFetchingUnidades(false);
      } else {
        setUnidadesData(null);
        setIsFetchingUnidades(false);
      }
    };

    if (codigoAcessoWatch && codigoAcessoWatch.length >= 5) {
      setIsFetchingUnidades(true);
    }
    const timeoutId = setTimeout(fetchUnidades, 500);
    return () => clearTimeout(timeoutId);
  }, [codigoAcessoWatch]);

  async function onSubmit(values: CadastroFormValues) {
    setError(undefined);
    setSuccess(undefined);

    startTransition(async () => {
      const result = await registerMorador(values);

      if (result.error) {
        if (result.field) {
          form.setError(result.field as Parameters<typeof form.setError>[0], {
            message: result.error,
          });
        } else {
          setError(result.error);
        }
        console.log("Erro no cadastro:", result.error);
      } else if (result.success) {
        setSuccess("Cadastro realizado com sucesso! Redirecionando...");
        console.log("Cadastro bem-sucedido:", result.success);
        form.reset();

        router.push(
          `/${String(result.condominioId)}?user=${String(result.userId)}&perfil=${String(result.perfil)}`,
        );
      }
    });
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
            {error}
          </div>
        )}
        {success && (
          <div className="rounded-md bg-green-50 p-3 text-sm text-green-600">
            {success}
          </div>
        )}

        {!codigoFromUrl && (
          <fieldset className="space-y-4 rounded-lg border p-4">
            <legend className="-ml-1 px-1 text-sm font-medium">
              Dados do Condomínio
            </legend>
            <FormField
              control={form.control}
              name="codigo_acesso"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Código de Acesso</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Insira o código do seu condomínio"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </fieldset>
        )}

        <fieldset className="space-y-4 rounded-lg border p-4">
          <legend className="-ml-1 px-1 text-sm font-medium">
            Dados Pessoais
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
              name="bloco"
              render={({ field }) => (
                <FormItem className="flex flex-col pt-2">
                  <FormLabel>Bloco</FormLabel>
                  {isFetchingUnidades ? (
                    <FormControl>
                      <Button
                        variant="outline"
                        disabled
                        className="w-full justify-between font-normal text-muted-foreground"
                      >
                        Buscando blocos...
                        <Loader2 className="ml-2 h-4 w-4 animate-spin shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  ) : !codigoAcessoWatch || codigoAcessoWatch.length < 5 ? (
                    <FormControl>
                      <Input
                        placeholder="Aguardando código..."
                        disabled
                        {...field}
                      />
                    </FormControl>
                  ) : unidadesData && unidadesData.blocos.length > 0 ? (
                    <Popover
                      open={blocoOpen}
                      onOpenChange={setBlocoOpen}
                      modal={true}
                    >
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "w-full justify-between font-normal",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {field.value ? field.value : "Selecione o bloco"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-[--radix-popover-trigger-width] p-0"
                        align="start"
                      >
                        <Command>
                          <CommandInput placeholder="Pesquisar bloco..." />
                          <CommandList>
                            <CommandEmpty>
                              Nenhum bloco encontrado.
                            </CommandEmpty>
                            <CommandGroup>
                              {unidadesData.blocos.map((bloco) => (
                                <CommandItem
                                  value={bloco}
                                  key={bloco}
                                  onSelect={(value) => {
                                    form.setValue("bloco", value);
                                    form.setValue("apartamento", "");
                                    setBlocoOpen(false);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      bloco === field.value
                                        ? "opacity-100"
                                        : "opacity-0",
                                    )}
                                  />
                                  {bloco}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  ) : (
                    <FormControl>
                      <Input placeholder="Ex: Bloco A" {...field} />
                    </FormControl>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="apartamento"
              render={({ field }) => {
                const apartamentos =
                  blocoWatch && unidadesData
                    ? unidadesData.unidadesPorBloco[blocoWatch] || []
                    : [];
                return (
                  <FormItem className="flex flex-col pt-2">
                    <FormLabel>Apartamento</FormLabel>
                    {isFetchingUnidades ? (
                      <FormControl>
                        <Button
                          variant="outline"
                          disabled
                          className="w-full justify-between font-normal text-muted-foreground"
                        >
                          Buscando...
                          <Loader2 className="ml-2 h-4 w-4 animate-spin shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    ) : !codigoAcessoWatch || codigoAcessoWatch.length < 5 ? (
                      <FormControl>
                        <Input
                          placeholder="Aguardando código..."
                          disabled
                          {...field}
                        />
                      </FormControl>
                    ) : unidadesData && apartamentos.length > 0 ? (
                      <Popover
                        open={apartamentoOpen}
                        onOpenChange={setApartamentoOpen}
                        modal={true}
                      >
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              disabled={!blocoWatch}
                              className={cn(
                                "w-full justify-between font-normal",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              {field.value
                                ? field.value
                                : "Selecione o apartamento"}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-[--radix-popover-trigger-width] p-0"
                          align="start"
                        >
                          <Command>
                            <CommandInput placeholder="Pesquisar apartamento..." />
                            <CommandList>
                              <CommandEmpty>
                                Nenhum apartamento encontrado.
                              </CommandEmpty>
                              <CommandGroup>
                                {apartamentos.map((apt) => (
                                  <CommandItem
                                    value={apt}
                                    key={apt}
                                    onSelect={(value) => {
                                      form.setValue("apartamento", value);
                                      setApartamentoOpen(false);
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        apt === field.value
                                          ? "opacity-100"
                                          : "opacity-0",
                                      )}
                                    />
                                    {apt}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    ) : (
                      <FormControl>
                        <Input
                          placeholder="Ex: 101"
                          disabled={
                            !blocoWatch &&
                            (unidadesData?.blocos?.length ?? 0) > 0
                          }
                          {...field}
                        />
                      </FormControl>
                    )}
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </div>
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
                    Li e aceito as condições do sistema, incluindo os{" "}
                    <Link
                      href="/termos"
                      className="text-primary hover:underline"
                    >
                      Termos de Uso
                    </Link>
                    , e a{" "}
                    <Link
                      href="/privacidade"
                      className="text-primary hover:underline"
                    >
                      Política de Privacidade
                    </Link>
                  </span>
                </FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" size="lg" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Cadastrando...
            </>
          ) : (
            "Criar Conta"
          )}
        </Button>
      </form>
    </Form>
  );
}
