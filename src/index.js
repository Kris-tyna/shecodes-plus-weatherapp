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
  let year = theDate.getFullYear();
  let time = theDate.getHours();
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

function showTemperature(response) {
  console.log(response);

  let temperature = Math.round(response.data.temperature.current);
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

  let currentWind = document.querySelector("#wind");
  currentWind.innerHTML = `💨 ${wind}km/h`;

  let currentHumidity = document.querySelector("#humidity");
  currentHumidity.innerHTML = `💦 ${humidity}%`;
}

function showPosition(position) {
  let latitude = position.data.coordinates.latitude;
  let longitude = position.data.coordinates.longitude;

  let apiKey = "7c4obb17082t10ffeca04a159ac523a0";
  let units = "metric";

  let apiUrl = `https://api.shecodes.io/weather/v1/current?lon=${longitude}&lat=${latitude}&key=${apiKey}&units=${units}`;

  axios.get(apiUrl).then(showTemperature);
}

function search(city) {
  let apiKey = "7c4obb17082t10ffeca04a159ac523a0";
  let units = "metric";
  let apiUrlCity = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=${units}`;
  console.log(apiUrlCity);

  axios.get(apiUrlCity).then(showTemperature);
}

function handleSubmit(event) {
  event.preventDefault();
  let city = document.querySelector("#search-input").value;
  search(city);
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
