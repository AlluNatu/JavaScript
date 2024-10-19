const inputText = document.getElementById('input-data')
const addDataButton = document.getElementById("submit-data")
const weatherText = document.getElementById("weather_condition_text")
const weatherICON = document.getElementById("weather_icon")
const tempTEXT = document.getElementById("temperatureTEXT")
const locationTEXT = document.getElementById("location_text")
const weekForecast = document.getElementById("containerforweek")
const windText = document.getElementById("wind")
const element = document.querySelector('body');

addDataButton.addEventListener("click", async function() {
    const selectedRadioButton = document.querySelector('input[name="temperature"]:checked');
    const location = inputText.value
    const URLWeatherAPI = `http://api.weatherapi.com/v1/forecast.json?key=460109e8cedb4bb199b140824241910&q=${location}&days=7`
    try {
        const resWeatherAPI = await fetch(URLWeatherAPI);
        if (!resWeatherAPI.ok) {
            throw new Error('Bad request')
        }
        const dataWeatherAPI = await resWeatherAPI.json()
        
        let coordinates = get_coords(dataWeatherAPI)  

        const URLOpen_Meteo = `https://api.open-meteo.com/v1/forecast?latitude=${coordinates[0]}&longitude=${coordinates[1]}&hourly=temperature_2m`
        const resOPENMETEO = await fetch(URLOpen_Meteo);
        if (!resOPENMETEO.ok) {
            throw new Error('Bad request')
        }
        const openMeteoAPI = await resOPENMETEO.json()

        data_handler(dataWeatherAPI, selectedRadioButton)
        build_chart(dataWeatherAPI, openMeteoAPI, selectedRadioButton)
    } catch (error) {
        console.error('Fetch error:', error)
    }
    
    
})

function data_handler(data, radio){
    console.log(data)
    locationTEXT.textContent = data.location.country + " " + data.location.localtime
    weatherText.textContent = Object.values(data)[1].condition.text
    weatherICON.src = Object.values(data)[1].condition.icon
    weatherICON.style.display = 'block'
    windText.textContent = (`Wind: ${data.current.wind_kph}km/h`)
    location.text = data.location.country
    if (radio.value == "celsius"){
        tempTEXT.textContent = data.current.temp_c+"°c"

        for (let i = 0; i < 7; i++) {
            const forecastDay = data.forecast.forecastday[i];
            const box = weekForecast.children[i];
            box.innerHTML = `${forecastDay.date}: <br> <b>AVG Temp</b>: ${forecastDay.day.avgtemp_c}°C, ${forecastDay.day.condition.text}`;
            box.style.display = 'block';
        }
    }
    if (radio.value == "fahrenhait"){
        tempTEXT.textContent = data.current.temp_f+"°F"

        for (let i = 0; i < 7; i++) {
            const forecastDay = data.forecast.forecastday[i];
            const box = weekForecast.children[i];
            box.innerHTML = `${forecastDay.date}: <br> <b>AVG Temp</b>: ${forecastDay.day.avgtemp_f}°F, ${forecastDay.day.condition.text}`;
            box.style.display = 'block';
        }
    }
    if (radio.value == "kelvin"){
        tempTEXT.textContent = (Number(data.current.temp_c)+ 273.15).toFixed(1) + "K"

        for (let i = 0; i < 7; i++) {
            const forecastDay = data.forecast.forecastday[i];
            const box = weekForecast.children[i];
            box.innerHTML = `${forecastDay.date}: <br> <b>AVG Temp</b>: ${(Number(forecastDay.day.avgtemp_c)+273.15).toFixed(1)}K, ${forecastDay.day.condition.text}`;
            box.style.display = 'block';
        }
    }
    if (data.current.is_day == 0){
        document.body.style.backgroundColor = "#71797E";
        document.getElementById('background-photo').style.backgroundImage = `url(https://cdn.pixabay.com/photo/2016/11/25/23/15/moon-1859616_1280.jpg)`;
        element.style.color = "white";
    } else {
        document.body.style.backgroundColor = "";
        document.getElementById('background-photo').style.backgroundImage = `url(https://cdn.pixabay.com/photo/2018/06/21/13/57/clouds-3488632_1280.jpg)`;

    }
    
    if (data.current.precip_mm > 0.25) {
        document.getElementById('background-photo').style.backgroundImage = `url(https://cdn.pixabay.com/photo/2021/08/14/05/33/raindrop-6544618_1280.jpg)`;
        element.style.color = "lightblue";
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
        title: inputText.value + " temperature",
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
