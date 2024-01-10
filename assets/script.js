// const requestURL = ""
const cityInput = document.querySelector("#citySearch");
const submitBtn = document.querySelector("#submit");
const forecastCont = document.querySelector("#forecast");
const currentCont = document.querySelector("#current");
let cityArray = JSON.parse(localStorage.getItem("cityArray")) || [];
const searchHis = document.querySelector("#recent");
// search for the city that the user has input
function citySearch(event) {
    event.preventDefault();
    const userSearch = cityInput.value.trim();
    console.log(userSearch);
    // outputs the city name as userSearch
    // then run function to get coordinates
    getCoords(userSearch);
    saveCity(userSearch);
    // clear form after search
}

function saveCity(search) {
    const cityBtn = document.createElement("button");
    cityBtn.textContent=search;
    searchHis.append(cityBtn);
    // Add search to localstorage
    // JSON.stringify
    cityArray.push(search);
    localStorage.setItem("cityArray", JSON.stringify(cityArray));
}

for (let i = 0; i < cityArray.length; i++) {
    const cityBtn = document.createElement("button");
    cityBtn.textContent=cityArray[i];
    searchHis.append(cityBtn);
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
    const clearCard=""
    //pull weather data from openweather
    return fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=304e6560d21d5b309a457696f7869351&units=imperial`)
    .then(function(response) {
        return response.json();
    })
    .then(function(weather) {
        //create variables for each datatype needed
        // clear current div
        currentCont.innerHTML = clearCard;
        const currentWeath = weather;
        const currentCond = [weather.main.temp, weather.main.humidity, weather.wind.speed];
        // create html styling for container
        // create html styling for each variable
        // this will be in "#current" div
        const weatherDiv = `<div id="current" class="col col-9 text-center">
        <p class="h2">Currrent Weather for</p>
        <br>
        <p>Temperature: ${currentCond[0]}°F</p>
        <br>
        <p>Humidity: ${currentCond[1]}%</p>
        <br>
        <p>Wind Speed: ${currentCond[2]} mph</p>
        </div>`
        currentCont.insertAdjacentHTML("afterend", weatherDiv);
        
        console.log(currentCond);
        console.log(weather);
        
        
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
        //clear forecast div
        //create variables for each datatype needed
        // const forecastVal = weather.list[7, 15, 23, 31, 39];
        forecastCont.innerHTML = "";
        for (let i = 4; i < weather.list.length; i+=8) {
            console.log(weather.list[i]);

            const forecastDiv =`
            <card class="card">${weather.list[i].main.humidity} 
            <p class="h2">Currrent Weather for</p>
            <br>
            <p>Temperature: ${weather.list[i].main.humidity}°F</p>
            <br>
            <p>Humidity: ${weather.list[i].main.humidity}%</p>
            <br>
            <p>Wind Speed: ${weather.list[i].main.humidity} mph</p></card>
            `



            forecastCont.insertAdjacentHTML("beforeend", forecastDiv)
        }

        // }


        console.log(weather);
        //run a for loop for a 5 day period
        //create html styling for each day 
        // will be in the "#forecast" div
        
    })
}

//create a function to save the data into local storage
//that will show up in a div called "recent searches"
//clicking on one of those links will take you to the weather of that city
// set searched city as value of key "Recent"


submitBtn.addEventListener("submit", citySearch);