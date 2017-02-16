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
	const re = /[^\+|\-|\*|\/|\d|\.|\(|\)]/;

	if (re.test(expression)) {
		throw new Error(`Invalid expression ${expression}`);
	}

	return eval(expression);
}

function handleCalcButtonClick(e) {
	const char = e.target.innerHTML;

	switch(char) {
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
	switch (e.key) {
		case 'Backspace':
			backspace();
			break;
		case 'Delete':
		case 'c':
			clear();
			break;
		case 'Enter':
			equals();
			break;
		case '(':
		case ')':
		case '*':
		case '/':
		case '+':
		case '-':
		case '.':
		case '0':
		case '1':
		case '2':
		case '3':
		case '4':
		case '5':
		case '6':
		case '7':
		case '8':
		case '9':
			input(e.key);
			break;
		default:
			// no-op
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
		calculatorDisplayTextElem.innerHTML = result;
	} catch(e) {
		console.log(e);
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
