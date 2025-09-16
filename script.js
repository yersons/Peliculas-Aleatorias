const API_KEY = '351d09a7a0b84af9fb4dedf575e7bc7d';
const IMG_BASE = 'https://image.tmdb.org/t/p/w500';

const typeSelect = document.getElementById('type');
const genreSelect = document.getElementById('genre');
const yearStartInput = document.getElementById('yearStart');
const yearEndInput = document.getElementById('yearEnd');
const searchBtn = document.getElementById('searchBtn');
const resultsDiv = document.getElementById('results');

async function fetchMovies() {
    const type = typeSelect.value;
    const genre = genreSelect.value;
    const yearStart = yearStartInput.value;
    const yearEnd = yearEndInput.value;

    let url = `https://api.themoviedb.org/3/discover/${type}?api_key=${API_KEY}&language=es-ES&sort_by=popularity.desc&page=1`;
    
    if(genre) url += `&with_genres=${genre}`;
    if(yearStart) url += type === 'movie' ? `&primary_release_date.gte=${yearStart}-01-01` : `&first_air_date.gte=${yearStart}-01-01`;
    if(yearEnd) url += type === 'movie' ? `&primary_release_date.lte=${yearEnd}-12-31` : `&first_air_date.lte=${yearEnd}-12-31`;

    const res = await fetch(url);
    const data = await res.json();

    displayResults(data.results, type);
}

async function fetchTrailer(type, id) {
    const url = `https://api.themoviedb.org/3/${type}/${id}/videos?api_key=${API_KEY}&language=es-ES`;
    const res = await fetch(url);
    const data = await res.json();
    const trailer = data.results.find(v => v.type === "Trailer" && v.site === "YouTube");
    return trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null;
}

async function displayResults(items, type) {
    resultsDiv.innerHTML = '';
    if(!items || items.length === 0){
        resultsDiv.innerHTML = '<p>No se encontraron resultados</p>';
        return;
    }

    let selected = [];
    const copy = [...items];
    for(let i=0; i<3 && copy.length>0; i++){
        const index = Math.floor(Math.random() * copy.length);
        selected.push(copy[index]);
        copy.splice(index,1);
    }

    for(const item of selected){
        const card = document.createElement('div');
        card.className = 'card';
        const title = item.title || item.name;
        const description = item.overview || 'Sin descripción.';
        const rating = item.vote_average || 'N/A';
        const img = item.poster_path ? IMG_BASE + item.poster_path : 'https://via.placeholder.com/250x375?text=No+Image';
        const trailerLink = await fetchTrailer(type, item.id);
        
        card.innerHTML = `
            <img src="${img}" alt="${title}">
            <h3>${title}</h3>
            <p>${description}</p>
            <span>⭐ ${rating}</span>
            ${trailerLink ? `<a href="${trailerLink}" target="_blank" class="trailer-btn">Ver Trailer</a>` : ''}
        `;
        resultsDiv.appendChild(card);
    }
}

searchBtn.addEventListener('click', fetchMovies);
