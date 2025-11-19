
import React from "react";
import "@testing-library/jest-dom";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { HomePageSaasContent } from "@/app/(app)/[slug]/pages/homePageSaas";
import { CadastroEncomendaPageContent } from "@/app/(app)/[slug]/pages/cadastroEncomendaPage";

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
        <input type="hidden" value={value || ""} onChange={() => { }} />
        {children}
      </MockSelectContext.Provider>
    ),
    SelectTrigger: ({ children, id }: any) => (
      <button role="combobox" id={id} data-testid="select-trigger" type="button">
        {children}
      </button>
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
  cadastrarEncomendaMorador: jest.fn(),
  cancelarEncomendaMorador: jest.fn(),
}));

import { cadastrarEncomendaMorador } from "@/app/(app)/[slug]/helpers/encomendas";

const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

const mockInfoCondominio: any = {
  condominio: { nome_condominio: "Condomínio Teste" },
  user: { nome_completo: "Morador Teste" },
};

const mockEncomendasPendentes: any[] = [
  {
    id_encomenda: "enc-1",
    tipo_encomenda: "Pacote Amazon",
    status: "PENDENTE",
    unidade: { bloco_torre: "A", numero_unidade: "101" },
    id_usuario_cadastro: "user-123",
  },
];

const mockUnidadesDoMorador = [
  {
    unidade: {
      id_unidade: "550e8400-e29b-41d4-a716-446655440000",
      bloco_torre: "A",
      numero_unidade: "101",
    },
  },
];

describe("Fluxo do Morador", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Dashboard (HomePage)", () => {
    it("deve renderizar o painel e a lista de encomendas", () => {
      render(
        <HomePageSaasContent
          slug="cond-slug"
          user="user-123"
          perfil="MORADOR"
          informationsOfUserAndCondominio={mockInfoCondominio}
          encomendasPendentes={mockEncomendasPendentes}
          userId="user-123"
        />
      );

      expect(screen.getByText("Painel de Encomendas")).toBeInTheDocument();
      expect(screen.getByText("Pacote Amazon")).toBeInTheDocument();

      const unidades = screen.getAllByText(/101/);
      expect(unidades.length).toBeGreaterThan(0);
    });
  });

  describe("Formulário de Pré-cadastro", () => {
    it("deve preencher e enviar o pré-cadastro de encomenda", async () => {
      render(
        <CadastroEncomendaPageContent
          unidadesDoMorador={mockUnidadesDoMorador}
          userId="user-123"
          condominioSlug="cond-slug"
        />
      );

      const selectTrigger = screen.getByText("Selecione a unidade...");
      fireEvent.click(selectTrigger);
      const opcaoUnidade = await screen.findByText(/101/);
      fireEvent.click(opcaoUnidade);

      const inputTipo = screen.getByPlaceholderText("Ex: Pacote, Caixa, Envelope");
      await user.clear(inputTipo);
      await user.type(inputTipo, "Notebook Dell");

      const inputEntregador = screen.getByPlaceholderText("Ex: Correios, Amazon, ML");
      await user.clear(inputEntregador);
      await user.type(inputEntregador, "DHL Express");

      const selectTamanho = screen.getByText("Selecione o tamanho...");
      fireEvent.click(selectTamanho);
      const opcaoGrande = await screen.findByText("Grande");
      fireEvent.click(opcaoGrande);

      const btnSalvar = screen.getByRole("button", { name: /cadastrar encomenda/i });
      await user.click(btnSalvar);

      await waitFor(() => {
        expect(cadastrarEncomendaMorador).toHaveBeenCalledTimes(1);
        expect(cadastrarEncomendaMorador).toHaveBeenCalledWith(
          "user-123",
          "cond-slug",
          expect.objectContaining({
            tipo_encomenda: "Notebook Dell",
            forma_entrega: "DHL Express",
            tamanho: "Grande"
          })
        );
      });
    });
  });
});