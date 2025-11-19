import React from "react";
import "@testing-library/jest-dom";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FormRegistrarEncomenda } from "@/app/(app)/[slug]/components/formRegistrarEncomenda";
import { ListaEncomendasPorteiro } from "@/app/(app)/[slug]/components/listaEncomendasPorteiro";

beforeAll(() => {
  window.HTMLElement.prototype.scrollIntoView = jest.fn();
  window.HTMLElement.prototype.hasPointerCapture = jest.fn(() => false);
  window.HTMLElement.prototype.setPointerCapture = jest.fn();
  window.HTMLElement.prototype.releasePointerCapture = jest.fn();
});

window.alert = jest.fn();

jest.mock("@/components/ui/select", () => {
  const React = require("react");
  const MockSelectContext = React.createContext({ onValueChange: (val: string) => { } });

  return {
    Select: ({ onValueChange, children, value }: any) => (
      <MockSelectContext.Provider value={{ onValueChange }}>
        {children}
      </MockSelectContext.Provider>
    ),
    SelectTrigger: ({ children }: any) => (
      <div role="button" className="mock-trigger">
        {children}
      </div>
    ),
    SelectValue: ({ placeholder }: any) => <span>{placeholder}</span>,
    SelectContent: ({ children }: any) => <div>{children}</div>,
    SelectItem: ({ value, children }: any) => {
      const { onValueChange } = React.useContext(MockSelectContext);
      return (
        <div
          role="option"
          className="mock-option"
          onClick={(e) => {
            e.stopPropagation();
            onValueChange(value);
          }}
        >
          {children}
        </div>
      );
    },
  };
});

jest.mock("@/app/(app)/[slug]/helpers/encomendas", () => ({
  registrarEncomendaPorteiro: jest.fn(),
  getMoradoresDaUnidade: jest.fn(),
  registrarRetiradaEncomenda: jest.fn(),
}));

import {
  registrarEncomendaPorteiro,
  getMoradoresDaUnidade,
  registrarRetiradaEncomenda,
} from "@/app/(app)/[slug]/helpers/encomendas";

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    refresh: jest.fn(),
  }),
}));

const UUID_UNIDADE = "550e8400-e29b-41d4-a716-446655440000";
const UUID_MORADOR = "123e4567-e89b-12d3-a456-426614174000";

const mockUnidades = [
  { id_unidade: UUID_UNIDADE, bloco_torre: "A", numero_unidade: "101" },
];

const mockMoradores = [
  { id_usuario: UUID_MORADOR, nome_completo: "João da Silva" },
];

const mockEncomenda = {
  id_encomenda: "enc-1",
  tipo_encomenda: "Caixa Grande",
  tamanho: "Médio",
  forma_entrega: "Correios",
  codigo_rastreio: "BR123",
  condicao: "Intacta",
  status: "PENDENTE",
  data_recebimento: new Date(),
  id_unidade: UUID_UNIDADE,
  id_usuario_cadastro: null,
  id_porteiro_recebimento: "porteiro-1",
  url_foto_pacote: null,
  unidade: { bloco_torre: "A", numero_unidade: "101" },
};

describe("Fluxo do Porteiro", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Formulário de Registro de Encomenda", () => {
    it("deve preencher e submeter o formulário com sucesso", async () => {
      (registrarEncomendaPorteiro as jest.Mock).mockResolvedValue({
        success: true,
        message: "Sucesso",
      });

      render(
        <FormRegistrarEncomenda
          unidades={mockUnidades}
          porteiroId="porteiro-123"
          condominioId="cond-abc"
        />
      );

      const triggerUnidade = screen.getByText("Selecione a unidade...");
      fireEvent.click(triggerUnidade);

      const opcaoUnidade = await screen.findByText("A - 101");
      fireEvent.click(opcaoUnidade);

      await user.type(screen.getByLabelText(/tipo/i), "Caixa Misteriosa");

      const triggerTamanho = screen.getByText("Selecione o tamanho...");
      fireEvent.click(triggerTamanho);

      const opcaoTamanho = await screen.findByText("Médio");
      fireEvent.click(opcaoTamanho);

      await user.type(screen.getByLabelText(/transportadora/i), "Amazon");

      const btnSalvar = screen.getByRole("button", { name: /registrar encomenda/i });
      await user.click(btnSalvar);

      await waitFor(() => {
        expect(registrarEncomendaPorteiro).toHaveBeenCalledTimes(1);
        expect(registrarEncomendaPorteiro).toHaveBeenCalledWith(
          "porteiro-123",
          "cond-abc",
          expect.objectContaining({
            id_unidade: UUID_UNIDADE,
            tipo_encomenda: "Caixa Misteriosa",
            forma_entrega: "Amazon",
            tamanho: "Médio"
          })
        );
      });
    });
  });

  describe("Lista e Modal de Retirada", () => {
    it("deve abrir o modal, carregar moradores e registrar retirada", async () => {
      (getMoradoresDaUnidade as jest.Mock).mockResolvedValue(mockMoradores);
      (registrarRetiradaEncomenda as jest.Mock).mockResolvedValue({
        success: true,
        message: "Retirada registrada",
      });

      render(
        <ListaEncomendasPorteiro
          encomendasIniciais={[mockEncomenda as any]}
          porteiroId="porteiro-123"
          condominioId="cond-abc"
        />
      );

      const accordionTrigger = screen.getByText(/Caixa Grande/i);
      await user.click(accordionTrigger);

      const btnRetirada = await screen.findByRole("button", { name: /registrar retirada/i });
      await user.click(btnRetirada);

      await waitFor(() => {
        expect(getMoradoresDaUnidade).toHaveBeenCalledWith(UUID_UNIDADE, "cond-abc");
      });

      const triggerMorador = await screen.findByText("Selecione o morador...");
      fireEvent.click(triggerMorador);

      const opcaoMorador = await screen.findByText("João da Silva");
      fireEvent.click(opcaoMorador);

      await user.type(screen.getByLabelText(/documento/i), "123456");

      const btnConfirmar = screen.getByRole("button", { name: /confirmar retirada/i });
      await user.click(btnConfirmar);

      await waitFor(() => {
        expect(registrarRetiradaEncomenda).toHaveBeenCalledWith(
          expect.objectContaining({
            id_usuario_retirada: UUID_MORADOR,
            documento_retirante: "123456",
          }),
          "enc-1",
          "porteiro-123"
        );
      });
    });
  });
});