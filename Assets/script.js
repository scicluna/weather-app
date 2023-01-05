const currentDate = document.querySelector(".current-date")
const searchBtn = document.querySelector(".go")
const cityInput = document.querySelector(".city-input")
const pastCities = document.querySelector(".past-cities")
const currentCity = document.querySelector(".current-city")
const currentTemp = document.querySelector(".current-temp")
const currentWind = document.querySelector(".current-wind")
const currentHumid = document.querySelector(".current-humid")
const currentImg = document.querySelector(".current-img")
const currentDay = document.querySelector(".current")
const fiveImg = document.querySelectorAll("[data-img]")
const fiveTemp = document.querySelectorAll("[data-temp]")
const fiveHumid = document.querySelectorAll("[data-humid]")
const fiveWind = document.querySelectorAll("[data-wind]")
const fiveDay = document.querySelector(".five-day")
const fiveDate = document.querySelectorAll("[data-date]")

let cities = JSON.parse(localStorage.getItem(`cities`))
if(!cities){
    cities = []
}

searchBtn.addEventListener("click", fetchWeather)

function init(){
    writeHistory()
    initPast()
}
init()

function fetchWeather(){
    let targetCity = cityInput.value
    let targetURL = `http://api.openweathermap.org/data/2.5/forecast?q=${targetCity}&appid=1ce80842bf374ae8d6c2821daf784f11&units=imperial`

    if (targetCity === ""){
        return
    }

    fetch(targetURL)
        .then(function (response){
            return response.json();
        })
        .then(function (data) {

            if (data.cod === "404"){
                return
            }

            writeCurrent(data)
            writeFive(data)
            saveData(data)
            initPast()

            if (cities !== []){
                showHud()
            }
        })
}

function writeCurrent(data){
    currentCity.innerText = `${data.city.name} (${dayjs().format("MM/DD/YYYY")})` 
    currentTemp.innerHTML = `<b>Temperature</b> ${data.list[0].main.temp} F`
    currentWind.innerHTML = `<b>Wind</b> ${data.list[0].wind.speed} MPH`
    currentHumid.innerHTML = `<b>Humidity</b> ${data.list[0].main.humidity} %`
    currentImg.src = `http://openweathermap.org/img/wn/${data.list[0].weather[0].icon}@2x.png` 
}

function writeFive(data){
    for (let i=0;i<data.list.length/8;i++){
        let date = i+7+(7*i)
        fiveDate[i].innerText = `${data.list[date].dt_txt}`
        fiveTemp[i].innerHTML = `<b>Temp</b> ${data.list[date].main.temp} F`
        fiveHumid[i].innerHTML = `<b>Wind</b> ${data.list[date].wind.speed} MPH`
        fiveWind[i].innerHTML = `<b>Humid</b> ${data.list[date].main.humidity} %`
        fiveImg[i].src = `http://openweathermap.org/img/wn/${data.list[date].weather[0].icon}@2x.png` 
    }
}

function saveData(data){
    let city = data.city.name

    if(!city){
        return
    }

    localStorage.setItem(`${city}`, JSON.stringify(data))

    if(!cities.includes(city)){
    cities.push(city)
    localStorage.setItem("cities", JSON.stringify(cities))
    let cityBtn = document.createElement("button")
    cityBtn.innerText = city
    cityBtn.classList.add("city-button")
    pastCities.appendChild(cityBtn)
    }

}

function initPast(){
    const pastBtns = document.querySelectorAll(".city-button")
    pastBtns.forEach(btn=>{
        btn.removeEventListener("click", retrieveData)
    })
    pastBtns.forEach(btn=>{
        btn.addEventListener("click", retrieveData)
    })
}

function retrieveData(e){
    let thisCity = e.target.innerText
    const pastData = JSON.parse(localStorage.getItem(`${thisCity}`))
    writeCurrent(pastData)
    writeFive(pastData)
    showHud()
}

function writeHistory(){
    if(!cities){
        return
    }

    for (city of cities){
        let cityBtn = document.createElement("button")
        cityBtn.innerText = city
        cityBtn.classList.add("city-button")
        pastCities.appendChild(cityBtn)
    }
}

function showHud(){
    currentDay.classList.remove("hide")
    fiveDay.classList.remove("hide")
}

//features to add
//refactor code to make prettier
//rethink entire css scheme colorwise/fontwise/fontsizewise
//more dates on the screen?
//x button for past cities