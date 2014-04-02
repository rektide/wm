function prefixer(prefix){return function(o){return o.map(function(k){return prefix+k})}}
var prefixBrowserify= prefixer("browserify:"),
  prefixKarma= prefixer("karma:")

var browsers= require("./browserify"),
  browserifyDists= prefixBrowserify(browsers.wm.children)
  browserifyTests= prefixBrowserify(browsers.karmas.children)

var karmaTest= prefixKarma(browsers.karmas.children)

module.exports= {
	dist: ["browserify:src"],
	"browserify:src": browserifyDists,
	"browserify:karma": browserifyTests,
	test: ["test-karma"],
	"test-karma": browserifyTests.concat("karma:karma"),
	continuous: ["karma:background:start", "watch"],
	"continuous-test": ["karma:background:start", "watch:karma"],
	default: ["dist", "test"]
}

console.log("HAVE",module.exports)
