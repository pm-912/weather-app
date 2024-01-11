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

// This function renders the buttons onto the page, and gives them
// functionality to search for the city.
function renderBtn() {
    searchHis.innerHTML = "";
    for (let i = 0; i < cityArray.length; i++) {
        const cityBtn = document.createElement("button");
        cityBtn.id = "search";
        cityBtn.textContent = cityArray[i];
        searchHis.append(cityBtn);
        cityBtn.addEventListener("click", () => getCoords(cityArray[i]));
    }
}

// This function uses the city that was searched as an input to get the coordinates of the city
function getCoords(city) {
    currentCont.textContent = "";
    if (city) {
        return fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=304e6560d21d5b309a457696f7869351`)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            const closestMatch = data[0];
            const latCoords = closestMatch.lat;
            const lonCoords = closestMatch.lon;
            showWeather(latCoords, lonCoords);
            showForecast(latCoords, lonCoords);
        })
    }
}


// This function will get the current weather data for the location
// and then render it onto the screen with the included HTML
function showWeather(lat, lon) {
    return fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=304e6560d21d5b309a457696f7869351&units=imperial`)
    .then(function (response) {
        return response.json();
    })
    .then(function (weather) {
        const currentCond = [weather.name, weather.main.temp, weather.main.humidity, weather.wind.speed];
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
        currentCont.insertAdjacentHTML("afterbegin", weatherDiv);
    })
}

// This function will get the 5 day forecast for the location
// It is then rendered to the screen for each day
function showForecast(lat, lon) {
    return fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=304e6560d21d5b309a457696f7869351&units=imperial`)
    .then(function (response) {
        return response.json();
    })
    .then(function (weather) {
        // First clear the previous forecast
        forecastCont.innerHTML = "";
        // This iterates for each 24 hour period
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
            <p>Wind Speed: ${weather.list[i].wind.speed} mph</p></card>`
            forecastCont.insertAdjacentHTML("beforeend", forecastDiv);
        }
    })
}

// Renders the buttons from local storage on page load
renderBtn();
//default city to show the weather of
showWeather(40.4406, -79.9959);
showForecast(40.4406, -79.9959);

submitBtn.addEventListener("submit", citySearch);