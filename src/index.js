import axios from 'axios';

export async function getUserLocation()
{
    if (navigator.geolocation)
    {
        navigator.geolocation.getCurrentPosition( async (position) => {

                const body = {
                    lon: position.coords.longitude,
                    lat: position.coords.latitude
                }
                const option = {
                    headers: {
                        'Content-Type': 'application/json'
                    }

                }

                const response = await axios.post('/api',body, option);
                const result = await JSON.parse(JSON.stringify(response.data))
                console.log(result);

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



