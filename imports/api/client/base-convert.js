function baseConvert(number, fromBase, toBase) {
	// convert a number from one base to another
	// e.g. convert a number from base 4 to base 16:
	// baseConvert(number, 4, 16);
	if (fromBase < 2 || fromBase > 36) return 'initial base must be between 2 and 36';

	if (toBase < 2 || toBase > 36) return 'new base must be between 2 and 36';

	return parseInt(number + '', fromBase).toString(toBase);
}

export default baseConvert;
