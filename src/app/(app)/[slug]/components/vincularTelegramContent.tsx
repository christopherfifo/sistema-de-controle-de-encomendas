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

export function VincularTelegramContent({ userId, slug }: VincularTelegramContentProps) {
  const router = useRouter();
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
          router.push(`/${slug}?user=${userId}`);
        }, 2000);
      } else {
        setStatus({ type: "error", message: resultado.message });
      }
    } catch (err) {
      setStatus({ type: "error", message: "Erro inesperado ao salvar os dados." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-6 rounded-lg border bg-background p-6 shadow-sm">
      <div className="space-y-1">
        <h3 className="text-xl font-semibold tracking-tight">Configurar Notificações</h3>
        <p className="text-sm text-muted-foreground">
          Associe seu Telegram para receber alertas instantâneos de encomendas na portaria.
        </p>
      </div>

      <div className="rounded-md bg-sky-50 p-4 text-sky-800 border border-sky-200 dark:bg-sky-950/30 dark:text-sky-400 dark:border-sky-900 space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wider">Como obter seu Chat ID?</p>
        <ol className="list-decimal list-inside space-y-2 text-xs">
          <li>
            Clique no botão abaixo para iniciar uma conversa com o bot assistente:
            <div className="mt-2">
              <a 
                href="https://t.me/userinfobot" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-medium bg-sky-600 hover:bg-sky-700 text-white px-3 py-1.5 rounded text-xs transition-colors shadow-sm"
              >
                Abrir @userinfobot no Telegram
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </li>
          <li>No Telegram, clique em <strong>"Começar"</strong> (ou /start).</li>
          <li>Copie a sequência numérica rotulada como <strong>Id</strong>.</li>
        </ol>
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
            className={`flex items-start gap-2 rounded-md p-3 text-sm border ${
              status.type === "success"
                ? "bg-emerald-50 text-emerald-900 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400"
                : "bg-destructive/10 text-destructive border-destructive/20"
            }`}
          >
            {status.type === "success" ? (
              <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0 text-emerald-600" />
            ) : (
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
            )}
            <span>{status.message}</span>
          </div>
        )}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Salvando..." : "Confirmar Vínculo"}
        </Button>
      </form>
    </div>
  );
}