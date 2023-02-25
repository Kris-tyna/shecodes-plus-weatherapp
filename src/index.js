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
// to do - add emoji mapping

function showTemperature(response) {
  let temperature = Math.round(response.data.main.temp);
  let wind = Math.round(response.data.wind.speed * 3.6);
  let humidity = response.data.main.humidity;
  let description = response.data.weather[0].description;

  description = description.replace(/(^.)/, (match) => match.toUpperCase());

  console.log(response);

  document.querySelector("h1").innerHTML = response.data.name;

  document.querySelector("#current-description").innerHTML = description;

  let currentTemperature = document.querySelector("#current-temperature");
  currentTemperature.innerHTML = `${temperature}°C`;

  let currentWind = document.querySelector("#wind");
  currentWind.innerHTML = `💨 ${wind}km/h`;

  let currentHumidity = document.querySelector("#humidity");
  currentHumidity.innerHTML = `💦 ${humidity}%`;
}

function showPosition(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;

  let apiKey = "7746bdeabca928cfedcad71e52fd9d66";
  let units = "metric";

  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${units}`;

  axios.get(apiUrl).then(showTemperature);
}

function search(city) {
  let apiKey = "7746bdeabca928cfedcad71e52fd9d66";
  let units = "metric";
  let apiUrlCity = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;

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
let mainTemperature = document.querySelector("#current-temperature");
mainTemperature.addEventListener("click", changeUnit);
let currentTempUnit = "celsius";

search("Chamonix");
