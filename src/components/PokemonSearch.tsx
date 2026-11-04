import { useEffect, useState, type FormEvent } from "react";
import { fetchPokemon } from "../pokemonService";
import type { Pokemon } from "../types";
import PokemonResult from "./PokemonResult";

const DEFAULT_QUERY = "pikachu";

export default function PokemonSearch() {
  // Lo que se escribe vs. lo que se busca.
  const [inputValue, setInputValue] = useState<string>("");
  const [query, setQuery] = useState<string>(DEFAULT_QUERY);

  // Semáforo de estados: tres variables independientes.
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<Pokemon | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    // El callback del efecto no puede ser async: se declara dentro y se invoca.
    const fetchData = async (): Promise<void> => {
      setLoading(true);
      setError(null);
      try {
        const pokemon = await fetchPokemon(query, controller.signal);
        setData(pokemon); // Éxito
      } catch (err: unknown) {
        if (controller.signal.aborted) return; // cancelación voluntaria
        setData(null);
        setError(
          err instanceof Error ? err.message : "Ocurrió un error inesperado.",
        );
      } finally {
        if (!controller.signal.aborted) setLoading(false); // apagar el spinner
      }
    };

    void fetchData();

    return () => controller.abort(); // limpieza: cancela la petición obsoleta
  }, [query]); // solo corre cuando cambia la búsqueda confirmada

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const clean = inputValue.trim().toLowerCase();
    if (clean === "") return;
    setQuery(clean); // dispara el efecto
  };

  return (
    <section>
      <form className="search" onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Nombre o número (ej: pikachu, 25)"
          aria-label="Nombre o número del Pokémon"
        />
        <button type="submit">Buscar</button>
      </form>

      <PokemonResult loading={loading} data={data} error={error} />
    </section>
  );
}
