import axios from "axios";
import Bowser from "bowser";
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

    let user_position;
    try
    {
        user_position = await getUserLocation();
    }
    catch (error)
    {
        console.log(error.message);
        if (error.code === 1)
        {
            displayMessage("message", "resulted in error 1");
        }
        else if (error.code === 2)
        {
            displayMessage("message", "resulted in error 2");
        }
        else
        {
            displayMessage("message", "Please reload and enable user location OR get tracks using city name.");
        }
        return;
    }

    // .catch() is a method that you can call on a promise to register a callback function that will be executed when the promise is rejected.

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
    let weather_response;
    let weather_result;
    try
    {
        weather_response = await axios.post('/api/open-weather/get-weather/lon-lat', body, option);
        weather_result = weather_response.data;
        const city = weather_response.data.name;
        displayWeather(city, weather_result.weather[0].main, weather_result.weather[0].description);
    }
    catch (error)
    {
        console.log(error.code);
        displayMessage("message", "There was an error reaching the server. Please try again later.");
        return;
    }

    // if limit is blank. Default limit is 10
    let tracks;
    try
    {
        tracks = await getTracks(weather_result, age, limit);
    }
    catch (error)
    {
        console.log(error.code);
        displayMessage("message", "There was an error reaching the server. Please try again later.");
        return;
    }

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

    let weather_response;
    let tracks;
    try
    {
        weather_response = await axios.post('/api/open-weather/get-weather/city', body, options);
        const weather_result = weather_response.data;
        displayWeather(city, weather_result.weather[0].main, weather_result.weather[0].description);
        tracks = await getTracks(weather_result, age, limit);
        //console.log(tracks);
    }
    catch (error)
    {
        console.log(error.code);
        displayMessage("message", "There was an error reaching the server. Please try again later.");
        return;
    }

    displayTracks(tracks);
    // displayTracks(tracks.data); dont do this, because const tracks is already the body, for some reason. Just pass
    // as tracks, not tracks.data.
}

export async function getTracks(weather_result, age, limit)
{
    let token_result;
    let token;
    try
    {
        token_result = await axios.get('/api/spotify/get-access-token');
        token = token_result.data.access_token;
    }
    catch (error)
    {
        console.log(error.code);
        displayMessage("message", "Unable to connect to Spotify at the moment");
        return;
    }

    const tracks_data = {
        token: token,
        weather: weather_result,
        age: age,
        limit: limit
    }

    let tracks;
    try
    {
        tracks = await axios.post('/api/spotify/get-tracks/randomized', tracks_data);
    }
    catch (error)
    {
        console.log(error.code);
        displayMessage("message", "There was an error reaching the server. Please try again later.");
        return;
    }

    return tracks.data;
}

export function getUserLocation()
{

    return new Promise((resolve, reject) => {
        // make error case for navigator.geolocation
        if (navigator.geolocation)
        {
            // Resolve with location. location can now be accessed in the .then method.
            // Basically 1st parameter of geolocation returns GeoLocationPosition obj
            navigator.geolocation.getCurrentPosition(resolve, (error) => {
                //returns and error with code/message attributes error.code = 1, error.code = 2, error.code = 3
                // make a new error object for each error and return it. On the main function, make a conditional.
                // Something like if (error.name == TIME_OUT) {do something on the front-end}
                if (error.code === 1)
                {
                    reject(Object.assign(new Error(error.message)))
                }
                if (error.code === 2)
                {
                    reject(Object.assign(new Error(error.message)))
                }
                if (error.code === 3)
                {
                    reject(Object.assign(new Error(error.message)))
                }
            });
            //returns res (the api response) when promise fulfilled

        }
        else
        {
            let browser = () => {
                return Bowser.getParser(window.navigator.userAgent).getBrowser();
            }
            reject(`Geolocation is not supported by your browser: ${browser().name}, ${browser().version}. 
            Please try again using city name`);
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

