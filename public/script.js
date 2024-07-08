document.getElementById('loginButton').addEventListener('click', () => {
    window.location.href = '/login';
});

function getAccessToken() {
    const hash = window.location.hash;
    if (hash) {
        const params = new URLSearchParams(hash.replace('#', '?'));
        return params.get('access_token');
    }
    return null;
}

async function fetchTopArtists(accessToken) {
    try {
        const response = await fetch('https://api.spotify.com/v1/me/top/artists?limit=20', {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        const data = await response.json();
        console.log('Top artists:', data.items);
        return data.items;
    } catch (error) {
        console.error('Error fetching top artists:', error);
        return [];
    }
}

function displayArtists(artists) {
    const artistsContainer = document.getElementById('artists');
    artistsContainer.innerHTML = '';

    artists.forEach(artist => {
        const artistDiv = document.createElement('div');
        artistDiv.className = 'artist';
        artistDiv.innerHTML = `
            <img src="${artist.images[0]?.url}" alt="${artist.name}" width="100">
            <strong>${artist.name}</strong>
        `;
        artistsContainer.appendChild(artistDiv);
    });
}

async function getTopArtists() {
    const accessToken = getAccessToken();
    if (!accessToken) {
        console.error('Access token not found');
        return;
    }

    const artists = await fetchTopArtists(accessToken);
    displayArtists(artists);
}

// Check for access token and fetch top artists if available
if (getAccessToken()) {
    getTopArtists();
}
