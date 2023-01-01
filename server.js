
const express = require('express')
const app = express();
const bodyParser = require('body-parser');
const got = require('got');

const myAPI = {
    CURRENT_WEATHER_CITY : "https://api.openweathermap.org/data/2.5/weather?q=",
    CURRENT_WEATHER_LAT_LON : "https://api.openweathermap.org/data/2.5/weather?lat=",
    ACCESS_TOKEN_SPOTIFY : 'https://accounts.spotify.com/api/token',
    RECOMMENDATION_SPOTIFY : "https://api.spotify.com/v1/recommendations?limit=10&seed_artists=&seed_genres=rock"
}

const myKEY = {
    OPENWEATHER_SECRET : <SECRET></SECRET>
}

// parse application/json
app.use(bodyParser.json())

// Open server on port 3000
app.listen(3000, () => console.log("listen at 3000"));
app.use(express.static('public')); // anything in this directory is public

// List of API requests and response handling
app.post('/api', async (req, res) => {
    console.log(req.body);

    let response = await got.get(myAPI.CURRENT_WEATHER_LAT_LON + req.body.lat + "&lon=" + req.body.lon + "&appid=" + myKEY.OPENWEATHER_SECRET);
    res.send(response.body);
})

// let response = await axios.get(myAPI.CURRENT_WEATHER_LAT_LON + lat
//                 + "&lon=" + lon + "&appid=" + KEY);
//             result = await JSON.parse(JSON.stringify(response.data));