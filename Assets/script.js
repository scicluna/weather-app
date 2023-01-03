const currentDate = document.querySelector(".current-date")
const searchBtn = document.querySelector(".go")
const cityInput = document.querySelector(".city-input")
const pastCities = document.querySelector(".past-cities")
const currentTemp = document.querySelector(".current-temp")
const currentWind = document.querySelector(".current-wind")
const currentHumid = document.querySelector(".current-humid")
const fiveImg = document.querySelectorAll("[data-img]")
const fiveTemp = document.querySelectorAll("[data-temp]")
const fiveHumid = document.querySelectorAll("[data-humid]")
const fiveWind = document.querySelectorAll("[data-wind]")

searchBtn.addEventListener("click", fetchWeather)

function init(){
    findDate()
}
init()

function findDate(){
    let today = dayjs().format("MMM DD YYYY")
    currentDate.innerText = today
}

function fetchWeather(){
    let targetCity = cityInput.value
    let targetURL = "api.openweathermap.org/data/2.5/forecast?lat=44.34&lon=10.99&appid=1ce80842bf374ae8d6c2821daf784f11"

    fetch(targetURL)
        .then(function (response){
            return response.json();
        })
        .then(function (data) {
            console.log(data)
        })
}

