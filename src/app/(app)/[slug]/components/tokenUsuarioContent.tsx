"use client";

import { useState } from "react";
import { KeyRound, Copy, Check, UserCheck } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface TokenUsuarioContentProps {
  usuario: {
    nome_completo: string;
    perfil: string;
    token_acesso: string;
  };
}

export function TokenUsuarioContent({ usuario }: TokenUsuarioContentProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyToClipboard = () => {
    if (!usuario.token_acesso || usuario.token_acesso === "SEM-TOKEN") return;
    navigator.clipboard.writeText(usuario.token_acesso);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="w-full border shadow-xl rounded-2xl bg-background overflow-hidden">
      <CardHeader className="text-center pb-2 bg-gradient-to-b from-primary/5 via-transparent to-transparent">
        <div className="mx-auto bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-2">
          <UserCheck className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-xl font-bold tracking-tight text-foreground truncate max-w-xs mx-auto">
          {usuario.nome_completo}
        </CardTitle>
        <CardDescription className="uppercase text-[10px] tracking-widest font-extrabold text-primary pt-1">
          Acesso {usuario.perfil.toLowerCase()}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col items-center space-y-6 pt-4 pb-8">
        <div className="p-4 bg-white border rounded-2xl flex flex-col items-center justify-center shadow-inner transition hover:scale-102 duration-200">
          <QRCodeSVG
            value={usuario.token_acesso}
            size={160}
            level="H"
            includeMargin={false}
          />
          <span className="text-[9px] font-bold tracking-widest text-muted-foreground mt-3 uppercase">
            Código do Terminal
          </span>
        </div>

        <div className="w-full space-y-2 text-center px-2">
          <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground block">
            Token de Autenticação
          </span>

          <div className="flex items-center justify-between gap-2 bg-muted/50 border rounded-xl p-2 pl-4 max-w-[280px] mx-auto shadow-sm backdrop-blur-sm">
            <div
              onClick={handleCopyToClipboard}
              className="font-mono font-bold text-base tracking-widest cursor-pointer text-primary hover:opacity-80 transition select-all truncate"
              title="Clique para copiar"
            >
              {usuario.token_acesso}
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0 hover:bg-background"
              onClick={handleCopyToClipboard}
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <Copy className="h-4 w-4 text-muted-foreground" />
              )}
            </Button>
          </div>

          {copied && (
            <p className="text-[11px] text-green-600 font-semibold animate-pulse pt-1">
              Copiado com sucesso!
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
