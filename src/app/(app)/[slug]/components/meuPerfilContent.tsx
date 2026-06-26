"use client";

import { useState, useEffect } from "react";
import { 
  User, 
  Mail, 
  Phone, 
  Send, 
  Lock, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  ExternalLink,
  ChevronRight,
  X,
  UserPen,
  BellRing
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { updateDadosPessoais, updateTelegramId } from "../helpers/actionPerfil";
import { maskCPF } from "@/helpers/cpf";

function maskPhone(value: string) {
  if (!value) return "";
  const digits = value.replace(/\D/g, "");
  if (digits.length <= 10) {
    return digits.replace(/(\d{2})(\d{0,4})(\d{0,4})/, (match, p1, p2, p3) => {
      let res = `(${p1}`;
      if (p2) res += `) ${p2}`;
      if (p3) res += `-${p3}`;
      return res;
    }).trim();
  } else {
    return digits.replace(/(\d{2})(\d{0,5})(\d{0,4})/, (match, p1, p2, p3) => {
      let res = `(${p1}`;
      if (p2) res += `) ${p2}`;
      if (p3) res += `-${p3}`;
      return res;
    }).trim();
  }
}

interface MeuPerfilContentProps {
  user: {
    id_usuario: string;
    nome_completo: string;
    cpf: string;
    email: string;
    telefone: string;
    telegram_chat_id: string | null;
  };
}

type ViewMode = "overview" | "edit-personal" | "edit-telegram";

export function MeuPerfilContent({ user }: MeuPerfilContentProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("overview");
  const [showTokenInput, setShowTokenInput] = useState(false);
  const [token, setToken] = useState("");
  
  const [personalData, setPersonalData] = useState({
    nome: user.nome_completo,
    email: user.email,
    telefone: user.telefone,
  });

  const [telegramId, setTelegramId] = useState(user.telegram_chat_id || "");

  const [loading, setLoading] = useState<"personal" | "telegram" | null>(null);
  const [status, setStatus] = useState<{ type: "success" | "error" | null; message: string }>({
    type: null,
    message: "",
  });
  
  const [showTelegramModal, setShowTelegramModal] = useState(false);
  const [countdown, setCountdown] = useState(10);

  const handleStartEdit = (mode: ViewMode) => {
    setViewMode(mode);
    setShowTokenInput(true);
    setStatus({ type: null, message: "" });
    setToken("");
  };

  const handleVerifyToken = () => {
    if (!token.trim()) {
      setStatus({ type: "error", message: "Por favor, insira seu token de acesso." });
      return;
    }
    setShowTokenInput(false);
    setStatus({ type: null, message: "" });
  };

  const handleCancel = () => {
    setViewMode("overview");
    setShowTokenInput(false);
    setToken("");
    setStatus({ type: null, message: "" });
    setPersonalData({
      nome: user.nome_completo,
      email: user.email,
      telefone: user.telefone,
    });
    setTelegramId(user.telegram_chat_id || "");
  };

  const handleUpdatePersonal = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading("personal"); 
    setStatus({ type: null, message: "" });

    const result = await updateDadosPessoais({
      userId: user.id_usuario,
      nome: personalData.nome,
      email: personalData.email,
      telefone: personalData.telefone,
      token: token,
    });

    setLoading(null);

    if (result.success) {
      setStatus({ type: "success", message: result.message });
      setTimeout(() => setViewMode("overview"), 1500);
      setToken("");
    } else {
      setStatus({ type: "error", message: result.message });
    }
  };

  const handleUpdateTelegram = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading("telegram");
    setStatus({ type: null, message: "" });

    const isDifferent = telegramId !== (user.telegram_chat_id || "");

    const result = await updateTelegramId({
      userId: user.id_usuario,
      telegramId: telegramId,
      token: token,
    });

    setLoading(null);

    if (result.success) {
      setStatus({ type: "success", message: result.message });
      setToken("");
      
      if (telegramId.trim() !== "" && isDifferent) {
        setShowTelegramModal(true);
      } else {
        setTimeout(() => setViewMode("overview"), 1500);
      }
    } else {
      setStatus({ type: "error", message: result.message });
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showTelegramModal && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (showTelegramModal && countdown === 0) {
      window.location.href = "https://t.me/syscondominio_portaria_bot";
    }
    return () => clearInterval(timer);
  }, [showTelegramModal, countdown]);

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 p-4">
      <Card className="border shadow-xl rounded-3xl bg-background overflow-hidden">
        <CardHeader className="bg-gradient-to-b from-primary/5 via-transparent to-transparent border-b p-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0">
              <div className="bg-primary/10 p-3 rounded-2xl shrink-0">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div className="min-w-0">
                <CardTitle className="text-2xl font-bold tracking-tight">Meu Perfil</CardTitle>
                <CardDescription className="text-sm font-medium">Informações de conta e notificações</CardDescription>
              </div>
            </div>
            
            {viewMode !== "overview" && (
               <Button 
               variant="ghost" 
               size="sm" 
               onClick={handleCancel}
               className="gap-2 text-muted-foreground hover:text-foreground font-bold text-xs uppercase tracking-wider"
             >
               <X className="h-4 w-4" />
               Voltar
             </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-6 sm:p-8 space-y-8">
          {status.type && (
            <div className={`p-4 rounded-2xl border flex items-start gap-3 animate-in zoom-in-95 duration-300 ${
              status.type === "success" 
                ? "bg-emerald-50 border-emerald-200 text-emerald-900 dark:bg-emerald-950/20 dark:border-emerald-900 dark:text-emerald-400" 
                : "bg-destructive/10 border-destructive/20 text-destructive"
            }`}>
              {status.type === "success" ? <CheckCircle2 className="h-5 w-5 shrink-0" /> : <AlertCircle className="h-5 w-5 shrink-0" />}
              <span className="text-sm font-bold">{status.message}</span>
            </div>
          )}

          {showTokenInput && (
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleVerifyToken();
              }}
              className="p-6 bg-primary/5 rounded-3xl border border-primary/20 space-y-5 animate-in slide-in-from-top-4 duration-500"
            >
              <div className="flex items-start gap-4">
                <div className="bg-primary/20 p-2 rounded-lg">
                  <Lock className="h-5 w-5 text-primary" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold uppercase tracking-tight text-primary">Acesso Restrito</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Para garantir sua segurança, informe seu <strong>Token de Acesso</strong> para liberar a alteração deste campo.
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Input 
                  placeholder="Seu Token (Ex: ABCD-1234)" 
                  value={token}
                  onChange={(e) => setToken(e.target.value.toUpperCase())}
                  className="font-mono tracking-widest text-center text-lg h-12 bg-background border-primary/20"
                  autoFocus
                />
                <Button type="submit" className="h-12 px-8 font-bold text-sm uppercase tracking-widest shadow-lg shadow-primary/20">
                  Verificar
                </Button>
              </div>
            </form>
          )}

          {viewMode === "overview" && (
            <div className="space-y-10 animate-in fade-in duration-500">
              <div className="group">
                <div className="flex flex-wrap items-center justify-between mb-4 gap-2">
                  <div className="flex items-center gap-3">
                    <UserPen className="h-4 w-4 text-primary" />
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Dados Pessoais</h3>
                  </div>
                  <Button 
                    variant="link" 
                    size="sm" 
                    onClick={() => handleStartEdit("edit-personal")}
                    className="text-xs font-bold text-primary hover:no-underline px-0 h-auto"
                  >
                    Editar Informações
                  </Button>
                </div>
                <div className="grid gap-6 sm:grid-cols-2 p-6 rounded-3xl bg-muted/40 dark:bg-muted/30 border border-muted shadow-md dark:shadow-none group-hover:border-primary/20 transition-all duration-300">
                  <div className="space-y-1 min-w-0">
                    <Label className="text-[10px] font-bold text-muted-foreground/60 uppercase">Nome Completo</Label>
                    <p className="text-sm font-bold text-foreground truncate">{user.nome_completo}</p>
                  </div>
                  <div className="space-y-1 min-w-0">
                    <Label className="text-[10px] font-bold text-muted-foreground/60 uppercase">CPF</Label>
                    <p className="text-sm font-medium text-muted-foreground tabular-nums truncate">{maskCPF(user.cpf)}</p>
                  </div>
                  <div className="space-y-1 min-w-0">
                    <Label className="text-[10px] font-bold text-muted-foreground/60 uppercase">E-mail</Label>
                    <p className="text-sm font-bold text-foreground truncate">{user.email}</p>
                  </div>
                  <div className="space-y-1 min-w-0">
                    <Label className="text-[10px] font-bold text-muted-foreground/60 uppercase">Telefone</Label>
                    <p className="text-sm font-bold text-foreground truncate">{maskPhone(user.telefone)}</p>
                  </div>
                </div>
              </div>

              <div className="group">
                <div className="flex flex-wrap items-center justify-between mb-4 gap-2">
                  <div className="flex items-center gap-3">
                    <BellRing className="h-4 w-4 text-blue-500" />
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Notificações</h3>
                  </div>
                  <Button 
                    variant="link" 
                    size="sm" 
                    onClick={() => handleStartEdit("edit-telegram")}
                    className="text-xs font-bold text-blue-600 hover:no-underline px-0 h-auto"
                  >
                    Configurar Telegram
                  </Button>
                </div>
                <div className="p-6 rounded-3xl bg-blue-100/30 dark:bg-blue-950/10 border border-blue-200/50 dark:border-transparent shadow-md dark:shadow-none group-hover:border-blue-500/30 transition-all duration-300 flex items-center justify-between gap-4">
                  <div className="space-y-1 min-w-0">
                    <Label className="text-[10px] font-bold text-blue-500/60 uppercase truncate block">ID do Telegram</Label>
                    <div className="flex items-center gap-2 min-w-0">
                      <Send className="h-3.5 w-3.5 text-blue-500/50 shrink-0" />
                      <p className="text-sm font-black tabular-nums truncate">{user.telegram_chat_id || "Não vinculado"}</p>
                    </div>
                  </div>
                  <div className="h-10 w-10 shrink-0 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                    <Send className="h-5 w-5 text-blue-500" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {viewMode === "edit-personal" && !showTokenInput && (
            <form onSubmit={handleUpdatePersonal} className="space-y-8 animate-in slide-in-from-right-4 duration-500">
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-foreground">Alterar Dados Pessoais</h3>
                <p className="text-xs text-muted-foreground font-medium">Mantenha seu cadastro sempre atualizado para facilitar a comunicação.</p>
              </div>

              <div className="space-y-5">
                <div className="grid gap-2">
                  <Label htmlFor="nome" className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70">Nome Completo</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground/40" />
                    <Input id="nome" value={personalData.nome} onChange={(e) => setPersonalData({...personalData, nome: e.target.value})} disabled={loading === "personal"} className="pl-10 h-11 rounded-xl" />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="grid gap-2">
                    <Label htmlFor="email" className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70">E-mail</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground/40" />
                      <Input id="email" type="email" value={personalData.email} onChange={(e) => setPersonalData({...personalData, email: e.target.value})} disabled={loading === "personal"} className="pl-10 h-11 rounded-xl" />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="telefone" className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70">Telefone</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground/40" />
                      <Input id="telefone" value={personalData.telefone} onChange={(e) => setPersonalData({...personalData, telefone: e.target.value})} disabled={loading === "personal"} className="pl-10 h-11 rounded-xl" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button type="submit" className="flex-1 h-12 font-bold uppercase tracking-widest text-xs" disabled={loading !== null}>
                  {loading === "personal" ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="mr-2 h-4 w-4" />}
                  Confirmar Novas Informações
                </Button>
                <Button type="button" variant="outline" onClick={handleCancel} className="h-12 px-8 font-bold uppercase tracking-widest text-xs border-dashed" disabled={loading !== null}>
                  Desistir
                </Button>
              </div>
            </form>
          )}

          {viewMode === "edit-telegram" && !showTokenInput && (
            <form onSubmit={handleUpdateTelegram} className="space-y-8 animate-in slide-in-from-right-4 duration-500">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-foreground">Notificações no Telegram</h3>
                  <p className="text-xs text-muted-foreground font-medium leading-relaxed">O seu ID é o que permite que enviemos alertas direto no seu celular.</p>
                </div>
                <a href="https://t.me/userinfobot" target="_blank" rel="noopener noreferrer" className="bg-blue-500/10 text-blue-600 p-3 rounded-2xl hover:bg-blue-500/20 transition-colors group">
                  <ExternalLink className="h-5 w-5 group-hover:scale-110 transition-transform" />
                </a>
              </div>

              <div className="p-6 bg-blue-50/50 dark:bg-blue-950/20 rounded-3xl border border-blue-500/20 space-y-4">
                <div className="grid gap-3">
                  <Label htmlFor="telegramId" className="text-[11px] font-black uppercase tracking-[0.1em] text-blue-600/70">Novo ID do Telegram</Label>
                  <div className="relative">
                    <Send className="absolute left-4 top-4 h-5 w-5 text-blue-500/40" />
                    <Input 
                      id="telegramId" 
                      value={telegramId} 
                      onChange={(e) => setTelegramId(e.target.value)} 
                      disabled={loading === "telegram"} 
                      placeholder="Cole aqui seu ID numérico" 
                      className="pl-12 h-14 rounded-2xl text-lg font-black tabular-nums border-blue-500/30 focus-visible:ring-blue-500" 
                    />
                  </div>
                </div>
                <p className="text-[10px] text-blue-600/80 font-bold leading-relaxed">
                  Importante: Ao alterar o vínculo, o sistema para de enviar notificações para o ID antigo imediatamente.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button type="submit" className="flex-1 h-14 bg-blue-600 hover:bg-blue-700 font-black uppercase tracking-widest text-xs shadow-lg shadow-blue-500/20" disabled={loading !== null}>
                  {loading === "telegram" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                  Atualizar Vínculo de Notificações
                </Button>
                <Button type="button" variant="outline" onClick={handleCancel} className="h-14 px-8 font-bold uppercase tracking-widest text-xs border-dashed" disabled={loading !== null}>
                  Cancelar
                </Button>
              </div>
            </form>
          )}
        </CardContent>

        <CardFooter className="bg-muted/30 border-t p-5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className={`h-2 w-2 rounded-full ${viewMode === 'overview' ? 'bg-emerald-500' : 'bg-primary animate-pulse'}`}></div>
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70">
              {viewMode === 'overview' ? 'Sistema Protegido' : 'Alteração em Progresso'}
            </span>
          </div>
          <p className="text-[9px] font-black text-muted-foreground/40 uppercase tracking-tighter">
            REF: {user.id_usuario.split('-')[0]}
          </p>
        </CardFooter>
      </Card>

      {/* Redirect Dialog */}
      <Dialog open={showTelegramModal} onOpenChange={setShowTelegramModal}>
        <DialogContent className="sm:max-w-md border-none shadow-2xl rounded-3xl">
          <DialogHeader>
            <div className="mx-auto bg-emerald-500 p-4 rounded-3xl flex items-center justify-center mb-6 shadow-xl shadow-emerald-500/20 animate-bounce">
              <CheckCircle2 className="h-10 w-10 text-white" />
            </div>
            <DialogTitle className="text-center text-2xl font-black tracking-tight">Vínculo Atualizado!</DialogTitle>
            
            <DialogDescription asChild className="text-center space-y-6 pt-4 block text-muted-foreground text-sm">
              <div>
                <p className="text-foreground font-bold leading-relaxed">
                  Seu novo ID foi registrado no sistema com sucesso.
                </p>
                <div className="bg-amber-500/10 p-5 rounded-3xl border border-amber-500/20 text-amber-600 text-sm">
                  <div className="font-black flex items-center justify-center gap-2 mb-3 uppercase tracking-tighter">
                    <AlertCircle className="h-4 w-4" />
                    Passo Obrigatório
                  </div>
                  <p className="font-medium leading-relaxed">
                    Para o Telegram aceitar nossas mensagens, você <strong>DEVE</strong> entrar no bot e clicar em <strong>COMEÇAR</strong> agora.
                  </p>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Redirecionando em</span>
                  <span className="font-black text-primary tabular-nums text-4xl">{countdown}s</span>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
          <div className="pt-4">
            <Button 
              className="w-full h-14 bg-emerald-500 hover:bg-emerald-600 text-white font-black uppercase tracking-widest text-xs shadow-xl shadow-emerald-500/20"
              onClick={() => window.location.href = "https://t.me/syscondominio_portaria_bot"}
            >
              Ir para o Telegram agora <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}