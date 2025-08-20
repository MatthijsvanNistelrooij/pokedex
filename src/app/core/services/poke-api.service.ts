import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PokeApiService {
  private baseUrl = 'https://pokeapi.co/api/v2';

  constructor(private http: HttpClient) {}

  getPokemonList(limit: number = 151, offset: number = 0): Observable<any> {
    return this.http.get(
      `${this.baseUrl}/pokemon?limit=${limit}&offset=${offset}`,
    );
  }

  getPokemonDetails(id: string | number): Observable<any> {
    return this.http.get(`${this.baseUrl}/pokemon/${id}`);
  }

  getPokemonSpecies(id: string | number): Observable<any> {
    return this.http.get(`${this.baseUrl}/pokemon-species/${id}`);
  }

  getEvolutionChain(id: string | number): Observable<any> {
    return this.http.get(`${this.baseUrl}/evolution-chain/${id}`);
  }
}
