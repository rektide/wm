var uuid= require("uuid")

/**
* p extends a port with request/response semantics
*/
function p(opts,port){
	if(!(this instanceof p))
		return new p.apply({},arguments)

	// register outstanding
	this.__outstanding= opts.outstanding||new WeakMap()

	port.addEventListener("message",function(e){
		if(!e.data || !(e.data instanceof Array) || e.data[0] != "RE")
			return
		var h= e.data[1]
		if(!h)
			return
		var pipeId= h.p,
		  defer= this.__outstanding.get(pipeId)
		if(!req)
			return
		this.__outstanding.delete(pipeId)

		defer.resolve(new PromiseResponse(e))
	}.bind(this))
	return this
}
module.exports= p

/**
* request fires an outgoing request
* @param url required opts parameter, specifying destination
* @param method opts parameter with HTTP verb
* @param headers opts parameter with HTTP headers to send
* @param data opts param with data to send
* @param transfers opts param with transfers array to send
* @return a promise for the response
*/
p.prototype.request= function(opts){
	if(!opts)
		throw "no request specified"
	if(opts instanceof String){
		opts= {url:opts}
	}

	var u= opts.url
	if(!opts.url){
		throw "no url specified"
	}

	// pick and register an id
	var h= opts.headers||{},
	 id= h["p-create"]= getUuid(),
	 defer= this.__outstanding[id]= Q().defer()

	// send
	var m= opts.method||"GET",
	  d= opts.data,
	  t= opts.transfers
	port.postMessage(d!===undefined?[m,u,h,d]:[m,u,h],t)
	return defer
}

/**
* Semi- XMLHttpRequest Respones compliant implementation for request
*/
function PromiseResponse(e){
	this.status= e[1]
	this.headers= e[2]
	this.response= e[3]
	this.responseType= "document"
}
PromiseResponse.prototype.getResponseHeader(h){
	return this.headers[h.toLowerCase()]
}
PromiseResponse.prototype.getAllResponseHeaders(){
	return this.headers
}
PromiseResponse.prototype.overrideMimeType(mimeType){
	throw "not supported"
}

function Q(){
	var q= require("q")
	Q= id.bind(q)
	return q
}

function getLocation(){
	if(typeof window != "undefined")
		return window.location
	if(typeof global != "global")
		return process.argv.join(" ")
}

function getUuid(){
	var loc= getLocation()
	return loc? uuid.v5(loc): uuid.v4()
}

function id(){
	return this
}
