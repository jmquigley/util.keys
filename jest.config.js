module.exports = {
	collectCoverage: true,
	coveragePathIgnorePatterns: [
		"<rootDir>/__tests__/helpers",
		"<rootDir>/node_modules"
	],
	moduleFileExtensions: ["js", "jsx", "ts", "tsx", "json"],
	notify: false,
	testPathIgnorePatterns: [
		"<rootDir>/__tests__/helpers",
		"<rootDir>/node_modules"
	],
	verbose: true
};
