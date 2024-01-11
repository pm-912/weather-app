const cityInput = document.querySelector("#citySearch");
const submitBtn = document.querySelector("#submit");
const searchHis = document.querySelector("#recent");
const currentCont = document.getElementById("current");
const forecastCont = document.querySelector("#forecast");
let cityArray = JSON.parse(localStorage.getItem("cityArray")) || [];

// This function saves the value of whatever the user input in the search field

function citySearch(event) {
    event.preventDefault();
    const userSearch = cityInput.value.trim();
    // If the value is truthy, it runs functions to get the coordinates 
    // and save the city in local storage
    if (userSearch) {
        getCoords(userSearch);
        saveCity(userSearch);
        currentCont.textContent = "";
        renderBtn(userSearch);
    } else {
        document.getElementById("cityHelp").textContent = "Please enter the name of a city.";
        return;
    }
}

// This function adds the city that is searched to local storage, as long as it is not already there.
function saveCity(search) {
    let existingCity = cityArray.find((savedCity) => savedCity === search);

    if (existingCity) {
        existingCity.temperature = search.temperature;
        localStorage.setItem("cityArray", JSON.stringify(cityArray));
    } else {
        cityArray.push(search);
        localStorage.setItem("cityArray", JSON.stringify(cityArray));
    }
    submitBtn.reset();
}

// This function 
function renderBtn() {
    for (let i = 0; i < cityArray.length; i++) {
        const cityBtn = document.createElement("button");
        cityBtn.id = "search";
        cityBtn.textContent = cityArray[i];
        searchHis.append(cityBtn);
        cityBtn.addEventListener("click", () => getCoords(cityArray[i]));
    }
}

renderBtn();
//This code should save to local storage whatever city is input into the search field, then create a button for that city that the user can click to access
// append the recent searches on page load

function getCoords(city) {
    // compare user search with openweather database
    currentCont.textContent = "";
    if (city) {
        // pull lat and lon from city data
        return fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=304e6560d21d5b309a457696f7869351`)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
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
}


// Function to pull the current weather of searched location
// API call and pull relevant data (Current time, Temp, Wind speed, Humidity)
function showWeather(lat, lon) {
    // currentCont.textContent = "";
    //pull weather data from openweather
    return fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=304e6560d21d5b309a457696f7869351&units=imperial`)
        .then(function (response) {
            return response.json();
        })
        .then(function (weather) {
            //create variables for each datatype needed
            const currentCond = [weather.name, weather.main.temp, weather.main.humidity, weather.wind.speed];
            // create html styling for container    
            // create html styling for each variable
            // this will be in "#current" div
            const iconCode = weather.weather[0].icon;
            const icon = "https://openweathermap.org/img/wn/" + iconCode + ".png"
            const weatherDiv = `<div class="col col-9 text-center">
        <p class="h2">${currentCond[0]} weather for ${dayjs().format("MMM, DD, YYYY")}</p> <img src="${icon}"></img>
        <br>
        <p>Temperature: ${currentCond[1]}°F</p>
        <br>
        <p>Humidity: ${currentCond[2]}%</p>
        <br>
        <p>Wind Speed: ${currentCond[3]} mph</p>
        </div>
        <div id="current" cla`;
            //add data to page
            currentCont.insertAdjacentHTML("afterbegin", weatherDiv);

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
        .then(function (response) {
            return response.json();
        })
        .then(function (weather) {
            //clear forecast div
            //create variables for each datatype needed
            // const forecastVal = weather.list[7, 15, 23, 31, 39];
            forecastCont.innerHTML = "";
            for (let i = 4; i < weather.list.length; i += 8) {
                console.log(weather.list[i]);
                let foreDate = weather.list[i].dt_txt;
                let iconImg = weather.list[i].weather[0].icon;
                let icon = "https://openweathermap.org/img/wn/" + iconImg + ".png";

                const forecastDiv = `
            <card class="card text-center d-flex"> <p class="h2">${dayjs(foreDate).format("MMM DD")}</p><img src="${icon}" class="img-fluid align-items-center" width="75" height="75"></img>
            <br>
            <p>Temperature: ${weather.list[i].main.temp}°F</p>
            <br>
            <p>Humidity: ${weather.list[i].main.humidity}%</p>
            <br>
            <p>Wind Speed: ${weather.list[i].wind.speed} mph</p></card>
            `
                forecastCont.insertAdjacentHTML("beforeend", forecastDiv);
            }

            // }


            console.log(weather);

        })
}
showWeather(40.4406, -79.9959);
showForecast(40.4406, -79.9959);
submitBtn.addEventListener("submit", citySearch);