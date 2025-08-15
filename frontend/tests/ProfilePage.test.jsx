import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import ProfilePage from "../src/pages/ProfilePage";
import { useAuth } from "../src/auth/context/AuthContext";
import { authService } from "../src/auth/services/authService";

vi.mock("../src/auth/context/AuthContext", () => ({
  useAuth: vi.fn(),
}));

vi.mock("../src/auth/services/authService");

describe("ProfilePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve exibir mensagem de carregamento inicialmente", () => {
    vi.mocked(useAuth).mockReturnValue({ user: { token: "fake-token" } });
    vi.mocked(authService.getUserProfile).mockResolvedValue({
      data: [{ name: "Test User", email: "test@example.com" }],
    });
    render(<ProfilePage />);

    expect(screen.getByText("Carregando perfil...")).toBeInTheDocument();
  });

  it("deve exibir os dados do perfil após o carregamento bem-sucedido", async () => {
    const mockProfileData = [{ name: "Test User", email: "test@example.com" }];
    vi.mocked(useAuth).mockReturnValue({ user: { token: "fake-token" } });
    vi.mocked(authService.getUserProfile).mockResolvedValue({
      data: mockProfileData,
    });

    render(<ProfilePage />);

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: "Meu Perfil" })
      ).toBeInTheDocument();
    });

    expect(screen.getByText("Nome:")).toBeInTheDocument();
    expect(screen.getByText("Test User")).toBeInTheDocument();
    expect(screen.getByText("E-mail:")).toBeInTheDocument();
    expect(screen.getByText("test@example.com")).toBeInTheDocument();
  });

  it("deve exibir uma mensagem de erro se a busca do perfil falhar", async () => {
    const errorMessage = "Erro no servidor";
    vi.mocked(useAuth).mockReturnValue({ user: { token: "fake-token" } });
    vi.mocked(authService.getUserProfile).mockRejectedValue(
      new Error(errorMessage)
    );

    render(<ProfilePage />);

    await waitFor(() => {
      expect(
        screen.getByText(`Erro ao carregar perfil: ${errorMessage}`)
      ).toBeInTheDocument();
    });
  });

  it("deve exibir uma mensagem de erro se o token do usuário não estiver disponível", async () => {
    vi.mocked(useAuth).mockReturnValue({ user: { token: undefined } });

    render(<ProfilePage />);

    await waitFor(() => {
      expect(
        screen.getByText(
          "Erro ao carregar perfil: Token de usuário não encontrado."
        )
      ).toBeInTheDocument();
    });
  });
});
