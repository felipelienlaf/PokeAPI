import type { Pokemon, PokemonApiResponse } from "./types";

const API_URL = "https://pokeapi.co/api/v2/pokemon";

// Retraso artificial para que el estado "Cargando" sea visible.
// Desafío Nivel 1: cambiar a 0 y comparar la experiencia.
const SIMULATED_DELAY_MS = 800;

// Espera una cantidad de milisegundos y se cancela si la señal se aborta.
const wait = (ms: number, signal?: AbortSignal): Promise<void> =>
  new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException("Petición cancelada", "AbortError"));
      return;
    }
    const timer = setTimeout(resolve, ms);
    signal?.addEventListener(
      "abort",
      () => {
        clearTimeout(timer);
        reject(new DOMException("Petición cancelada", "AbortError"));
      },
      { once: true },
    );
  });

export async function fetchPokemon(
  query: string,
  signal?: AbortSignal,
): Promise<Pokemon> {
  await wait(SIMULATED_DELAY_MS, signal);

  let res: Response;
  try {
    res = await fetch(`${API_URL}/${encodeURIComponent(query)}`, { signal });
  } catch (err: unknown) {
    // Cancelación voluntaria: se deja pasar para que la ignore el componente.
    if (signal?.aborted) throw err;
    // fetch solo falla por problemas de red.
    // Se adjunta { cause: err } para preservar la causa original exigida por ESLint.
    throw new Error("No hay conexión con el servidor. Revisa tu internet.", {
      cause: err,
    });
  }

  // fetch NO lanza error con 404 o 500, por eso se valida el status.
  if (res.status === 404) {
    throw new Error(`No existe ningún Pokémon con el código "${query}".`);
  }
  if (!res.ok) {
    throw new Error(`Error del servidor (HTTP ${res.status}).`);
  }

  const raw = (await res.json()) as PokemonApiResponse; // ¡no olvidar el await!

  return {
    id: raw.id,
    name: raw.name,
    types: raw.types.map((t) => t.type.name),
    abilities: raw.abilities.map((a) => a.ability.name),
    imageUrl: raw.sprites.front_default,
  };
}