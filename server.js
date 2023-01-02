
const express = require('express')
const app = express();
const bodyParser = require('body-parser');
const got = require('got');
require('dotenv').config();

const myAPI = {
    CURRENT_WEATHER_CITY : "https://api.openweathermap.org/data/2.5/weather?q=",
    CURRENT_WEATHER_LAT_LON : "https://api.openweathermap.org/data/2.5/weather?lat=",
    ACCESS_TOKEN_SPOTIFY : 'https://accounts.spotify.com/api/token',
    RECOMMENDATION_SPOTIFY : "https://api.spotify.com/v1/recommendations?limit=10&seed_artists=&seed_genres=rock"
}
// parse application/json
app.use(bodyParser.json())

// Open server on port 3000
app.listen(3000, () => console.log("listen at 3000"));
app.use(express.static('public')); // anything in this directory is public

// /api/open-weather/get-weather/lon-lat
app.post('/api/open-weather/get-weather/lon-lat', async (local_req, local_res) => {
    const openweather_response = await got.get(myAPI.CURRENT_WEATHER_LAT_LON + local_req.body.lat + "&lon=" + local_req.body.lon + "&appid=" + process.env.OPENWEATHER_SECRET);
    local_res.send(openweather_response.body);
})

// /api/open-weather/get-weather/city
app.post('/api/open-weather/get-weather/city', async (local_req, local_res) => {
    const openweather_response = await got.get(myAPI.CURRENT_WEATHER_CITY + local_req.body.city + "&appid=" + process.env.OPENWEATHER_SECRET);
    local_res.send(openweather_response.body);
})

// /api/spotify/get-access-token
app.get('/api/spotify/get-access-token', async (local_req, local_res) => {
    const auth_token = btoa(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET);
    const options = {
        headers: {
            'Authorization': `Basic ${auth_token}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        form: ({
            grant_type: 'client_credentials'
        })

    }
    const spotify_access_token = await got.post(myAPI.ACCESS_TOKEN_SPOTIFY, options);
    local_res.send(JSON.parse(spotify_access_token.body));
})

// /api/spotify/get-tracks
app.post('/api/spotify/get-tracks', async (local_req, local_res) => {
    const options = {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization" : `Bearer ${local_req.body.token}`,
            // make sure to specify .body for response and request
        }
    }
    const spotify_tracks = await got.get(myAPI.RECOMMENDATION_SPOTIFY, options);
    local_res.send(JSON.parse(spotify_tracks.body));
})


