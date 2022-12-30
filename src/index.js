import axios from 'axios';

export async function getUserLocation()
{
    if (navigator.geolocation)
    {
        navigator.geolocation.getCurrentPosition( async (position) => {
                console.log(position.coords.latitude);
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



