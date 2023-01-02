const got = require('got');
const util = require('util');

async function getUserLocation()
{
    const response = await got.get('https://api.openweathermap.org/data/2.5/weather?lat=' + 42 +
        "&lon=" + -17 + "&appid=" + 'b600ccd3a08727d5e59e74583b7f2b55');

    const result = JSON.parse(response.body);

    console.log(result);
}

getUserLocation();