import weather from './weather';

const weatherElem = document.querySelector('.weather');
const weatherFormElem = weatherElem.querySelector('.weather-form');
const weatherSearchElem = weatherElem.querySelector('.weather-form__search');
const weatherUnitToggleElem = weatherElem.querySelector('.weather-form__unit-toggle');
const weatherDataElem = weatherElem.querySelector('.weather-data');

let loadedWeather;
let units = weather.UNITS.IMPERIAL;

init();

/**
 * Initializes the application.
 */
function init() {
	// Remove no-js classes.
	weatherElem.classList.remove('weather--no-js');

	// Add event listeners.
	weatherFormElem.addEventListener('submit', handleWeatherFormSubmit);
	weatherUnitToggleElem.addEventListener('click', handleWeatherUnitToggleClick);

	// If geolocation is available, use it to load the user's current local weather.
	if ('geolocation' in navigator) {
		navigator.geolocation.getCurrentPosition(loadCurrentWeather);
	}
}

/**
 * Loads current weather data for the given location.
 * @param {string|number|object} location - Address, US zip code, or Position object.
 */
function loadCurrentWeather(location) {
	// Always use metric units. Convert when rendering if necessary.
	weather.getCurrent(location, weather.UNITS.METRIC)
		.then(data => {
			loadedWeather = data;
			renderWeather();
		})
		.catch(err => {
			console.log(err);
			loadedWeather = null;
			unrenderWeather();
		});
}

/**
 * Renders the loaded weather.
 */
function renderWeather() {
	if (!loadedWeather) {
		if (window.location.protocol === 'https:') {
			// Special case, API restricted to http.
			weatherDataElem.innerHTML = `
			<p>You are using a secure https: connection.</p>
			<p>Unfortunately due to restrictions with OpenWeatherMap's free services, we can only retrieve weather data using an unsecure http: connection.</p>
			<p>Consider allowing this connection by clicking the shield or lock in your address bar and allowing "unsafe scripts" or similar.</p>
			`;
		}

		return;
	}

	const metric = units === weather.UNITS.METRIC;

	const weatherDataHTML = `
	<h2 class="weather-data__title">${loadedWeather.name}</h2>
	<p class="weather-data__conditions">${loadedWeather.weather.map(obj => obj.description).join(', ')}</p>
	<div class="weather-data__icons">
		${loadedWeather.weather.map(obj => '<img class="weather-data__icon" src="//openweathermap.org/img/w/' + obj.icon + '.png">').join('')}
	</div>
	<p class="weather-data__temperature">${metric ? loadedWeather.main.temp : celsiusToFahrenheit(loadedWeather.main.temp)}&deg; ${metric ? 'C' : 'F'}</p>
	<p class="weather-data__humidity">${loadedWeather.main.humidity}% humidity</p>
	<p class="weather-data__clouds">${loadedWeather.clouds.all}% cloud cover</p>
	<p class="weather-data__wind">${metric ? loadedWeather.wind.speed : metersPerSecToMilesPerHour(loadedWeather.wind.speed)} ${metric ? 'meters/sec' : 'mph'} wind speed</p>
	`;

	weatherDataElem.innerHTML = weatherDataHTML;
}

/**
 * Unrenders the weather.
 */
function unrenderWeather() {
	weatherDataElem.innerHTML = '';
}

/**
 * Handles the weather form submit event.
 * @param {event} e - The submit event.
 */
function handleWeatherFormSubmit(e) {
	e.preventDefault();

	loadCurrentWeather(weatherSearchElem.value);
}

/**
 * Handles the weather unit toggle button click event.
 */
function handleWeatherUnitToggleClick() {
	const metric = units === weather.UNITS.METRIC;

	units = metric ? weather.UNITS.IMPERIAL : weather.UNITS.METRIC;

	renderWeather();
}

/**
 * Converts celsius to fahrenheit.
 * @param {number} c - Temperature in celsius.
 * @return {number} - Temperature in fahrenheit.
 */
function celsiusToFahrenheit(c) {
	return Math.round((c * (9 / 5)) + 32);
}

/**
 * Converts meters per second to miles per hour.
 * @param {number} mps - Speed in meters per second.
 * @return {number} - Speed in miles per hour.
 */
function metersPerSecToMilesPerHour(mps) {
	return Math.round(mps * 2.2369);
}
