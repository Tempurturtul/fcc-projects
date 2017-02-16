function evaluate(expression) {
	// Remove whitespace and commas.
	expression = expression
		.split('')
		.filter(char => (char !== ' ') && (char !== ','))
		.join('');
	
	// Invalid expression characters.
	// (Anything not operators, parens, numbers, or decimals.)
	const re = /[^\+|-|\*|\/|\d|\.|\(|\)]/;

	if (re.test(expression)) {
		throw new Error('Invalid expression.');
	}

	return eval(expression);
}

export default evaluate;
