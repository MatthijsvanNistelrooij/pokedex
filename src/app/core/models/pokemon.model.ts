export interface PokemonListItem {
  name: string;
  url: string;
  image: string;
}

export interface PokemonDetail {
  id: number;
  name: string;
  sprites: { front_default: string };
  types: { type: { name: string } }[];
  abilities: { ability: { name: string } }[];
  height: number;
  weight: number;
}
