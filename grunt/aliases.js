module.exports= {
	dist: ["browserify:src"],
	"browserify:src": ["browserify:wm", "browserify:browser", "browserify:node"],
	test: ["test-karma"],
	"test-karma": ["browserify:karma", "karma:karma"],
	continuous: ["karma:background:start", "watch"],
	default: ["dist", "test"]
}
