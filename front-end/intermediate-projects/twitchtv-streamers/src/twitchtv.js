const apiURL = `https://api.twitch.tv/kraken`;
const headers = {
	Accept: 'application/vnd.twitchtv.v5+json',
	'Client-ID': 'stymm879hhnyrp9edgzhjzmrri6w1b'
};

function getChannelByID(id) {
	const fetchURL = `${apiURL}/channels/${id}`;
	return fetch(fetchURL, {headers})
		.then(response => {
			if (response.ok) {
				return response.json();
			}

			throw new Error(`Could not fetch twitch.tv channel: ${response.statusText}`);
		});
}

function getChannelByName(name) {
	return searchChannels(name)
		.then(data => {
			const filteredData = data.channels.filter(channel => channel.name === name.toLowerCase());

			if (filteredData.length > 0) {
				return filteredData[0];
			}

			throw new Error(`Could not find matching twitch.tv channel for ${name}.`);
		});
}

function getStreamByID(id) {
	const fetchURL = `${apiURL}/streams/${id}`;
	return fetch(fetchURL, {headers})
		.then(response => {
			if (response.ok) {
				return response.json();
			}

			throw new Error(`Could not fetch twitch.tv stream: ${response.statusText}`);
		});
}

function searchChannels(query, options = {limit: 25, offset: 0}) {
	const fetchURL = `${apiURL}/search/channels?query=${query}&limit=${options.limit}&offset=${options.offset}`;
	return fetch(fetchURL, {headers})
		.then(response => {
			if (response.ok) {
				return response.json();
			}

			throw new Error(`Could not fetch twitch.tv channel search: ${response.statusText}`);
		});
}

export default {
	getChannelByID,
	getChannelByName,
	getStreamByID,
	searchChannels
};
