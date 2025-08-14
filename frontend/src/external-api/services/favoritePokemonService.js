const API_URL = "http://localhost:3001";

export const favoritePokemonService = {
  addFavorite: async (pokemonName, token) => {
    const response = await fetch(`${API_URL}/favorites`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ pokemonName }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Erro ao adicionar Pokémon favorito."
      );
    }

    const data = await response.json();
    return { data };
  },
  getFavorites: async (email) => {
    const response = await fetch(`${API_URL}/favorites`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ email }),
    });
  },
};
