/* eslint-disable no-eval */

// "Copy" eval to make it use global scope instead of local.
// (See: https://github.com/rollup/rollup/wiki/Troubleshooting#avoiding-eval)
const eval2 = eval;

const calculatorElem = document.querySelector('.calculator');
const calculatorDisplayElem = calculatorElem.querySelector('.calculator__display');
const calculatorDisplayTextElem = calculatorElem.querySelector('.calculator__display-text');
const calculatorButtonElems = calculatorElem.querySelectorAll('.calculator__button');

let showingError = false;

init();

function init() {
	// Remove no-js classes.
	calculatorElem.classList.remove('calculator--no-js');

	// Add calculator button event listeners.
	Array.from(calculatorButtonElems).forEach(elem => {
		elem.addEventListener('click', handleCalcButtonClick);
	});

	// Add keydown event listener.
	document.addEventListener('keydown', handleKeydown);
}

function evaluate(expression) {
	// Remove any whitespace.
	expression = expression.replace(/\s/g, '');

	// Invalid expression characters.
	// (Anything not operators, numbers, decimals, or parens.)
	const re = /[^+|\-|*|/|\d|.|(|)]/;

	if (re.test(expression)) {
		throw new Error(`Invalid expression ${expression}`);
	}

	return eval2(expression);
}

function handleCalcButtonClick(e) {
	const char = e.target.innerHTML;

	switch (char) {
		case '&lt;':
			backspace();
			break;
		case 'c':
			clear();
			break;
		case '=':
			equals();
			break;
		default:
			// Add the character to the expression.
			input(char);
	}
}

function handleKeydown(e) {
	const key = e.key;

	if (key === 'Backspace') {
		return backspace();
	}

	if (key === 'Delete' || key === 'c') {
		return clear();
	}

	if (key === 'Enter') {
		return equals();
	}

	const validInputs = '()*/+-.0123456789'.split('');

	if (validInputs.indexOf(key) !== -1) {
		return input(key);
	}
}

function backspace() {
	if (showingError) {
		return clear();
	}

	let text = calculatorDisplayTextElem.innerHTML;

	// Trim the last character.
	text = text.slice(0, text.length - 1);

	calculatorDisplayTextElem.innerHTML = text;
}

function clear() {
	calculatorDisplayTextElem.innerHTML = '';
	showingError = false;
}

function equals() {
	if (showingError) {
		return clear();
	}

	try {
		const result = evaluate(calculatorDisplayTextElem.innerHTML);
		calculatorDisplayTextElem.innerHTML = (result === undefined) ? '' : result;
	} catch (err) {
		console.log(err);
		calculatorDisplayTextElem.innerHTML = 'Error';
		showingError = true;
	}
}

function input(char) {
	if (showingError) {
		clear();
	}

	calculatorDisplayTextElem.innerHTML += char;

	// Make sure we're scrolled far enough to the right.
	calculatorDisplayElem.scrollLeft = 9999;
}
