// const requestURL = ""
const cityInput = document.querySelector("#citySearch");
const submitBtn = document.querySelector("#submit");

// search for the city that the user has input
function citySearch(event) {
    event.preventDefault();
    const userSearch = cityInput.value.trim();
    console.log(userSearch);
    // outputs the city name as userSearch
    // then run function to get coordinates
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
        const closestMatch = data[0];
        const latCoords = closestMatch.lat;
        const lonCoords = closestMatch.lon;
        console.log(data);
        console.log(latCoords, lonCoords);
        showWeather(latCoords, lonCoords);
        showForecast(latCoords, lonCoords);

        // also run a showForecast function which will do the same
        // thing as showWeather, but for 
    })
}


// Function to pull the current weather of searched location
// API call and pull relevant data (Current time, Temp, Wind speed, Humidity)
function showWeather(lat, lon) {
    //pull weather data from openweather
    return fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=304e6560d21d5b309a457696f7869351&units=imperial`)
    .then(function(response) {
        return response.json();
    })
    .then(function(weather) {
        //create variables for each datatype needed
        const currentWeath = weather;
        const currentTemp = weather.main.temp;
        const currentWind = weather.wind.speed;
        const currentHum = weather.main.humidity;

        //create html styling for each variable
        // this will be in "#current" div

        console.log(weather);
        console.log(currentHum);
        
        
    })
}

// Function to pull 5 day forecast of searched location
// API call and pull relevant data (Date, Temp, Wind speed, Humidity)
function showForecast(lat, lon) {
    //pull forecast data from openweather
    // NEED TO set search parameters to 5 days rather than every 3 hours
    // each array item is 3 hours, so each 8 indices is 1 day. 
    // can target array 8, 16, 24, 32, 40 for each 24 hour period
    return fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=304e6560d21d5b309a457696f7869351&units=imperial`)
    .then(function(response) {
        return response.json();
    })
    .then(function(weather) {
        //create variables for each datatype needed
        const forecastVal = weather.list[7, 15, 23, 31, 39];
        console.log(weather);
        console.log(forecastVal);
        //run a for loop for a 5 day period
        //create html styling for each day 
        // will be in the "#forecast" div
        
    })
}

//create a function to save the data into local storage
//that will show up in a div called "recent searches"
//clicking on one of those links will take you to the weather of that city



submitBtn.addEventListener("submit", citySearch);