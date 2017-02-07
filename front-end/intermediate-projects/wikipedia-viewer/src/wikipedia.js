// See: https://www.mediawiki.org/wiki/API:Main_page

const endpoint = 'https://en.wikipedia.org/w/api.php';
const apiUserAgent = 'TempurturtulFCCWikiViewer/1.0';

function getArticles(query, opts = {limit: 10}) {
	const params = [
		// Main data.
		'action=query',
		'format=json',
		'origin=*',
		// Action data.
		'prop=info|extracts',
		'generator=search',
		// Format data.
		'formatversion=1',
		// Prop Data.
		'inprop=url',
		'exchars=250',
		`exlimit=${opts.limit}`,
		'exintro=1',
		`gsrsearch=${query}`,
		`gsrlimit=${opts.limit}`
	];
	const url = `${endpoint}?${params.join('&')}`;

	const headers = {
		'Api-User-Agent': apiUserAgent
	};

	return fetch(url, {headers})
		.then(response => {
			if (response.ok) {
				return response.json();
			}

			throw new Error(`Could not fetch wikipedia articles: ${response.statusText}`);
		});
}

function getRandomArticle() {
	const params = [
		// Main data.
		'action=query',
		'format=json',
		'origin=*',
		// Action data.
		'prop=info|extracts',
		'generator=random',
		// Format data.
		'formatversion=1',
		// Prop Data.
		'inprop=url',
		'exchars=200',
		'grnnamespace=0',
		'grnfilterredir=nonredirects',
		'grnlimit=1'
	];
	const url = `${endpoint}?${params.join('&')}`;

	const headers = {
		'Api-User-Agent': apiUserAgent
	};

	return fetch(url, {headers})
		.then(response => {
			if (response.ok) {
				return response.json();
			}

			throw new Error(`Could not fetch random wikipedia article: ${response.statusText}`);
		});
}

export default {
	getArticles,
	getRandomArticle
};
