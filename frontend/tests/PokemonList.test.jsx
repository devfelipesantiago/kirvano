import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, it, expect, beforeEach } from "vitest";
import PokemonList from "../src/external-api/components/PokemonList";
import { pokeApiService } from "../src/external-api/services/pokeApiService";
import { favoritePokemonService } from "../src/external-api/services/favoritePokemonService";
import { useAuth } from "../src/auth/context/AuthContext";

vi.mock("../src/external-api/services/pokeApiService");
vi.mock("../src/external-api/services/favoritePokemonService");
vi.mock("../src/auth/context/AuthContext");

global.fetch = vi.fn();

const mockPokemonList = {
  data: {
    results: [
      { name: "bulbasaur", url: "https://pokeapi.co/api/v2/pokemon/1/" },
      { name: "charmander", url: "https://pokeapi.co/api/v2/pokemon/4/" },
    ],
  },
};

const mockPokemonDetails = [
  {
    name: "bulbasaur",
    sprites: { front_default: "bulbasaur.png" },
    abilities: [{ ability: { name: "overgrow" } }],
  },
  {
    name: "charmander",
    sprites: { front_default: "charmander.png" },
    abilities: [{ ability: { name: "blaze" } }],
  },
];

describe("PokemonList", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAuth).mockReturnValue({
      login: vi.fn(),
      logout: vi.fn(),
      user: null,
    });
    vi.mocked(pokeApiService.getPokemonList).mockResolvedValue(mockPokemonList);
    global.fetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockPokemonDetails[0]),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockPokemonDetails[1]),
      });
  });

  it("deve renderizar a lista de pokemons após o carregamento", async () => {
    render(<PokemonList />);

    expect(screen.getByText("Carregando Pokemons...")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Lista de Pokemons")).toBeInTheDocument();
    });

    expect(screen.getByText("bulbasaur")).toBeInTheDocument();
    expect(screen.getByText("charmander")).toBeInTheDocument();
    expect(screen.getByText("Habilidades: overgrow")).toBeInTheDocument();
  });

  it("deve mostrar mensagem de erro se a busca da lista falhar", async () => {
    vi.mocked(pokeApiService.getPokemonList).mockRejectedValueOnce(
      new Error("Erro ao buscar a lista de Pokémon.")
    );

    render(<PokemonList />);

    await waitFor(() => {
      expect(
        screen.getByText("Não foi possível carregar a lista de Pokemons.")
      ).toBeInTheDocument();
    });
  });

  it("deve mostrar mensagem de feedback ao tentar favoritar sem estar logado", async () => {
    render(<PokemonList />);

    await waitFor(() => {
      expect(screen.getByText("Lista de Pokemons")).toBeInTheDocument();
    });

    const favoriteButton = screen.getAllByRole("button", {
      name: "Favoritar",
    })[0];
    await userEvent.click(favoriteButton);

    await waitFor(() => {
      expect(
        screen.getByText("Faça login para favoritar um Pokémon.")
      ).toBeInTheDocument();
    });
  });

  it("deve favoritar um pokemon com sucesso quando o usuário está logado", async () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { token: "fake-token", email: "test@example.com" },
      login: vi.fn(),
      logout: vi.fn(),
    });

    const mockAddFavorite = vi.mocked(favoritePokemonService.addFavorite);
    mockAddFavorite.mockResolvedValueOnce({ data: { message: "success" } });

    render(<PokemonList />);

    await waitFor(() => {
      expect(screen.getByText("Lista de Pokemons")).toBeInTheDocument();
    });

    const favoriteButton = screen.getAllByRole("button", {
      name: "Favoritar",
    })[0];
    await userEvent.click(favoriteButton);

    await waitFor(() => {
      expect(mockAddFavorite).toHaveBeenCalledWith("bulbasaur", "fake-token");
      expect(
        screen.getByText("bulbasaur adicionado aos favoritos!")
      ).toBeInTheDocument();
    });
  });

  it("deve navegar para a próxima página de pokemons", async () => {
    const mockPokemonListNextPage = {
      data: {
        results: [
          { name: "pikachu", url: "https://pokeapi.co/api/v2/pokemon/25/" },
        ],
      },
    };
    const mockPokemonDetailsNextPage = [
      {
        name: "pikachu",
        sprites: { front_default: "pikachu.png" },
        abilities: [{ ability: { name: "static" } }],
      },
    ];

    vi.mocked(pokeApiService.getPokemonList)
      .mockResolvedValueOnce(mockPokemonList)
      .mockResolvedValueOnce(mockPokemonListNextPage);

    global.fetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockPokemonDetails[0]),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockPokemonDetails[1]),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockPokemonDetailsNextPage[0]),
      });

    render(<PokemonList />);

    await waitFor(() => {
      expect(screen.getByText("bulbasaur")).toBeInTheDocument();
    });

    const nextPageButton = screen.getAllByRole("button", {
      name: "Próxima",
    })[0];
    await userEvent.click(nextPageButton);

    await waitFor(() => {
      expect(screen.getByText("bulbasaur")).toBeInTheDocument();
    });
  });
});
