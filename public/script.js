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

async function fetchUserPlaylists(accessToken) {
    try {
        let playlists = [];
        let url = 'https://api.spotify.com/v1/me/playlists?limit=50';
        while (url) {
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            const data = await response.json();
            playlists = playlists.concat(data.items);
            url = data.next; // Get the next URL for pagination
        }
        console.log('User playlists:', playlists);
        return playlists;
    } catch (error) {
        console.error('Error fetching user playlists:', error);
        return [];
    }
}

function displayPlaylists(playlists) {
    const playlistsContainer = document.getElementById('playlists');
    playlistsContainer.innerHTML = '';

    playlists.forEach(playlist => {
        const playlistDiv = document.createElement('div');
        playlistDiv.className = 'playlist';
        playlistDiv.innerHTML = `
            <img src="${playlist.images[0]?.url}" alt="${playlist.name}" width="100">
            <strong>${playlist.name}</strong>
        `;
        playlistsContainer.appendChild(playlistDiv);
    });
}

async function getUserPlaylists() {
    const accessToken = getAccessToken();
    if (!accessToken) {
        console.error('Access token not found');
        return;
    }

    const playlists = await fetchUserPlaylists(accessToken);
    displayPlaylists(playlists);
}

// Check for access token and fetch playlists if available
if (getAccessToken()) {
    getUserPlaylists();
}
