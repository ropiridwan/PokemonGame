import {makeAutoObservable} from 'mobx';
import axios from 'axios';

class PokemonStore {
  pokemonList = [];
  pokemonDetails = {};
  pokemonStats = [];
  nextUrl = 'https://pokeapi.co/api/v2/pokemon?limit=25';
  loading = false;

  constructor() {
    makeAutoObservable(this);
  }

  fetchPokemonList = async () => {
    if (this.loading) return;
    this.loading = true;
    try {
      const response = await axios.get(this.nextUrl);
      this.pokemonList = [...this.pokemonList, ...response.data.results];
      this.nextUrl = response.data.next;
    } catch (error) {
      console.error('Failed to fetch Pokémon list:', error);
    } finally {
      this.loading = false;
    }
  };

  fetchPokemonDetails = async url => {
    if (this.pokemonDetails[url]) return this.pokemonDetails[url];
    try {
      const response = await axios.get(url);
      this.pokemonDetails[url] = response.data;
      this.pokemonStats = response.data.stats.map(item => ({
        name: item.stat.name,
        value: item.base_stat,
      }));
      return response.data;
    } catch (error) {
      console.error('Failed to fetch Pokémon details:', error);
      return null;
    }
  };
}

const pokemonStore = new PokemonStore();
export default pokemonStore;
