import React, { use, useEffect, useState } from 'react';
import { pokeApiService } from '../services/pokeApiService.js';
import { favoritePokemonService } from '../services/favoritePokemonService';
import { useAuth } from '../../auth/context/AuthContext.jsx';

const PokemonList = () => {
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState({ message: '', type: '' });

  const { user } = useAuth();

  useEffect(() => {
    const fetchAllPokemonData = async () => {
      try {
        setLoading(true);
        const { data } = await pokeApiService.getPokemonList();

        const detailedPokemonPromises = data.results.map(pokemon => 
          fetch(pokemon.url).then(res => res.json())
        );

        const detailedPokemons = await Promise.all(detailedPokemonPromises);

        const formattedPokemons = detailedPokemons.map(p => ({
          name: p.name,
          imageUrl: p.sprites.front_default,
          abilities: p.abilities.map(a => a.ability.name),
        }));

        setPokemons(formattedPokemons);
      } catch (err) {
        console.error('Erro ao buscar dados dos Pokemons:', err);
        setError('Não foi possível carregar a lista de Pokemons.');
      } finally {
        setLoading(false);
      }
    };
    fetchAllPokemonData();
  }, []);

  const handleFavoriteClick = async (pokemonName) => {
    if (!user) {
      setFeedback({ message: 'Faça login para favoritar um Pokémon.', type: 'error' });
      return;
    }

    try {
      await favoritePokemonService.addFavorite(pokemonName, user.token);
      setFeedback({ message: `${pokemonName} adicionado aos favoritos!`, type: 'success' });
    } catch (err) {
      setFeedback({ message: err.message, type: 'error' });
    }
  };

  if (loading) {
    return <section className="section-card">Carregando Pokemons...</section>;
  }

  if (error) {
    return <section className="section-card" style={{ color: 'var(--error-color)' }}>{error}</section>;
  }

  return (
    <section className="section-card">
      <h2>Lista de Pokemons</h2>
      {feedback.message && (
        <p style={{ 
          color: feedback.type === 'success' ? 'var(--success-color)' : 'var(--error-color)',
          marginBottom: '1rem'
        }}>
          {feedback.message}
        </p>
      )}
      <ul className="pokemon-list">
        {pokemons.map((pokemon) => (
          <li className="pokemon-card" key={pokemon.name}>
            <div className="pokemon-card-content">
                <img src={pokemon.imageUrl} alt={pokemon.name} className="pokemon-image" />
                <div>
                  <h3>{pokemon.name}</h3>
                  <p className="pokemon-abilities">
                    Habilidades: {pokemon.abilities.join(', ')}
                  </p>
                </div>
            </div>
            <button 
              className="btn btn-favorite"
              onClick={() => handleFavoriteClick(pokemon.name)}
              >
              Favoritar
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default PokemonList;