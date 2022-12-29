import axios from 'axios';
import querystring from 'query-string';
// do not do the {}, does not work

const myAPI = {
    CURRENT_WEATHER_CITY : "https://api.openweathermap.org/data/2.5/weather?q=",
    CURRENT_WEATHER_LAT_LON : "https://api.openweathermap.org/data/2.5/weather?lat=",
    ACCESS_TOKEN_SPOTIFY : 'https://accounts.spotify.com/api/token',
    RECOMMENDATION_SPOTIFY : "https://api.spotify.com/v1/recommendations?limit=10&seed_artists=&seed_genres=rock"

}

export async function main(lon, lat, city) {
    const KEY = "<KEY>";

    // clear data before API call, so they don't stack up
    document.getElementById("title").innerText = "";
    document.getElementById("weather").innerText = "";
    document.getElementById("weather-description").innerText = "";

    let result = ""
    try
    {
        if (lon != null || lat != null)
        {
            let response = await axios.get(myAPI.CURRENT_WEATHER_LAT_LON + lat
                + "&lon=" + lon + "&appid=" + KEY);
            result = await JSON.parse(JSON.stringify(response.data));
        }
        else if (city)
        {
            let response = await axios.get(myAPI.CURRENT_WEATHER_CITY + city + "&appid=" + KEY);
            result = await JSON.parse(JSON.stringify(response.data));
        }

    }
    catch (error)
    {
        console.error(error);
        document.getElementById("title").innerText = "city not found";
    }
    finally
    {
        listCondition(result);
    }

    //console.log(util.inspect(result, false, null, true));
}
export async function getUserLocation()
{
    if (navigator.geolocation)
    {
        navigator.geolocation.getCurrentPosition( async (position) => {
                main(position.coords.longitude, position.coords.latitude, null);
                await getRecommendation(await getAccessToken());
                //console.log(token);
            },
            () =>
            {
                document.getElementById('title').innerText = 'Unable to retrieve your location'
            })
    }
    else
    {
        document.getElementById("title").innerText = "Geolocation is not supported by your browser";
    }

}

export function listCondition(result) {
    if (result)
    {
        document.getElementById("title").innerText = result.name;
        document.getElementById("weather").innerText += "\n" + result.weather[0].main;
        document.getElementById("weather-description").innerText += "\n" + result.weather[0].description;
    }
}

export async function getRecommendation(token)
{
    const recommendation = async () => {
        try {
            const response = await axios.get(myAPI.RECOMMENDATION_SPOTIFY,{
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization" : `Bearer ${token}`,
                }
            });

            console.log(response.data);
            return response.data;
        }
        catch (error)
        {
            console.log("Error occured while retrieving recommendations: " + error);
        }
    }
    return recommendation();
}

export async function getAccessToken() {
    const client_id = "<ID>";
    const client_secret = "<SECRET>";
    const auth_token = btoa(client_id + ':' + client_secret)

    const getToken = async () => {
        try {
            //make post request to SPOTIFY API for access token, sending relavent info
            const data = querystring.stringify({grant_type: 'client_credentials'});
            // data: stuff that gets added on as =x&
            const response = await axios.post(myAPI.ACCESS_TOKEN_SPOTIFY, data, {
                headers: {
                    'Authorization': `Basic ${auth_token}`,
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            })

            console.log(response.data.access_token);
            return response.data.access_token; // returned to getAuth, which is a function name

        } catch (error) {
            console.log("Error occurred while retrieving access token: " + error);
        }
    };

    return getToken();
    // if return getToken: save the return value as const, and call the const as a method => const token = await getAccessToken(); await token();
    // because technically, I am returning a function, not a value, so when it returns, I can execute it as a function.
    // if return getToken(): The function is already executed and is returning a value. I can do => const token = await getAccessToken();
    // and token will be a value, not a function
}

