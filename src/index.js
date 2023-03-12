// TIME + DATE HANDLING

let now = new Date();

let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

let months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function formatDate(theDate) {
  let day = days[theDate.getDay()];
  let month = months[theDate.getMonth()];
  let date = theDate.getDate();
  if (date < 10) date = "0" + date;
  let year = theDate.getFullYear();
  let time = theDate.getHours();
  if (time < 10) time = "0" + time;
  let minutes = theDate.getMinutes();
  if (minutes < 10) minutes = "0" + minutes;
  let postfix = "th";
  if (date === 1) postfix = "st";
  if (date === 2) postfix = "nd";
  if (date === 3) postfix = "rd";

  return `${day} ${month} ${date + postfix}, ${year}, ${time}:${minutes}`;
}

function timeChange(theDate) {
  let showCurrentTime = document.querySelector("#current-time");
  showCurrentTime.innerHTML = formatDate(theDate);
}
function dateListUpdate(theDate) {
  let day = days[theDate.getDay()];
  let date = theDate.getDate();
  let month = theDate.getMonth() + 1;
  if (month < 10) month = "0" + month;
  let correctDay = document.querySelector("#today");
  let correctDate = document.querySelector("#today-date");
  correctDay.innerHTML = day;
  correctDate.innerHTML = `${date}/${month}`;
}

dateListUpdate(now);

timeChange(now);

// MAIN

const emojiMap = {
  "clear-sky-day": "☀️",
  "clear-sky-night": "🌙",
  "few-clouds-day": "🌤️",
  "few-clouds-night": "☁️",
  "scattered-clouds-day": "☁️",
  "scattered-clouds-night": "☁️",
  "broken-clouds-day": "⛅️",
  "broken-clouds-night": "☁️",
  "shower-rain-day": "🌦️",
  "shower-rain-night": "🌧️",
  "rain-day": "☔️",
  "rain-night": "🌧️",
  "thunderstorm-day": "🌩️",
  "thunderstorm-night": "🌩️",
  "snow-day": "☃️",
  "snow-night": "☃️",
  "mist-day": "😶‍🌫️",
  "mist-night": "😶‍🌫️",
};

function displayForecast(response) {
  console.log(response.data.daily);
  let forecastElement = document.querySelector("#weather-forecast");
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let forecastHTML = `<div class="row">`;
  days.forEach(function (forecastDay, index) {
    if (index < 4) {
      forecastHTML =
        forecastHTML +
        ` 
  <div class="col-3">
  <div class="card">
  <div class="col">
  <div class="day-forecast">Tuesday <br /> 09/01/2023</div>
  <div class="weather-icon-forecast">☀️<div class="description-forecast">Sun is out</div>
  </div>
  <div><strong class="temperature-forecast"> 5°</strong> <span
  class="feel-temperature-forecast">/0°</span></div>
  <div class="wind-forecast">💨 22km/h</div>
  <div class="humidity-forecast">💦 94%</div>
  </div>
  </div>
  </div>
  `;
    }
  });
  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function showTemperature(response) {
  // console.log(response);

  let temperature = Math.round(response.data.temperature.current);
  let relativeTemperature = Math.round(response.data.temperature.feels_like);
  let wind = Math.round(response.data.wind.speed * 3.6);
  let humidity = response.data.temperature.humidity;
  let description = response.data.condition.description;

  description = description.replace(/(^.)/, (match) => match.toUpperCase());

  let emoji = emojiMap[response.data.condition.icon];

  document.querySelector("h1").innerHTML = response.data.city;

  document.querySelector("#current-description").innerHTML = description;

  document.querySelector("#weather-icon").innerHTML = emoji;

  let currentTemperature = document.querySelector("#current-temperature");
  currentTemperature.innerHTML = `${temperature}°C`;

  let feelTemperature = document.querySelector("#feel-temperature");
  feelTemperature.innerHTML = `/ ${relativeTemperature}°C`;

  let currentWind = document.querySelector("#wind");
  currentWind.innerHTML = `💨 ${wind}km/h`;

  let currentHumidity = document.querySelector("#humidity");
  currentHumidity.innerHTML = `💦 ${humidity}%`;
}

function showPosition(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;

  let apiKey = "7c4obb17082t10ffeca04a159ac523a0";
  let units = "metric";

  document.querySelector("#search-input").value = "";

  let apiUrl = `https://api.shecodes.io/weather/v1/current?lon=${longitude}&lat=${latitude}&key=${apiKey}&units=${units}`;

  axios.get(apiUrl).then(showTemperature);
}

function search(city) {
  let apiKey = "7c4obb17082t10ffeca04a159ac523a0";
  let units = "metric";
  let apiUrlCity = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=${units}`;

  axios.get(apiUrlCity).then(showTemperature);
}

function getForecast(city) {
  let apiKey = "7c4obb17082t10ffeca04a159ac523a0";
  let units = "metric";
  let apiUrl = `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=${apiKey}&units=${units}`;
  console.log(apiUrl);

  axios.get(apiUrl).then(displayForecast);
}

function handleSubmit(event) {
  event.preventDefault();
  let city = document.querySelector("#search-input").value;
  search(city);
  getForecast(city);
}

function geoLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(showPosition);
}

let currentSearch = document.querySelector("#search-bar");
currentSearch.addEventListener("submit", handleSubmit);

let currentLocation = document.querySelector("#current-location");
currentLocation.addEventListener("click", geoLocation);

// CHANGE BETWEEN CELSIUS AND FAHRENHEIT

function changeUnit(event) {
  event.preventDefault();
  let tempEl = document.querySelector("a");
  let toFahrenheit = (celsius) => Math.round(celsius * (9 / 5) + 32);
  let toCelsius = (fahrenheit) => Math.round((fahrenheit - 32) * (5 / 9));
  if (currentTempUnit === "celsius") {
    tempEl.innerHTML = `${toFahrenheit(parseFloat(tempEl.innerText))}°F`;
    currentTempUnit = "fahrenheit";
  } else {
    tempEl.innerHTML = `${toCelsius(parseFloat(tempEl.innerText))}°C`;
    currentTempUnit = "celsius";
  }
}

// TO DO? - switching between C/F
//  current-temperature.classlist.add/remove("active")

let mainTemperature = document.querySelector("#current-temperature");
mainTemperature.addEventListener("click", changeUnit);
let currentTempUnit = "celsius";

search("Chamonix-Mont-Blanc");
getForecast("Chamonix-Mont-Blanc");
