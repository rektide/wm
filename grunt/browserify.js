var _= require("lodash")

var conf = {
	wm: {
		src: ['src/*.js','src/**/*.js'],
		dest: 'dist/wm.js'
	},
	browser: {
		src: ['src/browser/*.js'],
		dest: 'dist/wm-browser.js'
	},
	node: {
		src: ['src/node/*.js'],
		dest: 'dist/wm-node.js'
	}
};

["wm-1"].forEach(function(testName){
	var test= {}
	test[testName]= {
	  src: ["example/"+testName+".js"],
	  dest: "example/dist/"+testName+".js"}
	_.extend(conf, test)
})

module.exports= conf
