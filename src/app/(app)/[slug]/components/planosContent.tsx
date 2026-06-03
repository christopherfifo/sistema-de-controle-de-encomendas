"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, ArrowUpCircle, ArrowDownCircle, CheckCircle2, AlertCircle } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState, useTransition } from "react";
import { changeCondominioPlan } from "../planos/actions";
import { useRouter } from "next/navigation";

interface Plano {
  id_plano: string;
  nome_plano: string;
  valor: number;
  limite_unidades: number;
}

interface PlanosContentProps {
  condominioId: string;
  currentPlanoId: string | null;
  availablePlanos: Plano[];
}

export function PlanosContent({ condominioId, currentPlanoId, availablePlanos }: PlanosContentProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [selectedPlanToChange, setSelectedPlanToChange] = useState<Plano | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const currentPlan = availablePlanos.find(p => p.id_plano === currentPlanoId) || availablePlanos[0];

  const handlePlanChange = () => {
    if (!selectedPlanToChange) return;
    setErrorMsg(null);
    startTransition(async () => {
      const res = await changeCondominioPlan(condominioId, selectedPlanToChange.id_plano);
      if (res.success) {
        setSuccess(true);
        setTimeout(() => {
          setIsDialogOpen(false);
          setSuccess(false);
          router.refresh();
        }, 2000);
      } else {
        setErrorMsg(res.error || "Ocorreu um erro ao alterar o plano.");
      }
    });
  };

  const openDialog = (plan: Plano) => {
    setSelectedPlanToChange(plan);
    setIsDialogOpen(true);
    setErrorMsg(null);
    setSuccess(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Planos & Assinatura</h2>
        <p className="text-muted-foreground">
          Gerencie o plano atual do seu condomínio e explore opções de upgrade ou downgrade.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-primary/20 bg-primary/5 lg:col-span-3">
          <CardHeader>
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              <CardTitle>Plano Atual</CardTitle>
            </div>
            <CardDescription>Sua assinatura vigente no momento.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-2xl font-bold text-primary">{currentPlan?.nome_plano || "Nenhum Plano"}</div>
            {currentPlan && (
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  Até {currentPlan.limite_unidades} Unidades
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  Valor: R$ {Number(currentPlan.valor).toFixed(2).replace('.', ',')} / mês
                </li>
              </ul>
            )}
          </CardContent>
        </Card>

        {availablePlanos.filter(p => p.id_plano !== currentPlan?.id_plano).map((plano) => {
          const isUpgrade = currentPlan ? plano.valor > currentPlan.valor : true;
          return (
            <Card key={plano.id_plano}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  {isUpgrade ? (
                    <ArrowUpCircle className="h-5 w-5 text-primary" />
                  ) : (
                    <ArrowDownCircle className="h-5 w-5 text-muted-foreground" />
                  )}
                  <CardTitle>{plano.nome_plano}</CardTitle>
                </div>
                <CardDescription>
                  {isUpgrade ? "Aumente seus limites e recursos." : "Reduza seus limites e economize."}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 flex flex-col justify-between h-[calc(100%-100px)]">
                <div>
                  <div className="text-2xl font-bold">R$ {Number(plano.valor).toFixed(2).replace('.', ',')} / mês</div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Limite de {plano.limite_unidades} unidades.
                  </p>
                </div>
                <Button 
                  variant={isUpgrade ? "default" : "outline"} 
                  className="w-full" 
                  onClick={() => openDialog(plano)}
                >
                  {isUpgrade ? "Fazer Upgrade" : "Fazer Downgrade"}
                </Button>
              </CardContent>
            </Card>
          );
        })}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            {!success ? (
              <>
                <DialogHeader>
                  <DialogTitle>Alterar para {selectedPlanToChange?.nome_plano}</DialogTitle>
                  <DialogDescription>
                    Você está preste a mudar a assinatura do seu condomínio.
                  </DialogDescription>
                </DialogHeader>

                {errorMsg && (
                  <div className="bg-red-50 text-red-900 border border-red-200 p-4 rounded-md flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 mt-0.5 shrink-0" />
                    <div>
                      <h4 className="font-semibold text-sm">Erro</h4>
                      <p className="text-sm mt-1">{errorMsg}</p>
                    </div>
                  </div>
                )}

                <div className="py-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b pb-2">
                      <span className="font-medium">Nova Mensalidade</span>
                      <span className="font-bold">
                        R$ {selectedPlanToChange ? Number(selectedPlanToChange.valor).toFixed(2).replace('.', ',') : "0,00"} / mês
                      </span>
                    </div>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        Limite de {selectedPlanToChange?.limite_unidades} unidades
                      </li>
                    </ul>
                  </div>
                </div>
                <Button onClick={handlePlanChange} disabled={isPending} className="w-full">
                  {isPending ? "Processando..." : "Confirmar Alteração"}
                </Button>
              </>
            ) : (
              <div className="py-6 text-center space-y-4">
                <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                </div>
                <DialogTitle>Alteração Realizada com Sucesso!</DialogTitle>
                <DialogDescription>
                  O seu condomínio agora está no {selectedPlanToChange?.nome_plano}. A página será atualizada.
                </DialogDescription>
              </div>
            )}
          </DialogContent>
        </Dialog>

      </div>
    </div>
  );
}