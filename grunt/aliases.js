module.exports= {
	"dist": ["browserify:wm"],
	"test-compile": ["browserify:p-1", "browserify:host-meta-1", "browserify:mirror-1"],
	default: ["dist", "test-compile"]
}
