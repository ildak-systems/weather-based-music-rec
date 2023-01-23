import axios from "axios";
import gsap from "gsap";

resetResponses();

export async function onClickUserLocation(age, limit)
{
    if (!age)
    {
        displayMessage('message', 'Please enter age');
        throw new Error('No age input');
    }
    if (!limit)
    {
        limit = 10;
    }

    const user_position = await getUserLocation();

    const body = {
        lon: user_position.coords.longitude,
        lat: user_position.coords.latitude
    }
    const option = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    // API call to /api/open-weather/get-weather/lon-lat
    const weather_response = await axios.post('/api/open-weather/get-weather/lon-lat', body, option);
    const weather_result = weather_response.data;
    const city = weather_response.data.name;

    displayWeather(city, weather_result.weather[0].main, weather_result.weather[0].description);

    // if limit is blank. Default limit is 10

    const tracks = await getTracks(weather_result, age, limit);
    console.log(tracks);
    displayTracks(tracks);

}

export async function onClickCity(city, age, limit)
{
    if (!city)
    {
        displayMessage('message', 'Please enter city');
        throw new Error('no city input');
    }
    else if (!age)
    {
        displayMessage('message', 'Please enter age');
        throw new Error('no age input');
    }
    if (!limit)
    {
        limit = 10;
    }

    const body = {
        city: city
    }
    const options = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    const weather_response = await axios.post('/api/open-weather/get-weather/city', body, options);
    const weather_result = weather_response.data;

    displayWeather(city, weather_result.weather[0].main, weather_result.weather[0].description);
    const tracks = await getTracks(weather_result, age, limit);
    console.log(tracks);
    displayTracks(tracks);
    // displayTracks(tracks.data); dont do this, because const tracks is already the body, for some reason. Just pass
    // as tracks, not tracks.data.


}

export async function getTracks(weather_result, age, limit)
{
    const token_result = await axios.get('/api/spotify/get-access-token');
    const token = token_result.data.access_token;

    const tracks_data = {
        token: token,
        weather: weather_result,
        age: age,
        limit: limit
    }

    const tracks = await axios.post('/api/spotify/get-tracks/randomized', tracks_data);
    return tracks.data;
}

export function getUserLocation()
{
    return new Promise((res, rej) => {
        // make error case for navigator.geolocation
        if (navigator.geolocation)
        {
            navigator.geolocation.getCurrentPosition(res, rej);
        }
        else
        {
            displayMessage('message', "Geolocation is not supported by your browser. Get tracks" +
                "using city name instead.");
        }

    });
}

export function displayTracks(tracks)
{
    const parentDiv = document.getElementById('track-list');
    for (let i = 0; i < tracks.tracks.length; i++)
    {
        const songID = tracks.tracks[i].id;
        const iframe = document.createElement('iframe');
        iframe.setAttribute("style","border-radius:12px");
        iframe.setAttribute("src", `https://open.spotify.com/embed/track/${songID}?utm_source=generator`);
        iframe.setAttribute("width", "25%");
        iframe.setAttribute("height", "352");
        iframe.setAttribute("allow", "autoplay; clipboard-write; encrypted-media;" +
            "fullscreen; picture-in-picture");
        iframe.setAttribute("loading", "lazy");
        parentDiv.appendChild(iframe);

        gsap.to("iframe", {x: 100, delay: 0.5, duration: 1});
    }
}

export function displayWeather(city, weather, description_weather)
{
    document.getElementById('message').innerText = "Current Weather Report in: " + city;
    document.getElementById('weather').innerText = weather;
    document.getElementById('weather-description').innerText = description_weather;

    gsap.to("#message", {x: 100, duration: 1});
    gsap.to("#weather", {x: 100, duration: 1});
}

export function displayMessage(element, text)
{
    document.getElementById(element).innerText = text;
}

export function resetResponses()
{
    document.getElementById('message').innerText = "";
    document.getElementById('weather').innerText = "";
    document.getElementById('weather-description').innerText = "";
}

