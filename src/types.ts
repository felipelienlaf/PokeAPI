// Forma de la respuesta de la PokéAPI (solo los campos que usamos).
export interface PokemonApiResponse {
  id: number;
  name: string;
  types: { slot: number; type: { name: string } }[];
  abilities: { slot: number; is_hidden: boolean; ability: { name: string } }[];
  sprites: { front_default: string | null };
}

// Modelo que usa nuestra interfaz. Si la API cambia, solo se modifica el servicio.
export interface Pokemon {
  id: number;
  name: string;
  types: string[];
  abilities: string[];
  imageUrl: string | null;
}
