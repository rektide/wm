var helper= require("./helper"),
  biset= helper.biset

var xhrState= module.exports.xhrState= {};
["UNSENT","OPENED","HEADERS_RECEIVED","LOADING","DONE"].forEach(biset,xhrState)

if(typeof document !== "undefined" && document.location){
	module.exports.origin= function(){return document.location.origin}
}else if(typeof self !== "undefined" && self.location){
	module.exports.origin= function(){return self.location.origin}
}else{
	module.exports.origin= function(){return "p:///"}
}

["ArrayBuffer","Blob","Document","FormData","setInterval","XMLHttpRequest"].forEach(function(slot){
	try{
		module.exports[slot]= eval(slot)
	}catch(e){
		module.exports[slot]= Function()
	}
})
