import { fetchPokemon, allPokemon } from './fetch.js';

document.addEventListener('DOMContentLoaded', async () => {
	const firstPage = document.getElementById('firstPage');
	const secondPage = document.getElementById('secondPage');
	const findChampionsTab = document.getElementById('findChampionsTab');
	const myTeamTab = document.getElementById('myTeamTab');
	const searchInput = document.getElementById('search-input');
	const nicknameInput = document.getElementById('nickname-input');
	const pokemonListContainer = document.getElementById('pokemon-list');
	const myTeamContainer = document.getElementById('my-team-list');
	const reserveListContainer = document.getElementById('reserve-list');

	let myTeam = [];
	let reserveList = [];
	let currentPokemonList = [];

	findChampionsTab.addEventListener('click', () => {
		switchPage('firstPage');
	});

	myTeamTab.addEventListener('click', () => {

		if (myTeam.length >= 3) {
			switchPage('secondPage');
			renderMyTeamWithActions();
			renderReserveList();
			hidePokemonList();
		} else {

			alert('Please add at least 3 Pokémon to your team before viewing.');
		}
	});


	searchInput.addEventListener('input', (event) => {
		const searchTerm = event.target.value.toLowerCase().trim();
		filterAndRenderPokemonList(searchTerm);
	});

	function addToTeam(pokemonName) {
		const nicknameInput = document.getElementById('nickname-input');
		const nickname = nicknameInput.value.trim();
		if (myTeam.length >= 3) {
			alert("you have reached the limit of allowed team members.")
		}

		myTeam.push({ name: pokemonName, nickname: nickname });
		if (myTeam.length > 3) {
			myTeam.pop()
		}

		renderMyTeamWithActions();


		nicknameInput.value = '';
	}



	function addToReserve(pokemonName) {
		if (!reserveList.includes(pokemonName)) {
			reserveList.push(pokemonName);
			renderReserveList();
		}
	}

	function removeFromTeam(pokemonName, nickname) {
		console.log('Removing:', pokemonName, nickname);

		const updatedTeam = myTeam.filter(pokemon => {
			const nameMatch = pokemon.name === pokemonName;
			const nicknameMatch = nickname === undefined || pokemon.nickname === nickname;
			return !(nameMatch && nicknameMatch);
		});

		console.log('After removal:', updatedTeam);

		if (updatedTeam.length !== myTeam.length) {
			myTeam = updatedTeam;
			renderMyTeamWithActions();
			renderReserveList();
		}
	}

	function switchPage(page) {
		if (page === 'firstPage') {
			firstPage.classList.remove('invisible');
			secondPage.classList.add('invisible');
			renderPokemonList();
		} else if (page === 'secondPage') {
			firstPage.classList.add('invisible');
			secondPage.classList.remove('invisible');
			renderMyTeamWithActions();
			renderReserveList();
			hidePokemonList();
		}
	}

	function hidePokemonList() {
		pokemonListContainer.style.display = 'none';
	}

	function filterAndRenderPokemonList(searchTerm) {
		const filteredPokemon = currentPokemonList.filter(pokemon => pokemon.name.includes(searchTerm));
		renderPokemonList(filteredPokemon);
	}

	function renderPokemonList(pokemonList) {
		currentPokemonList = pokemonList || allPokemon;
		pokemonListContainer.innerHTML = '';

		currentPokemonList.forEach((pokemon) => {
			const imageUrl = pokemon.image;
			const pokemonEntry = createPokemonEntry(pokemon.name, imageUrl);
			pokemonListContainer.appendChild(pokemonEntry);
		});

		pokemonListContainer.style.display = (currentPokemonList.length > 0) ? 'block' : 'none';
	}
	function renderMyTeamWithActions() {
		myTeamContainer.innerHTML = '';

		const uniquePokemon = Array.from(new Set(myTeam.map(pokemon => pokemon.name)));

		uniquePokemon.forEach((pokemonName) => {
			const pokemonInstances = myTeam.filter(pokemon => pokemon.name === pokemonName);

			pokemonInstances.forEach((pokemon) => {
				const imageUrl = allPokemon.find(p => p.name === pokemon.name)?.image;
				const pokemonEntry = createTeamEntryWithActions(pokemon.name, pokemon.nickname, imageUrl);
				myTeamContainer.appendChild(pokemonEntry);
			});
		});
	}


	function renderReserveList() {
		reserveListContainer.innerHTML = '';

		reserveList.forEach((pokemonName) => {
			const imageUrl = allPokemon.find(p => p.name === pokemonName)?.image;
			const pokemonEntry = createTeamEntry(pokemonName, true, imageUrl);
			reserveListContainer.appendChild(pokemonEntry);
		});
	}

	function createPokemonEntry(name, imageUrl) {
		console.log('Creating Pokemon Entry:', name);


		const nicknameId = `nickname-${name}`;
		const addToTeamId = `add-to-team-${name}`;
		const addToReserveId = `add-to-reserve-${name}`;

		const pokemonEntry = document.createElement('div');
		pokemonEntry.classList.add('champion');
		pokemonEntry.innerHTML = `
        <div class="image" style="background-image: url(${imageUrl})"></div>
        <div>
            <h2>${name}</h2>
            
            <button class="add-to-team-button" id="${addToTeamId}" data-pokemon="${name}" data-nickname-id="${nicknameId}">Add to team</button>
            <button class="add-to-reserve-button" id="${addToReserveId}" data-pokemon="${name}">Add to reserve</button>
        </div>
    `;

		const addToTeamButton = pokemonEntry.querySelector(`#${addToTeamId}`);
		addToTeamButton.addEventListener('click', () => {
			addToTeam(name, nicknameId);
		});

		const addToReserveButton = pokemonEntry.querySelector(`#${addToReserveId}`);
		addToReserveButton.addEventListener('click', () => {
			addToReserve(name);
		});

		return pokemonEntry;
	}

	function createTeamEntryWithActions(name, nickname = '', imageUrl) {
		console.log('Creating Team Entry with Actions:', name, nickname);

		const teamEntry = document.createElement('div');
		teamEntry.classList.add('team-member');

		if (imageUrl) {
			const imageDiv = document.createElement('div');
			imageDiv.classList.add('image');
			imageDiv.style.backgroundImage = `url(${imageUrl})`;

			const contentDiv = document.createElement('div');
			const displayName = nickname ? nickname : name;
			contentDiv.innerHTML = `
            <h2>${displayName}</h2>
            <button class="remove-from-team-button" data-pokemon="${name}" data-nickname="${nickname}">Remove</button>
        `;

			teamEntry.appendChild(imageDiv);
			teamEntry.appendChild(contentDiv);
		} else {
			const displayName = nickname ? nickname : name;
			teamEntry.innerHTML = `
            <h2>${displayName}</h2>
            <button class="remove-from-team-button" data-pokemon="${name}" data-nickname="${nickname}">Remove</button>
        `;
		}

		const removeButton = teamEntry.querySelector('.remove-from-team-button');
		removeButton.addEventListener('click', () => {
			removeFromTeam(name, nickname);
		});

		return teamEntry;
	}


	function createTeamEntry(name, isReserve = false, imageUrl) {
		console.log('Creating Team Entry:', name);

		const teamEntry = document.createElement('div');
		teamEntry.classList.add('team-member');

		if (imageUrl) {
			const imageDiv = document.createElement('div');
			imageDiv.classList.add('image');
			imageDiv.style.backgroundImage = `url(${imageUrl})`;

			const contentDiv = document.createElement('div');
			contentDiv.textContent = (isReserve) ? `${name} (Reserve)` : `${name}`;

			teamEntry.appendChild(imageDiv);
			teamEntry.appendChild(contentDiv);
		} else {

			teamEntry.textContent = (isReserve) ? `${name} (Reserve)` : `${name}`;
		}

		return teamEntry;
	}

	await fetchPokemon();
});
