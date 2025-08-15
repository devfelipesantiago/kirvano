import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, it, expect, beforeEach } from "vitest";
import LoginPage from "../src/auth/components/LoginPage";
import { authService } from "../src/auth/services/authService";
import { useAuth } from "../src/auth/context/AuthContext";

vi.mock("../src/auth/services/authService");

vi.mock("../src/auth/context/AuthContext");

describe("LoginPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAuth).mockReturnValue({
      login: vi.fn(),
      logout: vi.fn(),
      user: null,
    });
  });

  it("deve renderizar o formulário de login", () => {
    render(<LoginPage />);

    expect(screen.getByRole("heading", { name: /Login/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/E-mail/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Senha/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Entrar/i })).toBeInTheDocument();
  });

  it("deve mostrar mensagem de erro ao submeter com dados inválidos", async () => {
    const mockAuthContextLogin = useAuth().login;
    const errorMessage = "Usuário ou senha inválidos";

    vi.mocked(authService.login).mockRejectedValueOnce(new Error(errorMessage));

    render(<LoginPage />);

    const emailInput = screen.getByLabelText(/E-mail/i);
    const passwordInput = screen.getByLabelText(/Senha/i);
    const submitButton = screen.getByRole("button", { name: /Entrar/i });

    await userEvent.type(emailInput, "invalid@example.com");
    await userEvent.type(passwordInput, "wrongpassword");
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText("Usuário ou senha inválidos")
      ).toBeInTheDocument();

      expect(screen.getByText(`${errorMessage}`)).toBeInTheDocument();
    });

    expect(mockAuthContextLogin).not.toHaveBeenCalled();
  });
});
