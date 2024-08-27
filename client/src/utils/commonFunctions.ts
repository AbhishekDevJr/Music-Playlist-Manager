//Spotify API that Generates User Token for Further Spotify API Calls
export const getSpotifyAccessToken = async () => {
    const clientId = import.meta.env.VITE_APP_CLIENT_ID;
    const clientSecret = import.meta.env.VITE_APP_CLIENT_SECRET;

    const token = btoa(`${clientId}:${clientSecret}`);

    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${token}`
        },
        body: new URLSearchParams({
            grant_type: 'client_credentials'
        })
    });

    const data = await response.json();

    return data.access_token;
};
