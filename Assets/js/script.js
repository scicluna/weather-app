//Grab all of my DOMS
const currentDate = document.querySelector(".current-date")
const searchBtn = document.querySelector(".go")
const cityInput = document.querySelector(".city-input")
const pastCities = document.querySelector(".past-cities")
const weatherContainer = document.querySelector(".weather-container")
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
const fiveCard = document.querySelectorAll(".card")
const dayNightSwitch = document.querySelector("[data-switch]")
const dayNight = document.querySelector("#daynight")

//Get an array of city names from local storage, or set cities to an empty array
let cities = JSON.parse(localStorage.getItem(`cities`))
if(!cities){
    cities = []
}

//Initial webpage load
function init(){
    writeHistory()
    initPast()
    searchBtn.addEventListener("click", fetchWeather)
    dayNightSwitch.addEventListener("change", toggleDayNight)
}
init()

//Fetches the weather object based on the input value on the search bar
function fetchWeather(e){
    e.preventDefault()
    //Create our desired url for our api fetch
    let targetCity = cityInput.value
    let targetURL = `https://api.openweathermap.org/data/2.5/forecast?q=${targetCity}&cnt=45&appid=1ce80842bf374ae8d6c2821daf784f11&units=imperial`

    //If the input is empty, don't continue
    if (targetCity === ""){
        return
    }

    fetch(targetURL)
        .then(function (response){
            //If response comes back, return response.json, otherwise throw an alert
            if (response.ok) {return response.json();}
            else {
                window.alert("city not found")
                cityInput.value = ""
                return
            }
        })
        .then(function (data) { 
            //If data came back undefined, don't continue
            if(data === undefined){
                return
            }

            //write data to the screen and save it in local storage
            writeCurrent(data)
            writeFive(data)
            saveData(data)
            initPast()

            //show current data/forecast if cities isn't empty
            if (cities !== []){
                showHud()
            }
        })
}

//Write the current data to the screen using the data object
function writeCurrent(data){
    currentCity.innerText = `${data.city.name} (${dayjs().format("MM/DD/YYYY")})` 
    currentTemp.innerHTML = `<b>Temperature</b> ${data.list[0].main.temp} F`
    currentWind.innerHTML = `<b>Wind</b> ${data.list[0].wind.speed} MPH`
    currentHumid.innerHTML = `<b>Humidity</b> ${data.list[0].main.humidity} %`
    currentImg.src = `http://openweathermap.org/img/wn/${data.list[0].weather[0].icon}@2x.png` 
}

//Write the five day forecast to the screen using a for loop to move through the weather data object
//I'm aware that this function may cause occasional issues where the five forecasted days may include the current day
//This is due to our inability to grab more than 40 items in our data object (due to using the free version)
//If I had access to the paid version, I would be able to remedy this, but there is no other way to avoid this and maintain nice and even times for our forcasts
function writeFive(data){

    let dayIndex = []
    let nightIndex = []
    for (let i=0;i<data.list.length;i++){
        if(data.list[i].dt_txt.includes("12")){
            dayIndex.push(i)
        }

        if(data.list[i].dt_txt.includes("21")){
            nightIndex.push(i)          
        }
    }

    if(dayNightSwitch.dataset.switch === "Day"){
        for (let i=0; i<data.list.length/8; i++){

            if(data.list[dayIndex[i]].dt_txt === null){
                return
            }

            fiveDate[i].innerText = `${data.list[dayIndex[i]].dt_txt}`
            fiveTemp[i].innerHTML = `<b>Temp</b> ${data.list[dayIndex[i]].main.temp} F`
            fiveHumid[i].innerHTML = `<b>Wind</b> ${data.list[dayIndex[i]].wind.speed} MPH`
            fiveWind[i].innerHTML = `<b>Humid</b> ${data.list[dayIndex[i]].main.humidity} %`
            fiveImg[i].src = `http://openweathermap.org/img/wn/${data.list[dayIndex[i]].weather[0].icon}@2x.png` 
        }
    } else {
        for (let i=0; i<data.list.length/8; i++){

            if(data.list[nightIndex[i]].dt_txt === null){
                return
            }

            fiveDate[i].innerText = `${data.list[nightIndex[i]].dt_txt}`
            fiveTemp[i].innerHTML = `<b>Temp</b> ${data.list[nightIndex[i]].main.temp} F`
            fiveHumid[i].innerHTML = `<b>Wind</b> ${data.list[nightIndex[i]].wind.speed} MPH`
            fiveWind[i].innerHTML = `<b>Humid</b> ${data.list[nightIndex[i]].main.humidity} %`
            fiveImg[i].src = `http://openweathermap.org/img/wn/${data.list[nightIndex[i]].weather[0].icon}@2x.png` 
        }
    }
}

