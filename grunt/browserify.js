var _= require("lodash")

var workerify= {
	options: {
		transform: ["workerify"] 
	}
}

var conf= {
	wm: {
		src: ["src/**/*.js","p.js"],
		children: [],
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
}
for(var i in conf){
	conf.wm.children.push(i)
}

var karmas= conf.karmas= _.extend({
	src: [],
	children: ["karmas"],
	dest: "dist/karmas.js"
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
	karmas.children.push(testName)
	conf[testName]= karma
})

module.exports= conf
