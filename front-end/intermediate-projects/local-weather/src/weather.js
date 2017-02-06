const UNITS = {
	METRIC: 'metric',
	IMPERIAL: 'imperial'
};
const defaultUnits = UNITS.METRIC;
const apiUrl = 'http://api.openweathermap.org/data/2.5/weather';

/**
 * Gets current weather data from OpenWeatherMap.
 * @param {string|number|object} location - Address, US zip code, or Position object.
 * @param {string} [units=defaultUnits] - Units used.
 * @return {promise} - Promise for JSON format weather data.
 */
function getCurrent(location, units = defaultUnits) {
	let query = `?APPID=3ede0ecb10ad0159f505c52fdf1f3d31&units=${units}`;  // Congratulations, you've found a key! It's a free key, please be nice to it so I don't have to make another. Thank you!

	// Define query based on the type of location passed.
	if (typeof location === 'object') {
		// Position object.
		query += `&lat=${location.coords.latitude}&lon=${location.coords.longitude}`;
	} else if (typeof location === 'number' || /^\d+$/.test(location)) {
		// US zip code.
		query += `&zip=${location},us`;
	} else if (typeof location === 'string') {
		// City.
		query += `&q=${location}`;
	}

	const url = apiUrl + query;

	return fetch(url)
		.then(response => {
			if (response.ok) {
				return response.json();
			}

			throw new Error(`Could not fetch weather data: ${response.statusText}`);
		});
}

export default {
	UNITS,
	getCurrent
};
