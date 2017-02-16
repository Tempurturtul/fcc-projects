(function () {
'use strict';

var apiURL = "https://api.twitch.tv/kraken";
var headers = {
	Accept: 'application/vnd.twitchtv.v5+json',
	'Client-ID': 'stymm879hhnyrp9edgzhjzmrri6w1b'
};

function getChannelByID(id) {
	var fetchURL = apiURL + "/channels/" + id;
	return fetch(fetchURL, {headers: headers})
		.then(function (response) {
			if (response.ok) {
				return response.json();
			}

			throw new Error(("Could not fetch twitch.tv channel: " + (response.statusText)));
		});
}

function getChannelByName(name) {
	return searchChannels(name)
		.then(function (data) {
			var filteredData = data.channels.filter(function (channel) { return channel.name === name.toLowerCase(); });

			if (filteredData.length > 0) {
				return filteredData[0];
			}

			throw new Error(("Could not find matching twitch.tv channel for " + name + "."));
		});
}

function getStreamByID(id) {
	var fetchURL = apiURL + "/streams/" + id;
	return fetch(fetchURL, {headers: headers})
		.then(function (response) {
			if (response.ok) {
				return response.json();
			}

			throw new Error(("Could not fetch twitch.tv stream: " + (response.statusText)));
		});
}

function searchChannels(query, options) {
	if ( options === void 0 ) options = {limit: 25, offset: 0};

	var fetchURL = apiURL + "/search/channels?query=" + query + "&limit=" + (options.limit) + "&offset=" + (options.offset);
	return fetch(fetchURL, {headers: headers})
		.then(function (response) {
			if (response.ok) {
				return response.json();
			}

			throw new Error(("Could not fetch twitch.tv channel search: " + (response.statusText)));
		});
}

var twitch = {
	getChannelByID: getChannelByID,
	getChannelByName: getChannelByName,
	getStreamByID: getStreamByID,
	searchChannels: searchChannels
};

var streamers = [
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
var streamersElem = document.querySelector('.streamers');
var streamersListElem = streamersElem.querySelector('.streamers__list');

var streamerData = [];

init();

function init() {
	// Remove no-js classes
	streamersElem.classList.remove('streamers--no-js');

	// Get, sort, and render streamer data.
	refreshStreamerData()
		.then(function () {
			sortStreamers();
		})
		.then(function () {
			renderStreamers();
		})
		.catch(console.log);
}

function refreshStreamerData() {
	var promises = [];

	// Overwrite any existing data.
	streamerData = [];

	streamers.forEach(function (name) {
		var data = {name: name};

		promises.push(twitch.getChannelByName(name)
			.then(function (channel) {
				data.channel = channel;

				return twitch.getStreamByID(channel._id);
			})
			.then(function (streamData) {
				data.stream = streamData.stream;

				streamerData.push(data);
			})
			.catch(function () {
				data.channel = data.channel || null;
				data.stream = data.stream || null;

				streamerData.push(data);
			}));
	});

	return Promise.all(promises);
}

function sortStreamers(f) {
	if ( f === void 0 ) f = alphabeticalSort;

	streamerData.sort(f);
}

function renderStreamers() {
	streamersListElem.innerHTML = '';

	streamerData.forEach(function (streamer) {
		var template;

		if (streamer.channel === null) {
			template = "\n\t\t\t\t<li class=\"streamer\">\n\t\t\t\t\t<h2 class=\"streamer__name\">\n\t\t\t\t\t\t" + (streamer.name) + "\n\t\t\t\t\t</h2>\n\t\t\t\t\t<p class=\"streamer__not-found\">Not found.</p>\n\t\t\t\t</li>\n\t\t\t";
		} else {
			var ref = streamer.channel;
			var url = ref.url;
			var displayName = ref.display_name;
			var logo = ref.logo;
			var game = ref.game;
			var status = ref.status;
			var streaming = streamer.stream !== null;
			var preview = streaming ? streamer.stream.preview.medium : null;

			template = "\n\t\t\t\t<li class=\"streamer\">\n\t\t\t\t\t<header class=\"streamer__header\">\n\t\t\t\t\t\t<h2 class=\"streamer__name\">\n\t\t\t\t\t\t\t<a class=\"streamer__url\" href=\"" + url + "\">\n\t\t\t\t\t\t\t\t" + displayName + "\n\t\t\t\t\t\t\t</a>\n\t\t\t\t\t\t</h2>\n\t\t\t\t\t\t<img class=\"streamer__logo\" src=\"" + logo + "\">\n\t\t\t\t\t</header>\n\t\t\t\t\t<div class=\"streamer__stream\">\n\t\t\t\t\t\t" + (streaming ?
							'<a class="streamer__stream-link" href="' + url + '"><img class="streamer__stream-preview" src="' + preview + '"></a>' :
							'<p class="streamer__stream-offline-notice">Offline</p>') + "\n\t\t\t\t\t</div>\n\t\t\t\t\t<p class=\"streamer__game\">" + (streaming ? 'Playing ' + game : '') + "</p>\n\t\t\t\t\t<p class=\"streamer__status\">" + (streaming ? status : '') + "</p>\n\t\t\t\t</li>\n\t\t\t";
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

}());
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlcyI6WyIuLi9zcmMvdHdpdGNodHYuanMiLCIuLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgYXBpVVJMID0gYGh0dHBzOi8vYXBpLnR3aXRjaC50di9rcmFrZW5gO1xuY29uc3QgaGVhZGVycyA9IHtcblx0QWNjZXB0OiAnYXBwbGljYXRpb24vdm5kLnR3aXRjaHR2LnY1K2pzb24nLFxuXHQnQ2xpZW50LUlEJzogJ3N0eW1tODc5aGhueXJwOWVkZ3poanptcnJpNncxYidcbn07XG5cbmZ1bmN0aW9uIGdldENoYW5uZWxCeUlEKGlkKSB7XG5cdGNvbnN0IGZldGNoVVJMID0gYCR7YXBpVVJMfS9jaGFubmVscy8ke2lkfWA7XG5cdHJldHVybiBmZXRjaChmZXRjaFVSTCwge2hlYWRlcnN9KVxuXHRcdC50aGVuKHJlc3BvbnNlID0+IHtcblx0XHRcdGlmIChyZXNwb25zZS5vaykge1xuXHRcdFx0XHRyZXR1cm4gcmVzcG9uc2UuanNvbigpO1xuXHRcdFx0fVxuXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYENvdWxkIG5vdCBmZXRjaCB0d2l0Y2gudHYgY2hhbm5lbDogJHtyZXNwb25zZS5zdGF0dXNUZXh0fWApO1xuXHRcdH0pO1xufVxuXG5mdW5jdGlvbiBnZXRDaGFubmVsQnlOYW1lKG5hbWUpIHtcblx0cmV0dXJuIHNlYXJjaENoYW5uZWxzKG5hbWUpXG5cdFx0LnRoZW4oZGF0YSA9PiB7XG5cdFx0XHRjb25zdCBmaWx0ZXJlZERhdGEgPSBkYXRhLmNoYW5uZWxzLmZpbHRlcihjaGFubmVsID0+IGNoYW5uZWwubmFtZSA9PT0gbmFtZS50b0xvd2VyQ2FzZSgpKTtcblxuXHRcdFx0aWYgKGZpbHRlcmVkRGF0YS5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdHJldHVybiBmaWx0ZXJlZERhdGFbMF07XG5cdFx0XHR9XG5cblx0XHRcdHRocm93IG5ldyBFcnJvcihgQ291bGQgbm90IGZpbmQgbWF0Y2hpbmcgdHdpdGNoLnR2IGNoYW5uZWwgZm9yICR7bmFtZX0uYCk7XG5cdFx0fSk7XG59XG5cbmZ1bmN0aW9uIGdldFN0cmVhbUJ5SUQoaWQpIHtcblx0Y29uc3QgZmV0Y2hVUkwgPSBgJHthcGlVUkx9L3N0cmVhbXMvJHtpZH1gO1xuXHRyZXR1cm4gZmV0Y2goZmV0Y2hVUkwsIHtoZWFkZXJzfSlcblx0XHQudGhlbihyZXNwb25zZSA9PiB7XG5cdFx0XHRpZiAocmVzcG9uc2Uub2spIHtcblx0XHRcdFx0cmV0dXJuIHJlc3BvbnNlLmpzb24oKTtcblx0XHRcdH1cblxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBDb3VsZCBub3QgZmV0Y2ggdHdpdGNoLnR2IHN0cmVhbTogJHtyZXNwb25zZS5zdGF0dXNUZXh0fWApO1xuXHRcdH0pO1xufVxuXG5mdW5jdGlvbiBzZWFyY2hDaGFubmVscyhxdWVyeSwgb3B0aW9ucyA9IHtsaW1pdDogMjUsIG9mZnNldDogMH0pIHtcblx0Y29uc3QgZmV0Y2hVUkwgPSBgJHthcGlVUkx9L3NlYXJjaC9jaGFubmVscz9xdWVyeT0ke3F1ZXJ5fSZsaW1pdD0ke29wdGlvbnMubGltaXR9Jm9mZnNldD0ke29wdGlvbnMub2Zmc2V0fWA7XG5cdHJldHVybiBmZXRjaChmZXRjaFVSTCwge2hlYWRlcnN9KVxuXHRcdC50aGVuKHJlc3BvbnNlID0+IHtcblx0XHRcdGlmIChyZXNwb25zZS5vaykge1xuXHRcdFx0XHRyZXR1cm4gcmVzcG9uc2UuanNvbigpO1xuXHRcdFx0fVxuXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYENvdWxkIG5vdCBmZXRjaCB0d2l0Y2gudHYgY2hhbm5lbCBzZWFyY2g6ICR7cmVzcG9uc2Uuc3RhdHVzVGV4dH1gKTtcblx0XHR9KTtcbn1cblxuZXhwb3J0IGRlZmF1bHQge1xuXHRnZXRDaGFubmVsQnlJRCxcblx0Z2V0Q2hhbm5lbEJ5TmFtZSxcblx0Z2V0U3RyZWFtQnlJRCxcblx0c2VhcmNoQ2hhbm5lbHNcbn07XG4iLCJpbXBvcnQgdHdpdGNoIGZyb20gJy4vdHdpdGNodHYnO1xuXG5jb25zdCBzdHJlYW1lcnMgPSBbXG5cdCdFU0xfU0MyJyxcblx0J09nYW1pbmdTQzInLFxuXHQnY3JldGV0aW9uJyxcblx0J2ZyZWVjb2RlY2FtcCcsXG5cdCdzdG9yYmVjaycsXG5cdCdoYWJhdGhjeCcsXG5cdCdSb2JvdENhbGViJyxcblx0J25vb2JzMm5pbmphcycsXG5cdCdicnVub2ZpbicsXG5cdCdjb21zdGVyNDA0J1xuXTtcbmNvbnN0IHN0cmVhbWVyc0VsZW0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc3RyZWFtZXJzJyk7XG5jb25zdCBzdHJlYW1lcnNMaXN0RWxlbSA9IHN0cmVhbWVyc0VsZW0ucXVlcnlTZWxlY3RvcignLnN0cmVhbWVyc19fbGlzdCcpO1xuXG5sZXQgc3RyZWFtZXJEYXRhID0gW107XG5cbmluaXQoKTtcblxuZnVuY3Rpb24gaW5pdCgpIHtcblx0Ly8gUmVtb3ZlIG5vLWpzIGNsYXNzZXNcblx0c3RyZWFtZXJzRWxlbS5jbGFzc0xpc3QucmVtb3ZlKCdzdHJlYW1lcnMtLW5vLWpzJyk7XG5cblx0Ly8gR2V0LCBzb3J0LCBhbmQgcmVuZGVyIHN0cmVhbWVyIGRhdGEuXG5cdHJlZnJlc2hTdHJlYW1lckRhdGEoKVxuXHRcdC50aGVuKCgpID0+IHtcblx0XHRcdHNvcnRTdHJlYW1lcnMoKTtcblx0XHR9KVxuXHRcdC50aGVuKCgpID0+IHtcblx0XHRcdHJlbmRlclN0cmVhbWVycygpO1xuXHRcdH0pXG5cdFx0LmNhdGNoKGNvbnNvbGUubG9nKTtcbn1cblxuZnVuY3Rpb24gcmVmcmVzaFN0cmVhbWVyRGF0YSgpIHtcblx0Y29uc3QgcHJvbWlzZXMgPSBbXTtcblxuXHQvLyBPdmVyd3JpdGUgYW55IGV4aXN0aW5nIGRhdGEuXG5cdHN0cmVhbWVyRGF0YSA9IFtdO1xuXG5cdHN0cmVhbWVycy5mb3JFYWNoKG5hbWUgPT4ge1xuXHRcdGNvbnN0IGRhdGEgPSB7bmFtZX07XG5cblx0XHRwcm9taXNlcy5wdXNoKHR3aXRjaC5nZXRDaGFubmVsQnlOYW1lKG5hbWUpXG5cdFx0XHQudGhlbihjaGFubmVsID0+IHtcblx0XHRcdFx0ZGF0YS5jaGFubmVsID0gY2hhbm5lbDtcblxuXHRcdFx0XHRyZXR1cm4gdHdpdGNoLmdldFN0cmVhbUJ5SUQoY2hhbm5lbC5faWQpO1xuXHRcdFx0fSlcblx0XHRcdC50aGVuKHN0cmVhbURhdGEgPT4ge1xuXHRcdFx0XHRkYXRhLnN0cmVhbSA9IHN0cmVhbURhdGEuc3RyZWFtO1xuXG5cdFx0XHRcdHN0cmVhbWVyRGF0YS5wdXNoKGRhdGEpO1xuXHRcdFx0fSlcblx0XHRcdC5jYXRjaCgoKSA9PiB7XG5cdFx0XHRcdGRhdGEuY2hhbm5lbCA9IGRhdGEuY2hhbm5lbCB8fCBudWxsO1xuXHRcdFx0XHRkYXRhLnN0cmVhbSA9IGRhdGEuc3RyZWFtIHx8IG51bGw7XG5cblx0XHRcdFx0c3RyZWFtZXJEYXRhLnB1c2goZGF0YSk7XG5cdFx0XHR9KSk7XG5cdH0pO1xuXG5cdHJldHVybiBQcm9taXNlLmFsbChwcm9taXNlcyk7XG59XG5cbmZ1bmN0aW9uIHNvcnRTdHJlYW1lcnMoZiA9IGFscGhhYmV0aWNhbFNvcnQpIHtcblx0c3RyZWFtZXJEYXRhLnNvcnQoZik7XG59XG5cbmZ1bmN0aW9uIHJlbmRlclN0cmVhbWVycygpIHtcblx0c3RyZWFtZXJzTGlzdEVsZW0uaW5uZXJIVE1MID0gJyc7XG5cblx0c3RyZWFtZXJEYXRhLmZvckVhY2goc3RyZWFtZXIgPT4ge1xuXHRcdGxldCB0ZW1wbGF0ZTtcblxuXHRcdGlmIChzdHJlYW1lci5jaGFubmVsID09PSBudWxsKSB7XG5cdFx0XHR0ZW1wbGF0ZSA9IGBcblx0XHRcdFx0PGxpIGNsYXNzPVwic3RyZWFtZXJcIj5cblx0XHRcdFx0XHQ8aDIgY2xhc3M9XCJzdHJlYW1lcl9fbmFtZVwiPlxuXHRcdFx0XHRcdFx0JHtzdHJlYW1lci5uYW1lfVxuXHRcdFx0XHRcdDwvaDI+XG5cdFx0XHRcdFx0PHAgY2xhc3M9XCJzdHJlYW1lcl9fbm90LWZvdW5kXCI+Tm90IGZvdW5kLjwvcD5cblx0XHRcdFx0PC9saT5cblx0XHRcdGA7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGNvbnN0IHt1cmwsIGRpc3BsYXlfbmFtZTogZGlzcGxheU5hbWUsIGxvZ28sIGdhbWUsIHN0YXR1c30gPSBzdHJlYW1lci5jaGFubmVsO1xuXHRcdFx0Y29uc3Qgc3RyZWFtaW5nID0gc3RyZWFtZXIuc3RyZWFtICE9PSBudWxsO1xuXHRcdFx0Y29uc3QgcHJldmlldyA9IHN0cmVhbWluZyA/IHN0cmVhbWVyLnN0cmVhbS5wcmV2aWV3Lm1lZGl1bSA6IG51bGw7XG5cblx0XHRcdHRlbXBsYXRlID0gYFxuXHRcdFx0XHQ8bGkgY2xhc3M9XCJzdHJlYW1lclwiPlxuXHRcdFx0XHRcdDxoZWFkZXIgY2xhc3M9XCJzdHJlYW1lcl9faGVhZGVyXCI+XG5cdFx0XHRcdFx0XHQ8aDIgY2xhc3M9XCJzdHJlYW1lcl9fbmFtZVwiPlxuXHRcdFx0XHRcdFx0XHQ8YSBjbGFzcz1cInN0cmVhbWVyX191cmxcIiBocmVmPVwiJHt1cmx9XCI+XG5cdFx0XHRcdFx0XHRcdFx0JHtkaXNwbGF5TmFtZX1cblx0XHRcdFx0XHRcdFx0PC9hPlxuXHRcdFx0XHRcdFx0PC9oMj5cblx0XHRcdFx0XHRcdDxpbWcgY2xhc3M9XCJzdHJlYW1lcl9fbG9nb1wiIHNyYz1cIiR7bG9nb31cIj5cblx0XHRcdFx0XHQ8L2hlYWRlcj5cblx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwic3RyZWFtZXJfX3N0cmVhbVwiPlxuXHRcdFx0XHRcdFx0JHtzdHJlYW1pbmcgP1xuXHRcdFx0XHRcdFx0XHQnPGEgY2xhc3M9XCJzdHJlYW1lcl9fc3RyZWFtLWxpbmtcIiBocmVmPVwiJyArIHVybCArICdcIj48aW1nIGNsYXNzPVwic3RyZWFtZXJfX3N0cmVhbS1wcmV2aWV3XCIgc3JjPVwiJyArIHByZXZpZXcgKyAnXCI+PC9hPicgOlxuXHRcdFx0XHRcdFx0XHQnPHAgY2xhc3M9XCJzdHJlYW1lcl9fc3RyZWFtLW9mZmxpbmUtbm90aWNlXCI+T2ZmbGluZTwvcD4nfVxuXHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdDxwIGNsYXNzPVwic3RyZWFtZXJfX2dhbWVcIj4ke3N0cmVhbWluZyA/ICdQbGF5aW5nICcgKyBnYW1lIDogJyd9PC9wPlxuXHRcdFx0XHRcdDxwIGNsYXNzPVwic3RyZWFtZXJfX3N0YXR1c1wiPiR7c3RyZWFtaW5nID8gc3RhdHVzIDogJyd9PC9wPlxuXHRcdFx0XHQ8L2xpPlxuXHRcdFx0YDtcblx0XHR9XG5cblx0XHRzdHJlYW1lcnNMaXN0RWxlbS5pbm5lckhUTUwgKz0gdGVtcGxhdGU7XG5cdH0pO1xufVxuXG5mdW5jdGlvbiBhbHBoYWJldGljYWxTb3J0KGxlZnQsIHJpZ2h0KSB7XG5cdGxlZnQgPSBsZWZ0Lm5hbWUudG9Mb3dlckNhc2UoKTtcblx0cmlnaHQgPSByaWdodC5uYW1lLnRvTG93ZXJDYXNlKCk7XG5cblx0aWYgKGxlZnQgPT09IHJpZ2h0KSB7XG5cdFx0cmV0dXJuIDA7XG5cdH1cblxuXHRyZXR1cm4gbGVmdCA+IHJpZ2h0ID8gMSA6IC0xO1xufVxuIl0sIm5hbWVzIjpbImNvbnN0IiwibGV0Il0sIm1hcHBpbmdzIjoiOzs7QUFBQUEsSUFBTSxNQUFNLEdBQUcsOEJBQTZCLENBQUU7QUFDOUNBLElBQU0sT0FBTyxHQUFHO0NBQ2YsTUFBTSxFQUFFLGtDQUFrQztDQUMxQyxXQUFXLEVBQUUsZ0NBQWdDO0NBQzdDLENBQUM7O0FBRUYsU0FBUyxjQUFjLENBQUMsRUFBRSxFQUFFO0NBQzNCQSxJQUFNLFFBQVEsR0FBRyxNQUFTLGVBQVcsR0FBRSxFQUFFLENBQUc7Q0FDNUMsT0FBTyxLQUFLLENBQUMsUUFBUSxFQUFFLENBQUMsU0FBQSxPQUFPLENBQUMsQ0FBQztHQUMvQixJQUFJLENBQUMsVUFBQSxRQUFRLEVBQUM7R0FDZCxJQUFJLFFBQVEsQ0FBQyxFQUFFLEVBQUU7SUFDaEIsT0FBTyxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDdkI7O0dBRUQsTUFBTSxJQUFJLEtBQUssRUFBQyxxQ0FBb0MsSUFBRSxRQUFRLENBQUMsVUFBVSxDQUFB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
