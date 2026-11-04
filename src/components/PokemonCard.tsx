import { useEffect, useState } from "react";

interface PokemonData {
  name: string;
  height: number;
  weight: number;
  sprites: { front_default: string | null };
  types: { type: { name: string } }[];
}

export default function PokemonCard({ nombre }: { nombre: string }) {
  const [pokemon, setPokemon] = useState<PokemonData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`https://pokeapi.co/api/v2/pokemon/${nombre.toLowerCase()}`)
      .then((res) => {
        if (!res.ok) throw new Error("No se encontró el Pokémon");
        return res.json() as Promise<PokemonData>;
      })
      .then(setPokemon)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [nombre]);

  if (loading) return <p>Cargando…</p>;
  if (error) return <p>Error: {error}</p>;
  if (!pokemon) return null;

  return (
    <div>
      <h3>{pokemon.name}</h3>
      {pokemon.sprites.front_default && (
        <img src={pokemon.sprites.front_default} alt={pokemon.name} />
      )}
      <p>Tipo: {pokemon.types.map((t) => t.type.name).join(", ")}</p>
      <p>
        Altura: {pokemon.height} | Peso: {pokemon.weight}
      </p>
    </div>
  );
}