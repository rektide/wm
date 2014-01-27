var uuid= require("uuid"),
  primitives= require("./primitives"),
  PromiseRequest= primitives.PromiseRequest,
  PromiseResponse= primitives.PromiseResponse,
  wamp= primitives.WAMP

module.exports= exports= p
module.exports.p= p
module.exports.PromiseRequest= PromiseRequest
module.exports.PromiseResponse= PromiseResponse

/**
* p extends a port with request/response semantics
*/
function p(opts,port){
	if(!(this instanceof p))
		return new p.apply({},arguments)
	if(opts && port === undefined){
		port= opts
		opts= {}
	}

	// register outstanding
	this.__outstanding= opts.outstanding||new WeakMap()
	this.__port= port

	port.addEventListener("message",function(e){
		if(!e.data || !(e.data instanceof Array) || e.data[0] != "RE")
			return
		var res= new exports.PromiseRespones(e.data),
		  h= res.headers,
		  pipeId= h.p,
		  defer= this.__outstanding.get(pipeId)
		if(!pipeId) // !
			return
		if(defer){
			delete this.__outstanding[pipeId]
			defer.resolve(res)
		}
	}.bind(this))
	return this
}

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
	  t= opts.transfers,
	  a= wamp.CALL
	if(a == "NOTIFY"){
		a= wamp.EVENT
		m= null
	}else if(a == "M-SEARCH"){
		a= wamp.SUBSCRIBE
		m= null
	}

	if(m){
		port.postMessage(d!==undefined?[wamp.CALL,u,m,h,d]:[wamp.CALL,u,m,h],t)
	}else{
		port.postMessage(d!==undefined?[wamp.CALL,u,h,d]:[wamp.CALL,u,h],t)
	}
	return defer
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
