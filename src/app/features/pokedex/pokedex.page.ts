import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf, TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PokeApiService } from '../../core/services/poke-api.service';
import { PokemonListItem } from '../../core/models/pokemon.model';

@Component({
  selector: 'app-pokedex',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule, TitleCasePipe],
  templateUrl: './pokedex.page.html',
  styleUrls: ['./pokedex.page.scss'],
})
export class PokedexPage implements OnInit {
  pokemons: PokemonListItem[] = [];
  filteredPokemons: PokemonListItem[] = [];
  searchTerm: string = '';

  selectedPokemon: PokemonListItem | null = null;
  pokemonDetails: any = null;
  evolutions: any[] = [];

  constructor(private pokeApi: PokeApiService) {}

  ngOnInit(): void {
    this.pokeApi.getPokemonList().subscribe((data: any) => {
      const results = data.results;
      console.log('Results from API:', results);

      this.pokemons = results.map((pokemon: { name: string; url: string }) => ({
        ...pokemon,
        image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.url
          .split('/')
          .filter(Boolean)
          .pop()}.png`,
      }));

      console.log('Mapped pokemons:', this.pokemons);

      this.filteredPokemons = this.pokemons;

      const savedTeam = localStorage.getItem('pokemonTeam');
      if (savedTeam) {
        this.team = JSON.parse(savedTeam);
      }
    });
  }

  filterPokemons() {
    if (!this.searchTerm) {
      this.filteredPokemons = this.pokemons;
    } else {
      this.filteredPokemons = this.pokemons.filter((pokemon) =>
        pokemon.name.toLowerCase().includes(this.searchTerm.toLowerCase()),
      );
    }
  }

  selectPokemon(pokemon: PokemonListItem) {
    if (this.selectedPokemon?.name === pokemon.name) {
      this.selectedPokemon = null;
      this.pokemonDetails = null;
      this.evolutions = [];
      return;
    }

    this.selectedPokemon = pokemon;

    const id = pokemon.url.split('/').filter(Boolean).pop();

    this.pokeApi.getPokemonDetails(id!).subscribe((data) => {
      this.pokemonDetails = data;
    });

    this.pokeApi.getPokemonSpecies(id!).subscribe((species) => {
      const evoId = species.evolution_chain.url
        .split('/')
        .filter(Boolean)
        .pop();
      this.pokeApi.getEvolutionChain(evoId!).subscribe((evo) => {
        this.evolutions = this.parseEvolutionChain(evo.chain);
      });
    });
  }

  private parseEvolutionChain(chain: any): any[] {
    const result: any[] = [];
    let current = chain;
    while (current) {
      result.push(current.species);
      current = current.evolves_to[0];
    }
    return result;
  }

  team: any[] = [];

  addToTeam(pokemon: any) {
    if (!pokemon) return;

    if (this.team.length >= 6) {
      alert('Your team is full!');
      return;
    }
    if (this.team.find((p) => p.name === pokemon.name)) {
      alert(`${pokemon.name} is already in your team!`);
      return;
    }

    this.team.push(pokemon);

    localStorage.setItem('pokemonTeam', JSON.stringify(this.team));
  }

  removeFromTeam(pokemon: any) {
    this.team = this.team.filter((p) => p.name !== pokemon.name);

    localStorage.setItem('pokemonTeam', JSON.stringify(this.team));
  }

  toggleDetails(pokemon: PokemonListItem) {
    if (this.selectedPokemon?.name === pokemon.name) {
      this.selectedPokemon = null;
      this.pokemonDetails = null;
      this.evolutions = [];
      return;
    }

    this.selectPokemon(pokemon);
  }

  getTeamSlots() {
    const slots = [...this.team];
    while (slots.length < 6) {
      slots.push(null);
    }
    return slots;
  }

  isInTeam(pokemon: any) {
    return this.team.some((member) => member.name === pokemon.name);
  }
}