//Save our results to local storage
function saveData(data){
    let city = data.city.name

    //Don't save anything if city is null
    if(!city){
        return
    }

    //Save our weather data to local storage using the city name as a key
    localStorage.setItem(`${city}`, JSON.stringify(data))

    //Prevent multiple of the same cities from being added to our history list and create a new history button
    if(!cities.includes(city)){
    cities.push(city)
    localStorage.setItem("cities", JSON.stringify(cities))
    writeBtns(city)
    cityInput.value = ""
    }

}

//Initializes our history buttons
function initPast(){
    const pastBtns = document.querySelectorAll(".city-button")
    const closeBtns = document.querySelectorAll(".close")
    pastBtns.forEach(btn=>{
        btn.removeEventListener("click", retrieveData)
    })
    pastBtns.forEach(btn=>{
        btn.addEventListener("click", retrieveData)
    })
    closeBtns.forEach(btn=>{
        btn.removeEventListener("click", removeData)
    })
    closeBtns.forEach(btn=>{
        btn.addEventListener("click", removeData)
    })
}

//Retrieves weather data from local storage using the inner-text of the history button as a key. Then writes it to screen
function retrieveData(e){
    let thisCity = e.target.innerText
    const pastData = JSON.parse(localStorage.getItem(`${thisCity}`))
    writeCurrent(pastData)
    writeFive(pastData)
    showHud()
}

//Writes history to screen using the cities array from local storage
function writeHistory(){
    if(!cities){
        return
    }
    for (city of cities){
        writeBtns(city)
    }
}

//Display current/5day forecasts
function showHud(){
    currentDay.classList.remove("hide")
    fiveDay.classList.remove("hide")
}

//Hide current/5day forecasts
function hideHud(){
    currentDay.classList.add("hide")
    fiveDay.classList.add("hide")
    weatherContainer.classList.remove("dark")
}

//Handle our "X" buttons and allows us to remove items from our history
function removeData(e){
    //Some DOM traversal to grab the city name and the div element that holds both buttons
    let div = e.composedPath()[1]
    let cityName = e.composedPath()[1].children[0].innerText
    //Finds the index of the city name and removes it from our cities array
    let index = cities.indexOf(cityName)
    cities.splice(index, 1)
    //If our cities array is now empty, hide the hud
    if (cities[0] === undefined){
        hideHud()
    }
    //Save new array to local storage, remove the city's key for holding weather data, and get rid of the div
    localStorage.setItem("cities", JSON.stringify(cities))
    localStorage.removeItem(cityName)
    div.innerHTML = ""
}

//Writes our history buttons to the screen. Uses divs so that the city names are aligned with the X buttons.
function writeBtns(city){
    let historyDiv = document.createElement("div")
    historyDiv.classList.add("history")
    let cityBtn = document.createElement("button")
    cityBtn.innerText = city
    cityBtn.classList.add("city-button")
    let deleteBtn = document.createElement("button")
    deleteBtn.classList.add("close")
    deleteBtn.innerHTML = "&times"
    historyDiv.appendChild(cityBtn)
    historyDiv.appendChild(deleteBtn)
    pastCities.appendChild(historyDiv)
}

//Handle our five day forecast switch
function toggleDayNight(e){
    dayNightSwitch.dataset.switch === "Day" ? dayNightSwitch.dataset.switch = "Night" : dayNightSwitch.dataset.switch = "Day"
    dayNight.innerText = dayNightSwitch.dataset.switch
    let targetCity = currentCity.innerText.split("(").splice(0,1).join("").trim()

    if(dayNightSwitch.dataset.switch === "Night"){
    weatherContainer.classList.add("dark")
    fiveCard.forEach(card=>{
        card.classList.add("dark")
    })
    } else {
    weatherContainer.classList.remove("dark")
    fiveCard.forEach(card=>{
        card.classList.remove("dark")
    })
    }


    writeFive(JSON.parse(localStorage.getItem(`${targetCity}`)))
}