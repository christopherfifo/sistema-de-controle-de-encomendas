
import React from "react";
import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LoginForm } from "@/app/login/loginForm";

const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
    useRouter: () => ({
        push: mockPush,
    }),
}));

jest.mock("@/app/login/helpers/actionsLogin", () => ({
    authenticate: jest.fn(),
}));

import { authenticate } from "@/app/login/helpers/actionsLogin";

describe("Página de Login", () => {
    const user = userEvent.setup();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("deve validar campos obrigatórios vazios", async () => {
        render(<LoginForm />);
        const submitBtn = screen.getByRole("button", { name: /entrar/i });
        await user.click(submitBtn);

        await waitFor(() => {
            const erros = screen.queryAllByText(/(obrigatório|inválido)/i);
            expect(erros.length).toBeGreaterThan(0);
        });
    });

    it("deve alternar a visibilidade da senha", async () => {
        render(<LoginForm />);

        const passwordInput = screen.getByPlaceholderText("••••••••");
        const toggleBtn = screen.getByLabelText(/mostrar senha/i);

        expect(passwordInput).toHaveAttribute("type", "password");
        await user.click(toggleBtn);
        expect(passwordInput).toHaveAttribute("type", "text");
        await user.click(toggleBtn);
        expect(passwordInput).toHaveAttribute("type", "password");
    });

    it("deve realizar login com sucesso e redirecionar", async () => {
        (authenticate as jest.Mock).mockResolvedValue({
            success: "Login bem-sucedido!",
            userId: "user-123",
            perfil: "MORADOR",
            condominioId: "cond-abc",
        });

        render(<LoginForm />);

        await user.type(screen.getByLabelText(/email ou cpf/i), "teste@email.com");
        await user.type(screen.getByPlaceholderText("••••••••"), "12345678");

        await user.click(screen.getByRole("button", { name: /entrar/i }));

        await waitFor(() => {
            expect(authenticate).toHaveBeenCalledWith({
                login: "teste@email.com",
                password: "12345678",
            });
        });

        await waitFor(() => {
            expect(mockPush).toHaveBeenCalledWith(
                "/cond-abc?user=user-123&perfil=MORADOR"
            );
        });
    });

    it("deve exibir mensagem de erro se o login falhar", async () => {
        (authenticate as jest.Mock).mockResolvedValue({
            error: "Credenciais inválidas.",
        });

        render(<LoginForm />);

        await user.type(screen.getByLabelText(/email ou cpf/i), "errado@email.com");

        await user.type(screen.getByPlaceholderText("••••••••"), "senhaerrada123");

        await user.click(screen.getByRole("button", { name: /entrar/i }));

        await waitFor(() => {
            expect(screen.getByText("Credenciais inválidas.")).toBeInTheDocument();
        });
    });
});