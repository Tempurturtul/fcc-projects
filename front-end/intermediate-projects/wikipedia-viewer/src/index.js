import wikipedia from './wikipedia';

const wikiElem = document.querySelector('.wikipedia-viewer');
const wikiFormElem = wikiElem.querySelector('.wikipedia-form');
const wikiFormSearchElem = wikiElem.querySelector('.wikipedia-form__search');
const wikiFormRandomElem = wikiElem.querySelector('.wikipedia-form__random');
const wikiArticlesElem = wikiElem.querySelector('.wikipedia-articles');

let loadedArticles;

init();

function init() {
	// Remove no-js classes.
	wikiElem.classList.remove('wikipedia-viewer--no-js');

	// Add event listeners.
	wikiFormElem.addEventListener('submit', handleSearchFormSubmit);
	wikiFormRandomElem.addEventListener('click', handleRandomButtonClick);
}

function loadArticles(query, opts = {}) {
	if (!query && !opts.random) {
		throw new Error('Must provide a query string or set opts.random to true.');
	}

	const randomArticle = !query && opts.random;

	if (randomArticle) {
		wikipedia.getRandomArticle()
			.then(load)
			.catch(abort);
	} else {
		wikipedia.getArticles(query)
			.then(load)
			.catch(abort);
	}

	function load(data) {
		const pages = data.query.pages;
		const articles = Object.keys(pages).map(key => pages[key]);

		loadedArticles = articles;

		renderArticles();
	}

	function abort(err) {
		console.log(err);
		loadedArticles = null;
		unrenderArticles();
	}
}

function loadRandomArticle() {
	loadArticles(null, {random: true});
}

function renderArticles() {
	const htmlStr = loadedArticles
		.map(article => {
			const {title, fullurl, extract} = article;
			return `
				<article class="wikipedia-article">
					<h1 class="wikipedia-article__title">
						<a href="${fullurl}">${title}</a>
					</h1>
					<blockquote class="wikipedia-article__extract" cite="${fullurl}">
						${extract || ''}
					</blockquote>
				</article>
			`;
		})
		.join('\n');

	wikiArticlesElem.innerHTML = htmlStr;
}

function unrenderArticles() {
	loadedArticles = null;
	wikiArticlesElem.innerHTML = '';
}

function handleSearchFormSubmit(e) {
	e.preventDefault();

	const query = wikiFormSearchElem.value;

	loadArticles(query);
}

function handleRandomButtonClick() {
	loadRandomArticle();
}
