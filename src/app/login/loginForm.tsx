"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { Eye, EyeOff } from "lucide-react";
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

import { loginSchema, LoginFormValues } from "./helpers/schemaLogin";
import { authenticate } from "./helpers/actionsLogin";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      login: "",
      password: "",
    },
  });

  function onSubmit(values: LoginFormValues) {
    setError(undefined);
    startTransition(async () => {
      const result = await authenticate(values);

      if (result.error) {
        setError(result.error);
      }

      if (result.success) {
        console.log(result.success);
        router.push(
          `/${String(result.condominioId)}?user=${String(result.userId)}&perfil=${String(result.perfil)}`,
        );
      }
    });
  }

  return (
    <Form {...form}>
      {error && (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-center text-sm text-destructive">
          {error}
        </div>
      )}
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="login"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email ou CPF</FormLabel>
              <FormControl>
                <Input
                  placeholder="seu@email.com ou 000.000.000-00"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
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
                  aria-label={showPassword ? "Esconder senha" : "Mostrar senha"}
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
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Entrando..." : "Entrar"}
        </Button>
      </form>
    </Form>
  );
}
