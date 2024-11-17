const inputText = document.getElementById('input-data')
const addDataButton = document.getElementById("submit-data")
const weatherText = document.getElementById("weather_condition_text")
const weatherICON = document.getElementById("weather_icon")
const tempTEXT = document.getElementById("temperatureTEXT")
const locationTEXT = document.getElementById("location_text")
const weekForecast = document.getElementById("divForForecastID")
const windText = document.getElementById("wind")
const element = document.querySelector('body');
const gpsCoords = document.getElementById("my-gps")
const favoriteButton = document.getElementById("submit-favorite")
const dropdownMenu = document.getElementById("dropdown-menu-heh");

addDataButton.addEventListener("click", async function() {
    const selectedRadioButton = document.querySelector('input[name="temperature"]:checked')
    const location = inputText.value
    const URLWeatherAPI = `http://api.weatherapi.com/v1/forecast.json?key=460109e8cedb4bb199b140824241910&q=${location}&days=7`
    try {
        const resWeatherAPI = await fetch(URLWeatherAPI)
        const dataWeatherAPI = await resWeatherAPI.json()
        
        let coordinates = get_coords(dataWeatherAPI)  

        let URLOpen_Meteo = `https://api.open-meteo.com/v1/forecast?latitude=${coordinates[0]}&longitude=${coordinates[1]}&hourly=temperature_2m`
        const resOPENMETEO = await fetch(URLOpen_Meteo)
        const openMeteoAPI = await resOPENMETEO.json()

        data_handler(dataWeatherAPI, selectedRadioButton)
        build_chart(dataWeatherAPI, openMeteoAPI, selectedRadioButton)
        getMap(coordinates)
    } catch (error) {
        console.error('Fetch error:', error)
    }
    
    
})

function data_handler(data, radio){
    console.log(data)
    locationTEXT.textContent = data.location.name + " " + data.location.localtime
    weatherText.textContent = Object.values(data)[1].condition.text
    weatherICON.src = Object.values(data)[1].condition.icon
    weatherICON.style.display = 'block'
    windText.textContent = (`Wind: ${data.current.wind_kph}kph`)
    location.text = data.location.country
    if (radio.value == "celsius"){
        tempTEXT.textContent = data.current.temp_c+"°c"

        for (let i = 0; i < 3; i++) {
            const forecastDay = data.forecast.forecastday[i]
            const box = weekForecast.children[i]
            box.innerHTML = `${forecastDay.date}: <br> <b>AVG Temp</b>: ${forecastDay.day.avgtemp_c}°C, ${forecastDay.day.condition.text} <img src="${forecastDay.day.condition.icon}" alt="Weather icon">`
            box.style.display = 'block'
        }
    }
    if (radio.value == "fahrenhait"){
        tempTEXT.textContent = data.current.temp_f+"°F"

        for (let i = 0; i < 3; i++) {
            const forecastDay = data.forecast.forecastday[i]
            const box = weekForecast.children[i]
            box.innerHTML = `${forecastDay.date}: <br> <b>AVG Temp</b>: ${forecastDay.day.avgtemp_f}°F, ${forecastDay.day.condition.text} <img src="${forecastDay.day.condition.icon}" alt="Weather icon">`
            box.style.display = 'block'
        }
    }
    if (radio.value == "kelvin"){
        tempTEXT.textContent = (Number(data.current.temp_c)+ 273.15).toFixed(1) + "K"

        for (let i = 0; i < 3; i++) {
            const forecastDay = data.forecast.forecastday[i]
            const box = weekForecast.children[i]
            box.innerHTML = `${forecastDay.date}: <br> <b>AVG Temp</b>: ${(Number(forecastDay.day.avgtemp_c)+273.15).toFixed(1)}K, ${forecastDay.day.condition.text} <img src="${forecastDay.day.condition.icon}" alt="Weather icon">`
            box.style.display = 'block'
        }
    }
    if (data.current.is_day == 0){
        document.body.style.backgroundColor = "#71797E";
        document.getElementById('background-photo').style.backgroundImage = `url(https://cdn.pixabay.com/photo/2016/11/25/23/15/moon-1859616_1280.jpg)`
        element.style.color = "white"
    } else {
        document.body.style.backgroundColor = ""
        document.getElementById('background-photo').style.backgroundImage = `url(https://cdn.pixabay.com/photo/2018/06/21/13/57/clouds-3488632_1280.jpg)`
        element.style.color = "black"


    }
    
    if (data.current.precip_mm > 0.05) {
        document.getElementById('background-photo').style.backgroundImage = `url(https://cdn.pixabay.com/photo/2021/08/14/05/33/raindrop-6544618_1280.jpg)`
        element.style.color = "lightblue"
    }

    if (data.current.temp_c < 0) {
        document.getElementById('background-photo').style.backgroundImage = `url(https://cdn.pixabay.com/photo/2022/12/10/11/05/snow-7646952_960_720.jpg)` 
        element.style.color = "blue"

    }

    if (data.current.temp_c >= 30) {
        document.getElementById('background-photo').style.backgroundImage = `url(https://cdn.pixabay.com/photo/2018/06/21/13/57/clouds-3488632_1280.jpg)`
        element.style.color = "red"

    }

    weekForecast.style.display = 'flex'

   }

function get_coords(data){
    let coords = []
    coords.push(data.location.lat)
    coords.push(data.location.lon)
    return coords
}

