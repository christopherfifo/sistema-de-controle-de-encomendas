"use client";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Encomenda, Unidade } from "@prisma/client";
import { PackagePlus, PackageSearch } from "lucide-react";
import { FormRegistrarEncomenda } from "./formRegistrarEncomenda";
import { ListaEncomendasPorteiro } from "./listaEncomendasPorteiro";

interface PorteiroDashboardProps {
  encomendasPendentes: (Encomenda & {
    unidade: Pick<Unidade, "bloco_torre" | "numero_unidade">;
  })[];
  unidadesDoCondominio: Pick<Unidade, "id_unidade" | "bloco_torre" | "numero_unidade">[];
  porteiroId: string;
  condominioId: string;
}

export function PorteiroDashboard({
  encomendasPendentes,
  unidadesDoCondominio,
  porteiroId,
  condominioId,
}: PorteiroDashboardProps) {
  
  return (
    <Tabs defaultValue="registrar" className="w-full">
      <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
        <TabsTrigger value="registrar">
          <PackagePlus className="h-4 w-4 mr-2" />
          Registrar Encomenda
        </TabsTrigger>
        <TabsTrigger value="pendentes">
          <PackageSearch className="h-4 w-4 mr-2" />
          Pendentes de Retirada
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="registrar" className="mt-4">
        <FormRegistrarEncomenda
          unidades={unidadesDoCondominio}
          porteiroId={porteiroId}
          condominioId={condominioId}
        />
      </TabsContent>
      
      <TabsContent value="pendentes" className="mt-4">
        <ListaEncomendasPorteiro
          encomendasIniciais={encomendasPendentes}
          porteiroId={porteiroId}
          condominioId={condominioId}
        />
      </TabsContent>
    </Tabs>
  );
}