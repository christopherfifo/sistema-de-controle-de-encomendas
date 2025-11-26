import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { HistoricoPorteiroPageContent } from "@/app/(app)/[slug]/pages/historicoPorteiroPage";
import { StatusEncomenda } from "@prisma/client";

beforeAll(() => {
    window.HTMLElement.prototype.scrollIntoView = jest.fn();
    window.HTMLElement.prototype.hasPointerCapture = jest.fn(() => false);
    window.HTMLElement.prototype.setPointerCapture = jest.fn();
    window.HTMLElement.prototype.releasePointerCapture = jest.fn();
});

jest.mock("@/app/(app)/[slug]/components/encomendasHistoricoList", () => ({
    EncomendasHistoricoList: ({ encomendas }: any) => (
        <div data-testid="lista-mock">
            {encomendas.length === 0 ? <p>Nenhuma encomenda</p> : null}
            {encomendas.map((enc: any) => (
                <div key={enc.id_encomenda} data-testid="item-encomenda">
                    {enc.tipo_encomenda}
                </div>
            ))}
        </div>
    ),
}));

const PORTEIRO_LOGADO_ID = "porteiro-logado-123";
const OUTRO_PORTEIRO_ID = "porteiro-outro-999";

const mockEncomendas = [
    {
        id_encomenda: "1",
        tipo_encomenda: "Pacote Meu Entregue",
        status: StatusEncomenda.ENTREGUE,
        id_porteiro_recebimento: PORTEIRO_LOGADO_ID,
        unidade: { bloco_torre: "A", numero_unidade: "101" },
    },
    {
        id_encomenda: "2",
        tipo_encomenda: "Pacote Meu Cancelado",
        status: StatusEncomenda.CANCELADA,
        id_porteiro_recebimento: PORTEIRO_LOGADO_ID,
        unidade: { bloco_torre: "A", numero_unidade: "102" },
    },
    {
        id_encomenda: "3",
        tipo_encomenda: "Pacote Outro Entregue",
        status: StatusEncomenda.ENTREGUE,
        id_porteiro_recebimento: OUTRO_PORTEIRO_ID,
        unidade: { bloco_torre: "B", numero_unidade: "201" },
    },
];

describe("Página de Histórico do Porteiro", () => {

    const renderPage = () =>
        render(
            <HistoricoPorteiroPageContent
                encomendasDoHistorico={mockEncomendas as any}
                condominioName="Condomínio Teste"
                porteiroId={PORTEIRO_LOGADO_ID}
            />
        );

    it("deve renderizar todas as encomendas inicialmente (Filtros: Todos + Todos)", () => {
        renderPage();

        expect(screen.getByText("Pacote Meu Entregue")).toBeInTheDocument();
        expect(screen.getByText("Pacote Meu Cancelado")).toBeInTheDocument();
        expect(screen.getByText("Pacote Outro Entregue")).toBeInTheDocument();

        expect(screen.getByText("Resultados (3)")).toBeInTheDocument();
    });

    it("deve filtrar por 'Meus Registros'", () => {
        renderPage();

        const btnMeusRegistros = screen.getByLabelText("Minhas encomendas");
        fireEvent.click(btnMeusRegistros);

        expect(screen.getByText("Pacote Meu Entregue")).toBeInTheDocument();
        expect(screen.getByText("Pacote Meu Cancelado")).toBeInTheDocument();

        expect(screen.queryByText("Pacote Outro Entregue")).not.toBeInTheDocument();

        expect(screen.getByText("Resultados (2)")).toBeInTheDocument();
    });

    it("deve filtrar por Status 'Canceladas'", () => {
        renderPage();

        const btnCanceladas = screen.getByLabelText("Apenas canceladas");
        fireEvent.click(btnCanceladas);

        expect(screen.getByText("Pacote Meu Cancelado")).toBeInTheDocument();

        expect(screen.queryByText("Pacote Meu Entregue")).not.toBeInTheDocument();
        expect(screen.queryByText("Pacote Outro Entregue")).not.toBeInTheDocument();

        expect(screen.getByText("Resultados (1)")).toBeInTheDocument();
    });

    it("deve combinar filtros (Meus Registros + Entregues)", () => {
        renderPage();

        fireEvent.click(screen.getByLabelText("Minhas encomendas"));

        fireEvent.click(screen.getByLabelText("Apenas entregues"));

        expect(screen.getByText("Pacote Meu Entregue")).toBeInTheDocument();

        expect(screen.queryByText("Pacote Meu Cancelado")).not.toBeInTheDocument();
        expect(screen.queryByText("Pacote Outro Entregue")).not.toBeInTheDocument();

        expect(screen.getByText("Resultados (1)")).toBeInTheDocument();
    });

    it("deve mostrar estado vazio se o filtro não encontrar nada", () => {
        renderPage();

        fireEvent.click(screen.getByLabelText("Minhas encomendas"));


    });

    it("deve lidar com lista vazia vinda do servidor", () => {
        render(
            <HistoricoPorteiroPageContent
                encomendasDoHistorico={[]}
                condominioName="Condomínio Teste"
                porteiroId={PORTEIRO_LOGADO_ID}
            />
        );

        expect(screen.getByText("Resultados (0)")).toBeInTheDocument();
        expect(screen.getByText("Nenhuma encomenda")).toBeInTheDocument();
    });
});