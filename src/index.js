import axios from 'axios';
import gsap from 'gsap';
// do not do the {}, does not work

const API_CURRENT_WEATHER_CITY = "https://api.openweathermap.org/data/2.5/weather?q=";
const API_CURRENT_WEATHER_LAT_LON = "https://api.openweathermap.org/data/2.5/weather?lat="
const KEY = "<SECRET>";
export async function main(lon, lat, city) {

    // clear data before API call, so they don't stack up
    document.getElementById("title").innerText = "";
    document.getElementById("weather").innerText = "";
    document.getElementById("weather-description").innerText = "";

    let result = ""

    try
    {
        if (lon && lat)
        {
            let response = await axios.get(API_CURRENT_WEATHER_LAT_LON + lat
                + "&lon=" + lon + "&appid=" + KEY);
            result = await JSON.parse(JSON.stringify(response.data));
        }
        else if (city)
        {
            let response = await axios.get(API_CURRENT_WEATHER_CITY + city + "&appid=" + KEY);
            result = await JSON.parse(JSON.stringify(response.data));
        }

    }
    catch (error)
    {
        console.error(error);
        document.getElementById("title").innerText = "city not found";
    }

    // watch that video where you can do stuff outside of a try/catch block
    listCondition(result);


    //console.log(util.inspect(result, false, null, true));
}
export function getUserLocation(){
    if (navigator.geolocation)
    {
        navigator.geolocation.getCurrentPosition((position) => {
            main(position.coords.longitude, position.coords.latitude);
            }
        )
    }
    else
    {
        return reportError("nothing found");
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
