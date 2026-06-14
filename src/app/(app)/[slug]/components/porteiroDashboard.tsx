"use client";

import { useState, useEffect, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Encomenda, Unidade } from "@prisma/client";
import { PackagePlus, PackageSearch, ClipboardCheck, RefreshCw } from "lucide-react";
import { FormRegistrarEncomenda } from "./formRegistrarEncomenda";
import { ListaEncomendasPorteiro } from "./listaEncomendasPorteiro";
import { ListaAvisosMoradores } from "./listaAvisosMoradores";
import { useRouter } from "next/navigation";

type EncomendaComUnidadeEMorador = Encomenda & {
  usuario_cadastro?: {
    nome_completo: string;
  } | null;
  unidade: Pick<Unidade, "bloco_torre" | "numero_unidade"> & {
    moradores: {
      usuario: {
        id_usuario: string;
        nome_completo: string;
      };
    }[];
  };
};

interface PorteiroDashboardProps {
  encomendasPendentes: EncomendaComUnidadeEMorador[];
  unidadesDoCondominio: Pick<
    Unidade,
    "id_unidade" | "bloco_torre" | "numero_unidade"
  >[];
  porteiroId: string;
  condominioId: string;
}

export function PorteiroDashboard({
  encomendasPendentes: encomendasIniciais = [],
  unidadesDoCondominio,
  porteiroId,
  condominioId,
}: PorteiroDashboardProps) {
  const router = useRouter();
  const [encomendas, setEncomendas] = useState<EncomendaComUnidadeEMorador[]>(encomendasIniciais);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    setEncomendas(encomendasIniciais);
  }, [encomendasIniciais]);

  const refreshData = useCallback(() => {
    setIsRefreshing(true);
    router.refresh();
    setTimeout(() => setIsRefreshing(false), 1000);
  }, [router]);

  useEffect(() => {
    const interval = setInterval(() => {
      refreshData();
    }, 30000);

    return () => clearInterval(interval);
  }, [refreshData]);

  const avisosMoradores = encomendas.filter(
    (enc) =>
      enc.id_usuario_cadastro !== null && enc.id_porteiro_recebimento === null,
  );

  const pendentesRetirada = encomendas.filter(
    (enc) => enc.id_porteiro_recebimento !== null,
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button 
          onClick={refreshData}
          disabled={isRefreshing}
          className="flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-primary transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`h-3 w-3 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? "Sincronizando..." : "Sincronizar agora"}
        </button>
      </div>

      <Tabs defaultValue="avisos" className="w-full">
        <TabsList className="flex flex-col sm:grid sm:grid-cols-3 w-full h-auto gap-2 p-1 md:w-[600px]">
          <TabsTrigger value="avisos">
            <ClipboardCheck className="h-4 w-4 mr-2" />
            Avisos ({avisosMoradores.length})
          </TabsTrigger>
          <TabsTrigger value="registrar">
            <PackagePlus className="h-4 w-4 mr-2" />
            Registrar Surpresa
          </TabsTrigger>
          <TabsTrigger value="pendentes">
            <PackageSearch className="h-4 w-4 mr-2" />
            Retirada ({pendentesRetirada.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="avisos" className="mt-4">
          <ListaAvisosMoradores
            avisosIniciais={avisosMoradores}
            porteiroId={porteiroId}
          />
        </TabsContent>

        <TabsContent value="registrar" className="mt-4">
          <FormRegistrarEncomenda
            unidades={unidadesDoCondominio}
            porteiroId={porteiroId}
            condominioId={condominioId}
          />
        </TabsContent>

        <TabsContent value="pendentes" className="mt-4">
          <ListaEncomendasPorteiro
            encomendasIniciais={pendentesRetirada}
            porteiroId={porteiroId}
            condominioId={condominioId}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
