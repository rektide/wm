function prefixBrowserify(k){return "browserify:"+k}
var browsers= require("./browserify"),
  dists= browsers.wm.children.map(prefixBrowserify),
  karmas= require("./browserify").karma.children.map(prefixBrowserify)
karmas.push("karma:karma")

module.exports= {
	dist: ["browserify:src"],
	"browserify:src": dists,
	test: ["test-karma"],
	"test-karma": karmas,
	continuous: ["karma:background:start", "watch"],
	default: ["dist", "test"]
}
