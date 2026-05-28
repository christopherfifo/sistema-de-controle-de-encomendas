"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Copy, Check, Link2, Plus, Sparkles } from "lucide-react";

interface CondominioData {
  id_condominio: string;
  nome_condominio: string;
  slug: string;
}

interface GerenciarLinksCadastroContentProps {
  condominios: CondominioData[];
}

export function GerenciarLinksCadastroContent({ condominios }: GerenciarLinksCadastroContentProps) {
  const [copiadoUrl, setCopiadoUrl] = useState<string | null>(null);
  
  const [condominioSelecionado, setCondominioSelecionado] = useState(condominios[0]?.slug || "");
  const [origemLink, setOrigemLink] = useState(""); 
  const [linkGeradoNaHora, setLinkGeradoNaHora] = useState("");

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";

  const handleCopiar = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiadoUrl(id);
    setTimeout(() => setCopiadoUrl(null), 2000);
  };

  const handleGerarLinkNaHora = (e: React.FormEvent) => {
    e.preventDefault();
    if (!condominioSelecionado) return;

    let url = `${baseUrl}/cadastroMorador?condominio=${condominioSelecionado}`;
    
    if (origemLink.trim()) {
      url += `&utm_source=${encodeURIComponent(origemLink.trim())}`;
    }

    setLinkGeradoNaHora(url);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Links de Cadastro de Moradores</h2>
        <p className="text-muted-foreground">
          Compartilhe os links abaixo para que os novos moradores realizem o auto-cadastro no sistema.
        </p>
      </div>

      <Separator />

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Link2 className="h-5 w-5 text-primary" /> Links Permanentes
            </CardTitle>
            <CardDescription>
              Links fixos de cada condomínio sob sua gestão. Ideal para fixar no mural ou bio do condomínio.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {condominios.map((condo) => {
              const urlPermanente = `${baseUrl}/cadastroMorador?condominio=${condo.slug}`;
              const estáCopiado = copiadoUrl === condo.id_condominio;

              return (
                <div key={condo.id_condominio} className="p-3 bg-muted/40 border rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm text-card-foreground">{condo.nome_condominio}</span>
                    <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-mono">
                      Ref: {condo.slug}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Input value={urlPermanente} readOnly className="h-8 text-xs bg-background" />
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 gap-1.5"
                      onClick={() => handleCopiar(urlPermanente, condo.id_condominio)}
                    >
                      {estáCopiado ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5" />}
                      {estáCopiado ? "Copiado" : "Copiar"}
                    </Button>
                  </div>
                </div>
              );
            })}
            {condominios.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">Nenhum condomínio vinculado.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-amber-500" /> Gerar Link Personalizado
            </CardTitle>
            <CardDescription>
              Crie um link específico na hora, útil para campanhas de cadastramento ou rastreamento de origem.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleGerarLinkNaHora} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="condo-select">Selecionar Condomínio</Label>
                <select
                  id="condo-select"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={condominioSelecionado}
                  onChange={(e) => setCondominioSelecionado(e.target.value)}
                >
                  {condominios.map((c) => (
                    <option key={c.id_condominio} value={c.slug}>
                      {c.nome_condominio}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="origem">Origem/Identificador do Link (Opcional)</Label>
                <Input
                  id="origem"
                  placeholder="Ex: whatsapp-grupo, qr-code-elevador"
                  value={origemLink}
                  onChange={(e) => setOrigemLink(e.target.value)}
                />
              </div>

              <Button type="submit" className="w-full gap-1.5">
                <Plus className="h-4 w-4" /> Criar Link Agora
              </Button>
            </form>

            {linkGeradoNaHora && (
              <div className="mt-6 p-4 bg-amber-50/50 dark:bg-amber-950/10 border border-amber-200 rounded-xl space-y-2 animate-in fade-in-50 duration-300">
                <Label className="text-xs font-bold text-amber-800 dark:text-amber-300">Link Gerado com Sucesso:</Label>
                <div className="flex gap-2">
                  <Input value={linkGeradoNaHora} readOnly className="h-9 text-xs bg-background border-amber-200" />
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-9 border-amber-200 text-amber-800 hover:bg-amber-100/50"
                    onClick={() => handleCopiar(linkGeradoNaHora, "gerado-na-hora")}
                  >
                    {copiadoUrl === "gerado-na-hora" ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}