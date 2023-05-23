const currentTempEl = document.querySelector("#current-temp");
const currentWindEl = document.querySelector("#current-wind");
const currentHumidityEl = document.querySelector("#current-humidity");
const currentIconEl = document.querySelector("#current-icon");
const cityNameEl = document.querySelector("#city-name")
const searchBtn = document.querySelector("#search-btn");
const searchInput = document.querySelector("#search-input");
const forecastContainer = document.querySelector("#forecast-weather-container")
const cityNameList = document.querySelector(".city-names")
const cityArr = [];

const cityList = JSON.parse(localStorage.getItem("City Name")) || [];

for (let i = 0; i < cityList.length; i++) {
    const cityBtn = document.createElement("button");
    cityBtn.innerHTML = cityList[i];
    cityNameList.appendChild(cityBtn);
}

cityNameList.addEventListener("click", function (event) {
    const input = event.target;
    if (input.matches("button") === true) {
        searchInput.value = input.textContent;
        getCurrentWeather();
    }
});

function getCurrentWeather() {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${searchInput.value}&appid=843fa40ad68a96668befb0da86d9b44b&units=imperial`)
        .then(res => res.json())
        .then(data => {
            console.log(data);

            cityNameEl.textContent = searchInput.value;

            currentTempEl.textContent = data.main.temp;
            currentWindEl.textContent = data.wind.speed;
            currentHumidityEl.textContent = data.main.humidity;
            currentIconEl.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`

        })
    cityArr.push(searchInput.value)
    getForecastWeather();
    localStorage.setItem("City Name", JSON.stringify(cityArr));
}

function getForecastWeather() {
    document.querySelector("#forecast-weather-container").innerHTML = "";
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${searchInput.value}&appid=843fa40ad68a96668befb0da86d9b44b&units=imperial`)
        .then(res => res.json())
        .then(data => {
            console.log(data);

            const selectedData = [
                data.list[3],
                data.list[11],
                data.list[19],
                data.list[27],
                data.list[35]
            ]

            console.log(selectedData);

            for (i = 0; i < selectedData.length; i++) {
                const cardDiv = document.createElement("div");
                cardDiv.classList.add("card");
                const headerDiv = document.createElement("div");
                headerDiv.classList.add("card-header")
                headerDiv.textContent = selectedData[i].dt_txt.split(" ")[0];
                const cardUl = document.createElement("ul");
                cardUl.classList.add("list-group")
                cardUl.classList.add("list-group-flush")
                const tempLi = document.createElement("li")
                tempLi.classList.add("list-group-item")
                tempLi.textContent = `Temp: ${selectedData[i].main.temp}`
                const windLi = document.createElement("li")
                windLi.classList.add("list-group-item")
                windLi.textContent = `Wind: ${selectedData[i].wind.speed}`
                const humidLi = document.createElement("li")
                humidLi.classList.add("list-group-item")
                humidLi.textContent = `Humidity: ${selectedData[i].main.humidity}`

                cardUl.append(tempLi, windLi, humidLi)

                cardDiv.append(headerDiv);
                cardDiv.append(cardUl);

                forecastContainer.append(cardDiv)
            }

        })
}


searchBtn.addEventListener("click", getCurrentWeather)