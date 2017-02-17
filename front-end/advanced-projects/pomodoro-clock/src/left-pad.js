function leftPad(string, spaces, character = ' ') {
	let stringCopy = string;

	if (typeof stringCopy !== 'string') {
		stringCopy = String(stringCopy);
	}

	while (stringCopy.length < spaces) {
		stringCopy = character + stringCopy;
	}

	return stringCopy;
}

export default leftPad;
