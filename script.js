const API_KEY = `fb46e78552374c0f892123853232403`

const searchButton = document.getElementById("search-img");
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const errorMessage = document.getElementById('error-message');
const currentCity = document.getElementById('current-city');
const currentTemperature = document.getElementById('current-temperature');
const currentStatus = document.getElementById('current-status')
const forecast = document.getElementById('forecast')


searchButton.addEventListener("click", toggleForm);
searchForm.addEventListener('submit', searchCity);

function toggleForm() {
    searchForm.classList.toggle("show");
    currentCity.classList.toggle('show')
}

function searchCity(e) {
    e.preventDefault()
    getData(searchInput.value)
}

function getData(searchCity = 'tilburg') {
    const url = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${searchCity}&days=3&lang=nl`;
    fetch(url)
    .then(resp => resp.json())
    .then(data => useData(data))
}

function useData(data) {
    if (data.error) {
        errorMessage.innerText = 'Oeps, er ging iets fout!'
        return
    }
    toggleForm()
    clearAllFields()
    fillCity(data.location)
    setTimeout(() => {
        fillCurrent(data.current)
        fillForecast(data.forecast)
    }, data.location.name.length * 150 + 75)
}

function fillCity(location) {
    const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
    const currentLocation = location.name
    let itt = 0;

    const interval = setInterval(() => {
        currentCity.innerText = currentLocation.split("").map((letter, i) => {
            if (i < itt) {
                return currentLocation[i]
            }
            return letters[Math.floor(Math.random() * letters.length)]
        }).join("");

        if(itt >= currentLocation.length) {
            clearInterval(interval)
        }
        
        itt += .5
    }, 75)
}

function fillCurrent(data) {
    currentTemperature.innerHTML = `${data.temp_c}&deg;C`;
    currentStatus.innerText = data.condition.text;
}

function fillForecast(data) {
    const days = ["Zon", "Maa", "Din", "Woe", "Don", "Vrij", "Zat"];

    const table = document.createElement('table')
    const headerRow = document.createElement('tr')
    const statusRow = document.createElement('tr')
    const tempRow = document.createElement('tr')
    table.id = 'forecast-table'

    data.forecastday.forEach(day => {

        const head = document.createElement("th");
        const weekDay = days[new Date(day.date).getDay()]
        head.innerText = weekDay
        headerRow.appendChild(head)
        
        const dayStatus = document.createElement('td')
        const dayStatusImg = document.createElement('img')
        dayStatusImg.src = day.day.condition.icon
        dayStatus.appendChild(dayStatusImg)
        statusRow.appendChild(dayStatus)

        const dayTemp = document.createElement('td')
        dayTemp.innerHTML = `${Math.round(day.day.maxtemp_c)}&deg;C`;
        tempRow.appendChild(dayTemp)
    })
    table.appendChild(headerRow);
    table.appendChild(statusRow);
    table.appendChild(tempRow);

    forecast.appendChild(table)
}

function clearAllFields() {
    const forecastTable = document.getElementById("forecast-table");
    errorMessage.innerText = '-';
    currentCity.innerText = '-';
    currentTemperature.innerText = '-'
    currentStatus.innerText = '-'
    forecastTable ? forecastTable.remove() : ''
}
