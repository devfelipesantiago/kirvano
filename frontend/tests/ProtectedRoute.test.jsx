import React from "react";
import { render, screen } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { Navigate } from "react-router-dom";
import ProtectedRoute from "../src/pages/ProtectedRoute";
import { useAuth } from "../src/auth/context/AuthContext";

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    Navigate: vi.fn(() => null),
  };
});

vi.mock("../src/auth/context/AuthContext", () => ({
  useAuth: vi.fn(),
}));

describe("ProtectedRoute", () => {
  const TestChildren = () => <div>Conteúdo Protegido</div>;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve renderizar os filhos se o usuário estiver logado", () => {
    vi.mocked(useAuth).mockReturnValue({ user: { token: "fake-token" } });
    render(
      <ProtectedRoute>
        <TestChildren />
      </ProtectedRoute>
    );

    expect(screen.getByText("Conteúdo Protegido")).toBeInTheDocument();
    expect(Navigate).not.toHaveBeenCalled();
  });

  it("deve redirecionar para a página de login se o usuário não estiver logado", () => {
    vi.mocked(useAuth).mockReturnValue({ user: null });
    render(
      <ProtectedRoute>
        <TestChildren />
      </ProtectedRoute>
    );
    expect(Navigate).toHaveBeenCalledWith(
      { to: "/login", replace: true },
      undefined
    );
    expect(screen.queryByText("Conteúdo Protegido")).not.toBeInTheDocument();
  });
});
