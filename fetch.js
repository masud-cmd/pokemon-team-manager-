export let allPokemon = [];

export async function fetchPokemon() {
	const maxPokemon = 151;

	try {
		const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${maxPokemon}`);
		const data = await response.json();
		const results = data.results;

		const pokemonDetails = await Promise.all(results.map(async (pokemon) => {
			const response = await fetch(pokemon.url);
			const details = await response.json();
			return {
				name: pokemon.name,
				image: details.sprites.other['official-artwork'].front_default,
			};
		}));

		allPokemon = pokemonDetails;
		console.log(allPokemon);

	} catch (error) {
		console.error('Error fetching Pokémon data:', error);
	}
}

