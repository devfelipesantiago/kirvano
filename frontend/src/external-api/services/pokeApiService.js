const POKEAPI_BASE_URL = "https://pokeapi.co/api/v2";

export const pokeApiService = {
  getPokemonList: async (offset) => {
    const limit = 10;
    const response = await fetch(
      `${POKEAPI_BASE_URL}/pokemon?limit=${limit}&offset=${offset}`
    );

    if (!response.ok) {
      throw new Error("Erro ao buscar a lista de Pokémon.");
    }

    const data = await response.json();
    return { data };
  },
};
