import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, it, expect } from "vitest";
import RegisterPage from "../src/auth/components/RegisterPage.jsx";
import { authService } from "../src/auth/services/authService.js";

vi.mock("../src/auth/services/authService.js");

describe("RegisterPage", () => {
  it("deve renderizar o formulário de registro", () => {
    render(<RegisterPage />);

    expect(
      screen.getByRole("heading", { name: /Registro/i })
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/Nome:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Senha:/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Registrar/i })
    ).toBeInTheDocument();
  });

  it("deve mostrar mensagem de sucesso e limpar os campos ao registrar com sucesso", async () => {
    authService.register.mockResolvedValueOnce({
      data: { message: "Registro realizado com sucesso!" },
    });

    render(<RegisterPage />);

    const nameInput = screen.getByLabelText(/Nome:/i);
    const emailInput = screen.getByLabelText(/Email:/i);
    const passwordInput = screen.getByLabelText(/Senha:/i);
    const registerButton = screen.getByRole("button", { name: /Registrar/i });

    await userEvent.type(nameInput, "João da Silva");
    await userEvent.type(emailInput, "joao@example.com");
    await userEvent.type(passwordInput, "password123");
    await userEvent.click(registerButton);

    await waitFor(() => {
      expect(
        screen.getByText("Registro realizado com sucesso!")
      ).toBeInTheDocument();
    });

    expect(nameInput).toHaveValue("");
    expect(emailInput).toHaveValue("");
    expect(passwordInput).toHaveValue("");
  });

  it("deve mostrar mensagem de erro ao falhar o registro", async () => {
    const errorMessage = "Erro ao registrar usuário.";
    authService.register.mockRejectedValueOnce(new Error(errorMessage));

    render(<RegisterPage />);

    const nameInput = screen.getByLabelText(/Nome:/i);
    const emailInput = screen.getByLabelText(/Email:/i);
    const passwordInput = screen.getByLabelText(/Senha:/i);
    const registerButton = screen.getByRole("button", { name: /Registrar/i });

    await userEvent.type(nameInput, "João da Silva");
    await userEvent.type(emailInput, "joao@example.com");
    await userEvent.type(passwordInput, "password123");
    await userEvent.click(registerButton);

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });
});
