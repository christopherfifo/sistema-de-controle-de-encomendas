import React from "react";
import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SindicoDashboard } from "@/app/(app)/[slug]/pages/sindicoDashboard";

jest.mock("@/app/(app)/[slug]/helpers/actionSindico", () => ({
    adicionarUnidade: jest.fn(),
}));

import { adicionarUnidade } from "@/app/(app)/[slug]/helpers/actionSindico";

window.alert = jest.fn();

const mockPlano = {
    nome_plano: "Plano Ouro",
    limite_unidades: 5,
};

const mockUnidadesExistentes = [
    { id_unidade: "u1", bloco_torre: "Bloco A", numero_unidade: "101" },
    { id_unidade: "u2", bloco_torre: "Bloco A", numero_unidade: "102" },
];

const mockCondominioData: any = {
    id_condominio: "cond-123",
    nome_condominio: "Residencial Flores",
    qtd_unidades: 2,
    plano: mockPlano,
    unidades: mockUnidadesExistentes,
};

describe("Dashboard do Síndico", () => {
    const user = userEvent.setup();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("deve renderizar as informações do condomínio e a lista de unidades", () => {
        render(
            <SindicoDashboard
                condominioData={mockCondominioData}
                sindicoId="sindico-123"
            />
        );

        expect(screen.getByText("Configuração do Condomínio")).toBeInTheDocument();
        expect(screen.getByText(/Residencial Flores/i)).toBeInTheDocument();

        expect(screen.getByText("2 / 5")).toBeInTheDocument();
        expect(screen.getByText(/3 unidades restantes/i)).toBeInTheDocument();

        const blocos = screen.getAllByText("Bloco A");
        expect(blocos).toHaveLength(2);

        expect(screen.getByText("101")).toBeInTheDocument();
        expect(screen.getByText("102")).toBeInTheDocument();
    });

    it("deve exibir mensagem de lista vazia quando não houver unidades", () => {
        const dadosSemUnidade = {
            ...mockCondominioData,
            unidades: [],
            qtd_unidades: 0,
        };

        render(
            <SindicoDashboard
                condominioData={dadosSemUnidade}
                sindicoId="sindico-123"
            />
        );

        expect(screen.getByText("Nenhuma unidade cadastrada. Adicione uma acima.")).toBeInTheDocument();
    });

    it("deve impedir o envio e mostrar erros se campos estiverem vazios", async () => {
        render(
            <SindicoDashboard
                condominioData={mockCondominioData}
                sindicoId="sindico-123"
            />
        );

        const btnSalvar = screen.getByRole("button", { name: /cadastrar unidade/i });
        await user.click(btnSalvar);

        await waitFor(() => {
            expect(screen.getAllByText(/obrigatório/i).length).toBeGreaterThan(0);
        });

        expect(adicionarUnidade).not.toHaveBeenCalled();
    });

    it("deve preencher o formulário e chamar a action de adicionar unidade", async () => {
        (adicionarUnidade as jest.Mock).mockResolvedValue({
            success: true,
            message: "Unidade adicionada com sucesso!",
        });

        render(
            <SindicoDashboard
                condominioData={mockCondominioData}
                sindicoId="sindico-123"
            />
        );

        const inputBloco = screen.getByPlaceholderText("Ex: Bloco A, Torre 1");
        await user.type(inputBloco, "Bloco B");

        const inputNumero = screen.getByPlaceholderText("Ex: 101, 204");
        await user.type(inputNumero, "201");

        const btnSalvar = screen.getByRole("button", { name: /cadastrar unidade/i });
        await user.click(btnSalvar);

        await waitFor(() => {
            expect(adicionarUnidade).toHaveBeenCalledTimes(1);
            expect(adicionarUnidade).toHaveBeenCalledWith(
                {
                    bloco_torre: "Bloco B",
                    numero_unidade: "201",
                },
                "cond-123",
                "sindico-123"
            );
        });
    });

    it("deve desabilitar o formulário se o limite de unidades foi atingido", () => {
        const dadosLimiteAtingido = {
            ...mockCondominioData,
            plano: { ...mockPlano, limite_unidades: 2 },
            unidades: mockUnidadesExistentes,
        };

        render(
            <SindicoDashboard
                condominioData={dadosLimiteAtingido}
                sindicoId="sindico-123"
            />
        );

        expect(screen.getByText("2 / 2")).toBeInTheDocument();
        expect(screen.getByText(/0 unidades restantes/i)).toBeInTheDocument();

        const inputBloco = screen.getByPlaceholderText("Ex: Bloco A, Torre 1");
        const inputNumero = screen.getByPlaceholderText("Ex: 101, 204");
        const btnSalvar = screen.getByRole("button", { name: /limite atingido/i });

        expect(inputBloco).toBeDisabled();
        expect(inputNumero).toBeDisabled();
        expect(btnSalvar).toBeDisabled();
    });
});