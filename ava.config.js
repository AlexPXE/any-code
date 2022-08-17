export default {
	files: [
		"tests/**/*.spec.js",
	],	
	concurrency: 4, //max number of test files running at the same time (default: CPU cores)
	failFast: false, // stop running further tests once a test fails
	failWithoutAssertions: false, //if false, does not fail a test if it doesn't run assertions
	verbose: true,	//if true, enables verbose output (though there currently non-verbose output is not supported)
	timeout: '2m', //timeout for each test file in milliseconds
}