import type { Pokemon } from "../types";

interface PokemonResultProps {
  loading: boolean;
  data: Pokemon | null;
  error: string | null;
}

const formatName = (name: string): string =>
  name.charAt(0).toUpperCase() + name.slice(1);

export default function PokemonResult({
  loading,
  data,
  error,
}: PokemonResultProps) {
  // Guard clauses: se evalúan en orden y terminan la función apenas una se cumple.
  if (loading) {
    return (
      <p className="status status-loading" role="status">
        ⏳ Cargando Pokémon…
      </p>
    );
  }
  if (error) {
    return (
      <p className="status status-error" role="alert">
        ⚠️ Ups: {error}
      </p>
    );
  }
  if (!data) return null;

  // Si llegamos aquí, TypeScript sabe que data existe y está tipada.
  return (
    <article className="card">
      {data.imageUrl && (
        <img src={data.imageUrl} alt={data.name} width={160} height={160} />
      )}
      <h2>
        #{data.id} {formatName(data.name)}
      </h2>

      <h3>Tipos</h3>
      <ul className="chips">
        {data.types.map((t) => (
          <li key={t}>{formatName(t)}</li>
        ))}
      </ul>

      <h3>Habilidades</h3>
      <ul>
        {data.abilities.map((a) => (
          <li key={a}>{formatName(a)}</li>
        ))}
      </ul>
    </article>
  );
}
