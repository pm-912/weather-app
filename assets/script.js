/* https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}}&appid={API key}&units=imperial

user presses button

write a function to capture the location provided by the user
Pull that data from the weathermap API for current weather
Get the lat and lon for the city
use that for the five day forecast

write a function that creates cards for current weather and 5 day forecast



*/
const requestURL = ""
const cityInput = document.querySelector("#citySearch");
const submitBtn = document.querySelector("#submit");

// search for the city that the user has input
function citySearch(event) {
    event.preventDefault();
    const userSearch = cityInput.value.trim();
    console.log(userSearch);
    // outputs the city name as userSearch
    // then run function to show the weather
    getCoords(userSearch);
}

function getCoords(city) {
    // compare user search with openweather database
    // pull lat and lon from city data
    return fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=304e6560d21d5b309a457696f7869351`)
    .then(function(response) {
        return response.json();
    
    })
    .then(function(data) {
        console.log(data);
        showWeather();
    })
}

function showWeather(city) {
    //pull weather data from weathermap
}

// get city coordinates from database, use those to plug into 
function showForecast(coordinates) {
    return fetch()
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        console.log(data);
    })
}



submitBtn.addEventListener("submit", citySearch);