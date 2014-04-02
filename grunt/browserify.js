var _= require("lodash")

var workerify= {
	options: {
		transform: ["workerify"] 
	}
}

var conf= {
	wm: {
		src: ["src/**/*.js","p.js"],
		dest: "dist/wm.js"
	},
	browser: {
		src: ["src/browser/*.js","p.js"],
		dest: "dist/wm-browser.js",
	},
	node: {
		src: ["src/node/*.js","p.js"],
		dest: "dist/wm-node.js"
	},
};

var karmas= conf.karma= _.extend({
	src: [],
	dest: "dist/karma.js"
}, workerify);
["wm-1"].forEach(function(testName){
	var karma= _.extend({
	  src: ["karma/"+testName+".js"],
	  dest: "dist/karma/"+testName+".js",
	  options: {
	    transform: ["workerify"]
	  }
	}, workerify)
	karmas.src.push(karma.src)
	conf[testName]= karma
})

module.exports= conf
