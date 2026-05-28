"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Encomenda, Unidade } from "@prisma/client";
import { PackagePlus, PackageSearch, ClipboardCheck } from "lucide-react";
import { FormRegistrarEncomenda } from "./formRegistrarEncomenda";
import { ListaEncomendasPorteiro } from "./listaEncomendasPorteiro";
import { ListaAvisosMoradores } from "./listaAvisosMoradores";

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
  encomendasPendentes = [],
  unidadesDoCondominio,
  porteiroId,
  condominioId,
}: PorteiroDashboardProps) {
  
  const avisosMoradores = encomendasPendentes.filter(
    (enc) => enc.id_usuario_cadastro !== null && enc.id_porteiro_recebimento === null
  );

  const pendentesRetirada = encomendasPendentes.filter(
    (enc) => enc.id_porteiro_recebimento !== null
  );

  return (
    <Tabs defaultValue="avisos" className="w-full">
      <TabsList className="grid w-full grid-cols-3 md:w-[600px]">
        <TabsTrigger value="avisos">
          <ClipboardCheck className="h-4 w-4 mr-2" />
          Avisos de Moradores ({avisosMoradores.length})
        </TabsTrigger>
        <TabsTrigger value="registrar">
          <PackagePlus className="h-4 w-4 mr-2" />
          Registrar Surpresa
        </TabsTrigger>
        <TabsTrigger value="pendentes">
          <PackageSearch className="h-4 w-4 mr-2" />
          Dar Retirada ({pendentesRetirada.length})
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
  );
}