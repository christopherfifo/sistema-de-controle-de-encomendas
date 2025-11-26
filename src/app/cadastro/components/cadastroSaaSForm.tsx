"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

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
import { CadastroFormValues, cadastroSchema } from "../helpers/schemaCadastro";
import { maskCPF } from "@/helpers/cpf";
import { formatCNPJ } from "@/helpers/cnpj";
import { registerCondominioAndAdmin } from "../helpers/actionCadastro";

export function CadastroSaaSForm() {
  const [showPassword, setShowPassword] = useState(false);

  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();

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
      nomeCondominio: "",
      cnpj: "",
      telefone: "",
    },
  });

  async function onSubmit(values: CadastroFormValues) {
    setError(undefined);
    setSuccess(undefined);

    startTransition(async () => {
      const result = await registerCondominioAndAdmin(values);

      if (result.error) {
        setError(result.error);
      } else if (result.success) {
        setSuccess("Cadastro realizado com sucesso! Redirecionando...");
        form.reset();
        setTimeout(() => {
          router.push(`/`);
        }, 2000);
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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

        <fieldset
          className="space-y-4 rounded-lg border p-4"
          disabled={isPending}
        >
          <legend className="-ml-1 px-1 text-sm font-medium">
            Dados do Responsável (Síndico)
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

        <Button type="submit" className="w-full" size="lg" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Cadastrando...
            </>
          ) : (
            "Criar Conta e Cadastrar Condomínio"
          )}
        </Button>
      </form>
    </Form>
  );
}
