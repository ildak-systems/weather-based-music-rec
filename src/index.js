import axios from "axios";

export async function onClickUserLocation(age, limit)
{
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
    console.log(weather_result);

    const tracks = await getTracks(weather_result, age, limit);



}

export async function onClickCity(city, age, limit)
{
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

    const tracks = await getTracks(weather_result, age, limit);

}

export async function getTracks(weather, age, limit)
{
    const token_result = await axios.get('/api/spotify/get-access-token');
    const token = token_result.data.access_token;

    const tracks_data = {
        token: token,
    }

    const tracks = await axios.post('/api/spotify/get-tracks', tracks_data);
    console.log(tracks.data);
}

export function getUserLocation()
{
    return new Promise((res, rej) => {
        if (navigator.geolocation)
        {
            navigator.geolocation.getCurrentPosition(res, rej);
        }
        else
        {
            document.getElementById("title").innerText = "Geolocation is not supported by your browser. Get tracks" +
                "using city name instead.";
        }

    });
}