function build_chart(data, data2, radio){
    const labels = []
    const values = []
    const values2 = []

    if (radio.value == "celsius"){
        for (let i = 0; i < 24; i++){
            values.push(data.forecast.forecastday[0].hour[i].temp_c)
            values2.push(Object.values(data2)[8].temperature_2m[i])
            let date = data.forecast.forecastday[0].hour[i].time.split(" ")
            labels.push(date[1])
        }
    }
    if (radio.value == "fahrenhait"){
        for (let i = 0; i < 24; i++){
            values.push((((data.forecast.forecastday[0].hour[i].temp_c)*1.8)+32).toFixed(1))
            values2.push(((Object.values(data2)[8].temperature_2m[i]*1.8)+32).toFixed(1))
            let date = data.forecast.forecastday[0].hour[i].time.split(" ")
            labels.push(date[1])
        }
    }
    if (radio.value == "kelvin"){
        for (let i = 0; i < 24; i++){
            values.push((data.forecast.forecastday[0].hour[i].temp_c+273.15).toFixed(1))
            values2.push((Object.values(data2)[8].temperature_2m[i]+273.15).toFixed(1))
            let date = data.forecast.forecastday[0].hour[i].time.split(" ")
            labels.push(date[1])
        }
    }
    const charData = {
        labels: labels,
        datasets: [{
            name: "WeatherAPI",
            values: values
        },
        {
            name: "OpenMeteo",
            values: values2
        }
    ]
    }



    const chart = new frappe.Chart("#chart", {
        title: data.location.name + " temperature",
        data: charData,
        type: "line",
        height: 450,
        colors: ["#eb5146"]
})
}



inputText.addEventListener('keypress', function(event){
    if (event.key === 'Enter'){
        event.preventDefault()
        document.getElementById('submit-data').click()
    }
})

gpsCoords.addEventListener("click", async function(event) {
    event.preventDefault()
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
      } else {
        console.log("Cannot show location")
      }
})

async function showPosition(position) {
    const selectedRadioButton = document.querySelector('input[name="temperature"]:checked')
    let coordsinates = []
    coordsinates.push(position.coords.latitude)
    coordsinates.push(position.coords.longitude)
    getMap(coordsinates)

    const URLWeatherAPI = `http://api.weatherapi.com/v1/forecast.json?key=460109e8cedb4bb199b140824241910&q=${coordsinates[0]},${coordsinates[1]}&days=7`
    try {
        const resWeatherAPI = await fetch(URLWeatherAPI)
        const dataWeatherAPI = await resWeatherAPI.json()

        let URLOpen_Meteo = `https://api.open-meteo.com/v1/forecast?latitude=${coordsinates[0]}&longitude=${coordsinates[1]}&hourly=temperature_2m`
        const resOPENMETEO = await fetch(URLOpen_Meteo)
        const openMeteoAPI = await resOPENMETEO.json()

        data_handler(dataWeatherAPI, selectedRadioButton)
        build_chart(dataWeatherAPI, openMeteoAPI, selectedRadioButton)
    } catch (error) {
        console.error('Fetch error:', error)
    }
    
    
    
}

function initializeMap(){
    const urlWeatherMap = 'https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=c7d738ca31b8e845ab4b4bc04c452588'

    map = L.map('map', {
        minZoom: 4,
        }).setView([60.1699, 25], 9)
    
    

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '© OpenStreetMap',
    }).addTo(map)

    L.tileLayer(urlWeatherMap,{ 
        attribution: '© OpenWeatherMap'
    }).addTo(map)

    L.tileLayer('https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=c7d738ca31b8e845ab4b4bc04c452588',{ 
        attribution: '© OpenWeatherMap'
    }).addTo(map)
    

}
function getMap(coordinates) {
    map.setView([coordinates[0], coordinates[1]], 9)
}

favoriteButton.addEventListener("click", function (){
    let location = inputText.value

    const item = document.createElement("li")
    const functioner = document.createElement("a")

    functioner.className = "dropdown-item"
    functioner.href = "#"
    functioner.textContent = location

    functioner.addEventListener("click", function() {
        favoriteFunction(location)
    })

    item.appendChild(functioner)
    dropdownMenu.appendChild(item)
})

async function favoriteFunction(location) {
    const selectedRadioButton = document.querySelector('input[name="temperature"]:checked')
    const URLWeatherAPI = `http://api.weatherapi.com/v1/forecast.json?key=460109e8cedb4bb199b140824241910&q=${location}&days=7`
    try {
        const resWeatherAPI = await fetch(URLWeatherAPI)
        const dataWeatherAPI = await resWeatherAPI.json()
        
        let coordinates = get_coords(dataWeatherAPI)  

        let URLOpen_Meteo = `https://api.open-meteo.com/v1/forecast?latitude=${coordinates[0]}&longitude=${coordinates[1]}&hourly=temperature_2m`
        const resOPENMETEO = await fetch(URLOpen_Meteo)
        const openMeteoAPI = await resOPENMETEO.json()

        data_handler(dataWeatherAPI, selectedRadioButton)
        build_chart(dataWeatherAPI, openMeteoAPI, selectedRadioButton)
        getMap(coordinates)
    } catch (error) {
        console.error('Fetch error:', error)
    }
}

initializeMap()