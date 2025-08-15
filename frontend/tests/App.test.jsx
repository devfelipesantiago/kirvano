import React from "react";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import App from "../src/App.jsx";
import { useAuth } from "../src/auth/context/AuthContext.jsx";

vi.mock("../src/auth/context/AuthContext.jsx", () => ({
  useAuth: vi.fn(),
}));
vi.mock("../src/pages/ProtectedRoute.jsx", () => ({
  default: ({ children }) => <div>{children}</div>,
}));
vi.mock("../src/auth/components/LoginPage.jsx", () => ({
  default: () => <div>Login Page</div>,
}));
vi.mock("../src/auth/components/RegisterPage.jsx", () => ({
  default: () => <div>Register Page</div>,
}));
vi.mock("../src/external-api/components/PokemonList.jsx", () => ({
  default: () => <div>Pokemon List Page</div>,
}));
vi.mock("../src/pages/ProfilePage.jsx", () => ({
  default: () => <div>Profile Page</div>,
}));

describe("App", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve renderizar links de login e registro quando o usuário não está logado", () => {
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      logout: vi.fn(),
    });

    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByRole("link", { name: /Home/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Login/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Registro/i })).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /Pokemons/i })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /Perfil/i })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /Sair/i })
    ).not.toBeInTheDocument();
  });

  it("deve renderizar links de pokemons e perfil quando o usuário está logado", () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { token: "fake-token", email: "test@example.com" },
      logout: vi.fn(),
    });

    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByRole("link", { name: /Home/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Pokemons/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Perfil/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Sair/i })).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /Login/i })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /Registro/i })
    ).not.toBeInTheDocument();
  });

  it("deve renderizar a página correta com base na rota", () => {
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      logout: vi.fn(),
    });

    render(
      <MemoryRouter initialEntries={["/login"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText("Login Page")).toBeInTheDocument();
    cleanup();

    render(
      <MemoryRouter initialEntries={["/register"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText("Register Page")).toBeInTheDocument();
  });

  it('deve chamar a função de logout ao clicar no botão "Sair"', async () => {
    const mockLogout = vi.fn();
    vi.mocked(useAuth).mockReturnValue({
      user: { token: "fake-token", email: "test@example.com" },
      logout: mockLogout,
    });

    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    const logoutButton = screen.getByRole("button", { name: /Sair/i });
    await userEvent.click(logoutButton);

    expect(mockLogout).toHaveBeenCalledTimes(1);
  });
});
