(function () {
'use strict';

var UNITS = {
	METRIC: 'metric',
	IMPERIAL: 'imperial'
};
var defaultUnits = UNITS.METRIC;
var apiUrl = 'http://api.openweathermap.org/data/2.5/weather';

/**
 * Gets current weather data from OpenWeatherMap.
 * @param {string|number|object} location - Address, US zip code, or Position object.
 * @param {string} [units=defaultUnits] - Units used.
 * @return {promise} - Promise for JSON format weather data.
 */
function getCurrent(location, units) {
	if ( units === void 0 ) units = defaultUnits;

	var query = "?APPID=3ede0ecb10ad0159f505c52fdf1f3d31&units=" + units;  // Congratulations, you've found a key! It's a free key, please be nice to it so I don't have to make another. Thank you!

	// Define query based on the type of location passed.
	if (typeof location === 'object') {
		// Position object.
		query += "&lat=" + (location.coords.latitude) + "&lon=" + (location.coords.longitude);
	} else if (typeof location === 'number' || /^\d+$/.test(location)) {
		// US zip code.
		query += "&zip=" + location + ",us";
	} else if (typeof location === 'string') {
		// City.
		query += "&q=" + location;
	}

	var url = apiUrl + query;

	return fetch(url)
		.then(function (response) {
			if (response.ok) {
				return response.json();
			}

			throw new Error(("Could not fetch weather data: " + (response.statusText)));
		});
}

var weather = {
	UNITS: UNITS,
	getCurrent: getCurrent
};

var weatherElem = document.querySelector('.weather');
var weatherFormElem = weatherElem.querySelector('.weather-form');
var weatherSearchElem = weatherElem.querySelector('.weather-form__search');
var weatherUnitToggleElem = weatherElem.querySelector('.weather-form__unit-toggle');
var weatherDataElem = weatherElem.querySelector('.weather-data');

var loadedWeather;
var units = weather.UNITS.IMPERIAL;

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
		.then(function (data) {
			loadedWeather = data;
			renderWeather();
		})
		.catch(function (err) {
			console.log(err);
			loadedWeather = null;
			unrenderWeather();

			// Check connection.
			if (window.location.protocol === 'https:') {
				// Special case, API restricted to http.
				weatherDataElem.innerHTML = "\n\t\t\t\t\t<p>You are using a secure https: connection.</p>\n\t\t\t\t\t<p>Unfortunately due to restrictions with OpenWeatherMap's free services, we can only retrieve weather data using an unsecure http: connection.</p>\n\t\t\t\t\t<p>Consider allowing this connection by clicking the shield or lock in your address bar and allowing \"unsafe scripts\" or similar.</p>\n\t\t\t\t";
			}
		});
}

/**
 * Renders the loaded weather.
 */
function renderWeather() {
	if (!loadedWeather) {
		return;
	}

	var metric = units === weather.UNITS.METRIC;

	var weatherDataHTML = "\n\t\t<h2 class=\"weather-data__title\">" + (loadedWeather.name) + "</h2>\n\t\t<p class=\"weather-data__conditions\">" + (loadedWeather.weather.map(function (obj) { return obj.description; }).join(', ')) + "</p>\n\t\t<div class=\"weather-data__icons\">\n\t\t\t" + (loadedWeather.weather.map(function (obj) { return '<img class="weather-data__icon" src="//openweathermap.org/img/w/' + obj.icon + '.png">'; }).join('')) + "\n\t\t</div>\n\t\t<p class=\"weather-data__temperature\">" + (metric ? loadedWeather.main.temp : celsiusToFahrenheit(loadedWeather.main.temp)) + "&deg; " + (metric ? 'C' : 'F') + "</p>\n\t\t<p class=\"weather-data__humidity\">" + (loadedWeather.main.humidity) + "% humidity</p>\n\t\t<p class=\"weather-data__clouds\">" + (loadedWeather.clouds.all) + "% cloud cover</p>\n\t\t<p class=\"weather-data__wind\">" + (metric ? loadedWeather.wind.speed : metersPerSecToMilesPerHour(loadedWeather.wind.speed)) + " " + (metric ? 'meters/sec' : 'mph') + " wind speed</p>\n\t";

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
	var metric = units === weather.UNITS.METRIC;

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

}());
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlcyI6WyIuLi9zcmMvd2VhdGhlci5qcyIsIi4uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBVTklUUyA9IHtcblx0TUVUUklDOiAnbWV0cmljJyxcblx0SU1QRVJJQUw6ICdpbXBlcmlhbCdcbn07XG5jb25zdCBkZWZhdWx0VW5pdHMgPSBVTklUUy5NRVRSSUM7XG5jb25zdCBhcGlVcmwgPSAnaHR0cDovL2FwaS5vcGVud2VhdGhlcm1hcC5vcmcvZGF0YS8yLjUvd2VhdGhlcic7XG5cbi8qKlxuICogR2V0cyBjdXJyZW50IHdlYXRoZXIgZGF0YSBmcm9tIE9wZW5XZWF0aGVyTWFwLlxuICogQHBhcmFtIHtzdHJpbmd8bnVtYmVyfG9iamVjdH0gbG9jYXRpb24gLSBBZGRyZXNzLCBVUyB6aXAgY29kZSwgb3IgUG9zaXRpb24gb2JqZWN0LlxuICogQHBhcmFtIHtzdHJpbmd9IFt1bml0cz1kZWZhdWx0VW5pdHNdIC0gVW5pdHMgdXNlZC5cbiAqIEByZXR1cm4ge3Byb21pc2V9IC0gUHJvbWlzZSBmb3IgSlNPTiBmb3JtYXQgd2VhdGhlciBkYXRhLlxuICovXG5mdW5jdGlvbiBnZXRDdXJyZW50KGxvY2F0aW9uLCB1bml0cyA9IGRlZmF1bHRVbml0cykge1xuXHRsZXQgcXVlcnkgPSBgP0FQUElEPTNlZGUwZWNiMTBhZDAxNTlmNTA1YzUyZmRmMWYzZDMxJnVuaXRzPSR7dW5pdHN9YDsgIC8vIENvbmdyYXR1bGF0aW9ucywgeW91J3ZlIGZvdW5kIGEga2V5ISBJdCdzIGEgZnJlZSBrZXksIHBsZWFzZSBiZSBuaWNlIHRvIGl0IHNvIEkgZG9uJ3QgaGF2ZSB0byBtYWtlIGFub3RoZXIuIFRoYW5rIHlvdSFcblxuXHQvLyBEZWZpbmUgcXVlcnkgYmFzZWQgb24gdGhlIHR5cGUgb2YgbG9jYXRpb24gcGFzc2VkLlxuXHRpZiAodHlwZW9mIGxvY2F0aW9uID09PSAnb2JqZWN0Jykge1xuXHRcdC8vIFBvc2l0aW9uIG9iamVjdC5cblx0XHRxdWVyeSArPSBgJmxhdD0ke2xvY2F0aW9uLmNvb3Jkcy5sYXRpdHVkZX0mbG9uPSR7bG9jYXRpb24uY29vcmRzLmxvbmdpdHVkZX1gO1xuXHR9IGVsc2UgaWYgKHR5cGVvZiBsb2NhdGlvbiA9PT0gJ251bWJlcicgfHwgL15cXGQrJC8udGVzdChsb2NhdGlvbikpIHtcblx0XHQvLyBVUyB6aXAgY29kZS5cblx0XHRxdWVyeSArPSBgJnppcD0ke2xvY2F0aW9ufSx1c2A7XG5cdH0gZWxzZSBpZiAodHlwZW9mIGxvY2F0aW9uID09PSAnc3RyaW5nJykge1xuXHRcdC8vIENpdHkuXG5cdFx0cXVlcnkgKz0gYCZxPSR7bG9jYXRpb259YDtcblx0fVxuXG5cdGNvbnN0IHVybCA9IGFwaVVybCArIHF1ZXJ5O1xuXG5cdHJldHVybiBmZXRjaCh1cmwpXG5cdFx0LnRoZW4ocmVzcG9uc2UgPT4ge1xuXHRcdFx0aWYgKHJlc3BvbnNlLm9rKSB7XG5cdFx0XHRcdHJldHVybiByZXNwb25zZS5qc29uKCk7XG5cdFx0XHR9XG5cblx0XHRcdHRocm93IG5ldyBFcnJvcihgQ291bGQgbm90IGZldGNoIHdlYXRoZXIgZGF0YTogJHtyZXNwb25zZS5zdGF0dXNUZXh0fWApO1xuXHRcdH0pO1xufVxuXG5leHBvcnQgZGVmYXVsdCB7XG5cdFVOSVRTLFxuXHRnZXRDdXJyZW50XG59O1xuIiwiaW1wb3J0IHdlYXRoZXIgZnJvbSAnLi93ZWF0aGVyJztcblxuY29uc3Qgd2VhdGhlckVsZW0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcud2VhdGhlcicpO1xuY29uc3Qgd2VhdGhlckZvcm1FbGVtID0gd2VhdGhlckVsZW0ucXVlcnlTZWxlY3RvcignLndlYXRoZXItZm9ybScpO1xuY29uc3Qgd2VhdGhlclNlYXJjaEVsZW0gPSB3ZWF0aGVyRWxlbS5xdWVyeVNlbGVjdG9yKCcud2VhdGhlci1mb3JtX19zZWFyY2gnKTtcbmNvbnN0IHdlYXRoZXJVbml0VG9nZ2xlRWxlbSA9IHdlYXRoZXJFbGVtLnF1ZXJ5U2VsZWN0b3IoJy53ZWF0aGVyLWZvcm1fX3VuaXQtdG9nZ2xlJyk7XG5jb25zdCB3ZWF0aGVyRGF0YUVsZW0gPSB3ZWF0aGVyRWxlbS5xdWVyeVNlbGVjdG9yKCcud2VhdGhlci1kYXRhJyk7XG5cbmxldCBsb2FkZWRXZWF0aGVyO1xubGV0IHVuaXRzID0gd2VhdGhlci5VTklUUy5JTVBFUklBTDtcblxuaW5pdCgpO1xuXG4vKipcbiAqIEluaXRpYWxpemVzIHRoZSBhcHBsaWNhdGlvbi5cbiAqL1xuZnVuY3Rpb24gaW5pdCgpIHtcblx0Ly8gUmVtb3ZlIG5vLWpzIGNsYXNzZXMuXG5cdHdlYXRoZXJFbGVtLmNsYXNzTGlzdC5yZW1vdmUoJ3dlYXRoZXItLW5vLWpzJyk7XG5cblx0Ly8gQWRkIGV2ZW50IGxpc3RlbmVycy5cblx0d2VhdGhlckZvcm1FbGVtLmFkZEV2ZW50TGlzdGVuZXIoJ3N1Ym1pdCcsIGhhbmRsZVdlYXRoZXJGb3JtU3VibWl0KTtcblx0d2VhdGhlclVuaXRUb2dnbGVFbGVtLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgaGFuZGxlV2VhdGhlclVuaXRUb2dnbGVDbGljayk7XG5cblx0Ly8gSWYgZ2VvbG9jYXRpb24gaXMgYXZhaWxhYmxlLCB1c2UgaXQgdG8gbG9hZCB0aGUgdXNlcidzIGN1cnJlbnQgbG9jYWwgd2VhdGhlci5cblx0aWYgKCdnZW9sb2NhdGlvbicgaW4gbmF2aWdhdG9yKSB7XG5cdFx0bmF2aWdhdG9yLmdlb2xvY2F0aW9uLmdldEN1cnJlbnRQb3NpdGlvbihsb2FkQ3VycmVudFdlYXRoZXIpO1xuXHR9XG59XG5cbi8qKlxuICogTG9hZHMgY3VycmVudCB3ZWF0aGVyIGRhdGEgZm9yIHRoZSBnaXZlbiBsb2NhdGlvbi5cbiAqIEBwYXJhbSB7c3RyaW5nfG51bWJlcnxvYmplY3R9IGxvY2F0aW9uIC0gQWRkcmVzcywgVVMgemlwIGNvZGUsIG9yIFBvc2l0aW9uIG9iamVjdC5cbiAqL1xuZnVuY3Rpb24gbG9hZEN1cnJlbnRXZWF0aGVyKGxvY2F0aW9uKSB7XG5cdC8vIEFsd2F5cyB1c2UgbWV0cmljIHVuaXRzLiBDb252ZXJ0IHdoZW4gcmVuZGVyaW5nIGlmIG5lY2Vzc2FyeS5cblx0d2VhdGhlci5nZXRDdXJyZW50KGxvY2F0aW9uLCB3ZWF0aGVyLlVOSVRTLk1FVFJJQylcblx0XHQudGhlbihkYXRhID0+IHtcblx0XHRcdGxvYWRlZFdlYXRoZXIgPSBkYXRhO1xuXHRcdFx0cmVuZGVyV2VhdGhlcigpO1xuXHRcdH0pXG5cdFx0LmNhdGNoKGVyciA9PiB7XG5cdFx0XHRjb25zb2xlLmxvZyhlcnIpO1xuXHRcdFx0bG9hZGVkV2VhdGhlciA9IG51bGw7XG5cdFx0XHR1bnJlbmRlcldlYXRoZXIoKTtcblxuXHRcdFx0Ly8gQ2hlY2sgY29ubmVjdGlvbi5cblx0XHRcdGlmICh3aW5kb3cubG9jYXRpb24ucHJvdG9jb2wgPT09ICdodHRwczonKSB7XG5cdFx0XHRcdC8vIFNwZWNpYWwgY2FzZSwgQVBJIHJlc3RyaWN0ZWQgdG8gaHR0cC5cblx0XHRcdFx0d2VhdGhlckRhdGFFbGVtLmlubmVySFRNTCA9IGBcblx0XHRcdFx0XHQ8cD5Zb3UgYXJlIHVzaW5nIGEgc2VjdXJlIGh0dHBzOiBjb25uZWN0aW9uLjwvcD5cblx0XHRcdFx0XHQ8cD5VbmZvcnR1bmF0ZWx5IGR1ZSB0byByZXN0cmljdGlvbnMgd2l0aCBPcGVuV2VhdGhlck1hcCdzIGZyZWUgc2VydmljZXMsIHdlIGNhbiBvbmx5IHJldHJpZXZlIHdlYXRoZXIgZGF0YSB1c2luZyBhbiB1bnNlY3VyZSBodHRwOiBjb25uZWN0aW9uLjwvcD5cblx0XHRcdFx0XHQ8cD5Db25zaWRlciBhbGxvd2luZyB0aGlzIGNvbm5lY3Rpb24gYnkgY2xpY2tpbmcgdGhlIHNoaWVsZCBvciBsb2NrIGluIHlvdXIgYWRkcmVzcyBiYXIgYW5kIGFsbG93aW5nIFwidW5zYWZlIHNjcmlwdHNcIiBvciBzaW1pbGFyLjwvcD5cblx0XHRcdFx0YDtcblx0XHRcdH1cblx0XHR9KTtcbn1cblxuLyoqXG4gKiBSZW5kZXJzIHRoZSBsb2FkZWQgd2VhdGhlci5cbiAqL1xuZnVuY3Rpb24gcmVuZGVyV2VhdGhlcigpIHtcblx0aWYgKCFsb2FkZWRXZWF0aGVyKSB7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0Y29uc3QgbWV0cmljID0gdW5pdHMgPT09IHdlYXRoZXIuVU5JVFMuTUVUUklDO1xuXG5cdGNvbnN0IHdlYXRoZXJEYXRhSFRNTCA9IGBcblx0XHQ8aDIgY2xhc3M9XCJ3ZWF0aGVyLWRhdGFfX3RpdGxlXCI+JHtsb2FkZWRXZWF0aGVyLm5hbWV9PC9oMj5cblx0XHQ8cCBjbGFzcz1cIndlYXRoZXItZGF0YV9fY29uZGl0aW9uc1wiPiR7bG9hZGVkV2VhdGhlci53ZWF0aGVyLm1hcChvYmogPT4gb2JqLmRlc2NyaXB0aW9uKS5qb2luKCcsICcpfTwvcD5cblx0XHQ8ZGl2IGNsYXNzPVwid2VhdGhlci1kYXRhX19pY29uc1wiPlxuXHRcdFx0JHtsb2FkZWRXZWF0aGVyLndlYXRoZXIubWFwKG9iaiA9PiAnPGltZyBjbGFzcz1cIndlYXRoZXItZGF0YV9faWNvblwiIHNyYz1cIi8vb3BlbndlYXRoZXJtYXAub3JnL2ltZy93LycgKyBvYmouaWNvbiArICcucG5nXCI+Jykuam9pbignJyl9XG5cdFx0PC9kaXY+XG5cdFx0PHAgY2xhc3M9XCJ3ZWF0aGVyLWRhdGFfX3RlbXBlcmF0dXJlXCI+JHttZXRyaWMgPyBsb2FkZWRXZWF0aGVyLm1haW4udGVtcCA6IGNlbHNpdXNUb0ZhaHJlbmhlaXQobG9hZGVkV2VhdGhlci5tYWluLnRlbXApfSZkZWc7ICR7bWV0cmljID8gJ0MnIDogJ0YnfTwvcD5cblx0XHQ8cCBjbGFzcz1cIndlYXRoZXItZGF0YV9faHVtaWRpdHlcIj4ke2xvYWRlZFdlYXRoZXIubWFpbi5odW1pZGl0eX0lIGh1bWlkaXR5PC9wPlxuXHRcdDxwIGNsYXNzPVwid2VhdGhlci1kYXRhX19jbG91ZHNcIj4ke2xvYWRlZFdlYXRoZXIuY2xvdWRzLmFsbH0lIGNsb3VkIGNvdmVyPC9wPlxuXHRcdDxwIGNsYXNzPVwid2VhdGhlci1kYXRhX193aW5kXCI+JHttZXRyaWMgPyBsb2FkZWRXZWF0aGVyLndpbmQuc3BlZWQgOiBtZXRlcnNQZXJTZWNUb01pbGVzUGVySG91cihsb2FkZWRXZWF0aGVyLndpbmQuc3BlZWQpfSAke21ldHJpYyA/ICdtZXRlcnMvc2VjJyA6ICdtcGgnfSB3aW5kIHNwZWVkPC9wPlxuXHRgO1xuXG5cdHdlYXRoZXJEYXRhRWxlbS5pbm5lckhUTUwgPSB3ZWF0aGVyRGF0YUhUTUw7XG59XG5cbi8qKlxuICogVW5yZW5kZXJzIHRoZSB3ZWF0aGVyLlxuICovXG5mdW5jdGlvbiB1bnJlbmRlcldlYXRoZXIoKSB7XG5cdHdlYXRoZXJEYXRhRWxlbS5pbm5lckhUTUwgPSAnJztcbn1cblxuLyoqXG4gKiBIYW5kbGVzIHRoZSB3ZWF0aGVyIGZvcm0gc3VibWl0IGV2ZW50LlxuICogQHBhcmFtIHtldmVudH0gZSAtIFRoZSBzdWJtaXQgZXZlbnQuXG4gKi9cbmZ1bmN0aW9uIGhhbmRsZVdlYXRoZXJGb3JtU3VibWl0KGUpIHtcblx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdGxvYWRDdXJyZW50V2VhdGhlcih3ZWF0aGVyU2VhcmNoRWxlbS52YWx1ZSk7XG59XG5cbi8qKlxuICogSGFuZGxlcyB0aGUgd2VhdGhlciB1bml0IHRvZ2dsZSBidXR0b24gY2xpY2sgZXZlbnQuXG4gKi9cbmZ1bmN0aW9uIGhhbmRsZVdlYXRoZXJVbml0VG9nZ2xlQ2xpY2soKSB7XG5cdGNvbnN0IG1ldHJpYyA9IHVuaXRzID09PSB3ZWF0aGVyLlVOSVRTLk1FVFJJQztcblxuXHR1bml0cyA9IG1ldHJpYyA/IHdlYXRoZXIuVU5JVFMuSU1QRVJJQUwgOiB3ZWF0aGVyLlVOSVRTLk1FVFJJQztcblxuXHRyZW5kZXJXZWF0aGVyKCk7XG59XG5cbi8qKlxuICogQ29udmVydHMgY2Vsc2l1cyB0byBmYWhyZW5oZWl0LlxuICogQHBhcmFtIHtudW1iZXJ9IGMgLSBUZW1wZXJhdHVyZSBpbiBjZWxzaXVzLlxuICogQHJldHVybiB7bnVtYmVyfSAtIFRlbXBlcmF0dXJlIGluIGZhaHJlbmhlaXQuXG4gKi9cbmZ1bmN0aW9uIGNlbHNpdXNUb0ZhaHJlbmhlaXQoYykge1xuXHRyZXR1cm4gTWF0aC5yb3VuZCgoYyAqICg5IC8gNSkpICsgMzIpO1xufVxuXG4vKipcbiAqIENvbnZlcnRzIG1ldGVycyBwZXIgc2Vjb25kIHRvIG1pbGVzIHBlciBob3VyLlxuICogQHBhcmFtIHtudW1iZXJ9IG1wcyAtIFNwZWVkIGluIG1ldGVycyBwZXIgc2Vjb25kLlxuICogQHJldHVybiB7bnVtYmVyfSAtIFNwZWVkIGluIG1pbGVzIHBlciBob3VyLlxuICovXG5mdW5jdGlvbiBtZXRlcnNQZXJTZWNUb01pbGVzUGVySG91cihtcHMpIHtcblx0cmV0dXJuIE1hdGgucm91bmQobXBzICogMi4yMzY5KTtcbn1cbiJdLCJuYW1lcyI6WyJjb25zdCIsImxldCJdLCJtYXBwaW5ncyI6Ijs7O0FBQUFBLElBQU0sS0FBSyxHQUFHO0NBQ2IsTUFBTSxFQUFFLFFBQVE7Q0FDaEIsUUFBUSxFQUFFLFVBQVU7Q0FDcEIsQ0FBQztBQUNGQSxJQUFNLFlBQVksR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDO0FBQ2xDQSxJQUFNLE1BQU0sR0FBRyxnREFBZ0QsQ0FBQzs7Ozs7Ozs7QUFRaEUsU0FBUyxVQUFVLENBQUMsUUFBUSxFQUFFLEtBQW9CLEVBQUU7OEJBQWpCLEdBQUcsWUFBWTs7Q0FDakRDLElBQUksS0FBSyxHQUFHLGdEQUErQyxHQUFFLEtBQUssQ0FBRzs7O0NBR3JFLElBQUksT0FBTyxRQUFRLEtBQUssUUFBUSxFQUFFOztFQUVqQyxLQUFLLElBQUksT0FBTSxJQUFFLFFBQVEsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFBLFVBQU0sSUFBRSxRQUFRLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQSxDQUFHO0VBQzdFLE1BQU0sSUFBSSxPQUFPLFFBQVEsS0FBSyxRQUFRLElBQUksT0FBTyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRTs7RUFFbEUsS0FBSyxJQUFJLE9BQU0s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
