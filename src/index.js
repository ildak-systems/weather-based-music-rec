import axios from 'axios';
import gsap from 'gsap';
// do not do the {}, does not work

const API_THREE_HOUR_FIVE_DAYS = "https://api.openweathermap.org/data/2.5/forecast?q=";
const API_LAT_LONG_HOURLY = ""
const KEY = "<SECRET>";
export async function main(city, state) {
    // clear data before API call, so they don't stack up
    document.getElementById("title").innerText = "";
    document.getElementById("dates").innerText = "";

    let result = ""
    try
    {
        let response = await axios.get(API_THREE_HOUR_FIVE_DAYS + city + "," + state + "," + "US" + "&appid=" + KEY);
        result = await JSON.parse(JSON.stringify(response.data));
    }
    catch (error)
    {
        console.error(error);
        document.getElementById("title").innerText = "city not found";
    }

    listCondition(result, state)


    //console.log(util.inspect(result, false, null, true));
}

export function listCondition(result, state) {
    if (result)
    {
        document.getElementById("title").innerText = result.city.name + state;
        for (let i = 0; i < result.list.length; i++)
        {
            document.getElementById("dates").innerText += "\n" + result.list[i].dt_txt;
        }
    }
}
