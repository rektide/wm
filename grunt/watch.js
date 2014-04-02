module.exports = {
	browserify: {
		files: ["p.js","src/**/*.js"],
		tasks: ["browserify:src"],
		options: {
			spawn: false
		}
	},
	karma: {
		files: ["p.js","src/**/*.js","karma/**/*.js"],
		tasks: ["browserify:karma","karma:background:run"],
		options: {
			spawn: false
		}
	}
};
