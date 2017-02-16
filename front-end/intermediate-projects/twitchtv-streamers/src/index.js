import twitch from './twitchtv';

const streamers = [
	'ESL_SC2',
	'OgamingSC2',
	'cretetion',
	'freecodecamp',
	'storbeck',
	'habathcx',
	'RobotCaleb',
	'noobs2ninjas',
	'brunofin',
	'comster404'
];
const streamersElem = document.querySelector('.streamers');
const streamersListElem = streamersElem.querySelector('.streamers__list');

let streamerData = [];

init();

function init() {
	// Remove no-js classes
	streamersElem.classList.remove('streamers--no-js');

	// Get, sort, and render streamer data.
	refreshStreamerData()
		.then(() => {
			sortStreamers();
		})
		.then(() => {
			renderStreamers();
		})
		.catch(console.log);
}

function refreshStreamerData() {
	const promises = [];

	// Overwrite any existing data.
	streamerData = [];

	streamers.forEach(name => {
		const data = {name};

		promises.push(twitch.getChannelByName(name)
			.then(channel => {
				data.channel = channel;

				return twitch.getStreamByID(channel._id);
			})
			.then(streamData => {
				data.stream = streamData.stream;

				streamerData.push(data);
			})
			.catch(() => {
				data.channel = data.channel || null;
				data.stream = data.stream || null;

				streamerData.push(data);
			}));
	});

	return Promise.all(promises);
}

function sortStreamers(f = alphabeticalSort) {
	streamerData.sort(f);
}

function renderStreamers() {
	streamersListElem.innerHTML = '';

	streamerData.forEach(streamer => {
		let template;

		if (streamer.channel === null) {
			template = `
				<li class="streamer">
					<h2 class="streamer__name">
						${streamer.name}
					</h2>
					<p class="streamer__not-found">Not found.</p>
				</li>
			`;
		} else {
			const {url, display_name: displayName, logo, game, status} = streamer.channel;
			const streaming = streamer.stream !== null;
			const preview = streaming ? streamer.stream.preview.medium : null;

			template = `
				<li class="streamer">
					<header class="streamer__header">
						<h2 class="streamer__name">
							<a class="streamer__url" href="${url}">
								${displayName}
							</a>
						</h2>
						<img class="streamer__logo" src="${logo}">
					</header>
					<div class="streamer__stream">
						${streaming ?
							'<a class="streamer__stream-link" href="' + url + '"><img class="streamer__stream-preview" src="' + preview + '"></a>' :
							'<p class="streamer__stream-offline-notice">Offline</p>'}
					</div>
					<p class="streamer__game">${streaming ? 'Playing ' + game : ''}</p>
					<p class="streamer__status">${streaming ? status : ''}</p>
				</li>
			`;
		}

		streamersListElem.innerHTML += template;
	});
}

function alphabeticalSort(left, right) {
	left = left.name.toLowerCase();
	right = right.name.toLowerCase();

	if (left === right) {
		return 0;
	}

	return left > right ? 1 : -1;
}
