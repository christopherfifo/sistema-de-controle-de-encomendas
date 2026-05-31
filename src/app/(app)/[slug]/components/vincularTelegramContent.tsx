"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, CheckCircle2, AlertCircle, ExternalLink } from "lucide-react";
import { salvarTelegramChatId } from "../helpers/actionTelegram";

interface VincularTelegramContentProps {
  userId: string;
  slug: string;
}

export function VincularTelegramContent({
  userId,
}: Omit<VincularTelegramContentProps, "slug">) {
  const [chatId, setChatId] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!chatId.trim()) {
      setStatus({ type: "error", message: "Por favor, insira um ID válido." });
      return;
    }

    setLoading(true);
    setStatus({ type: null, message: "" });

    try {
      const resultado = await salvarTelegramChatId(userId, chatId.trim());
      if (resultado.success) {
        setStatus({ type: "success", message: resultado.message });
        setChatId("");
        setTimeout(() => {
          window.location.href = "https://t.me/syscondominio_portaria_bot";
        }, 2000);
      } else {
        setStatus({ type: "error", message: resultado.message });
      }
    } catch {
      setStatus({
        type: "error",
        message: "Erro inesperado ao salvar os dados.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-6 rounded-lg border bg-background p-6 shadow-sm">
      <div className="space-y-1">
        <h3 className="text-xl font-semibold tracking-tight">
          Configurar Notificações
        </h3>
        <p className="text-sm text-muted-foreground">
          Associe seu Telegram para receber alertas instantâneos de encomendas
          na portaria.
        </p>
      </div>

      <div className="rounded-md bg-amber-50 p-3 text-amber-900 border border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900 space-y-2">
        <p className="text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
          <AlertCircle className="h-3.5 w-3.5" />
          Ativação Única Obrigatória
        </p>
        <p className="text-xs leading-tight">
          Para liberar suas notificações, você <strong>PRECISA</strong> acessar o bot e clicar em <strong>&quot;Começar&quot;</strong> apenas uma vez. O Telegram só enviará alertas após essa permissão inicial.
        </p>
        <a
          href="https://t.me/syscondominio_portaria_bot"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 font-bold bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 rounded text-[11px] transition-colors shadow-sm w-full justify-center"
        >
          Ativar Bot (Clique aqui)
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>

      <div className="rounded-md bg-sky-50 p-3 text-sky-800 border border-sky-200 dark:bg-sky-950/30 dark:text-sky-400 dark:border-sky-900 space-y-2">
        <p className="text-[10px] font-semibold uppercase tracking-wider">Como obter seu ID?</p>
        <div className="flex flex-col gap-2 text-xs">
          <p>1. Abra o <strong>@userinfobot</strong> e clique em <strong>Começar</strong>.</p>
          <p>2. Copie o número do campo <strong>Id</strong> e cole abaixo.</p>
          <a
            href="https://t.me/userinfobot"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-medium text-sky-700 hover:text-sky-900 dark:text-sky-400 underline text-[11px]"
          >
            Abrir @userinfobot
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="chatId" className="text-sm font-medium">
            Seu Telegram ID
          </label>
          <div className="relative">
            <Input
              id="chatId"
              type="text"
              placeholder="Ex: 589412387"
              value={chatId}
              onChange={(e) => setChatId(e.target.value)}
              disabled={loading}
              className="pr-10"
            />
            <Send className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground/60" />
          </div>
        </div>

        {status.type && (
          <div
            className={`flex flex-col gap-3 rounded-md p-3 text-sm border ${
              status.type === "success"
                ? "bg-emerald-50 text-emerald-900 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400"
                : "bg-destructive/10 text-destructive border-destructive/20"
            }`}
          >
            <div className="flex items-start gap-2">
              {status.type === "success" ? (
                <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0 text-emerald-600" />
              ) : (
                <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
              )}
              <span>{status.message}</span>
            </div>
            
            {status.type === "success" && (
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full bg-emerald-600 text-white hover:bg-emerald-700 hover:text-white border-none"
                onClick={() => window.open("https://t.me/syscondominio_portaria_bot", "_blank")}
              >
                Ir para o Bot agora (Obrigatório)
              </Button>
            )}
          </div>
        )}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Salvando..." : "Confirmar Vínculo"}
        </Button>
      </form>
    </div>
  );
}
