var streams= require("stream"),
  util= require("util"),
  helper= require("../util/helper"),
  http= require("../util/http"),
  wamp= require("../util/wamp").wamp,
  methods= http.methods,
  accessor= helper.accessor,
  empty= helper.empty,
  nop= helper.nop

module.exports= ClientRequest
module.exports.defaultRequest= [wamp.CALL,null,null,null,null] 

var clientRequestProps= (function(names){
	var res= []
	for(var i= 0; i< names.length; ++names){
		res.push({name:names[i],a:accessor("["+i+"]")})
	}
	return res
})(["msgType","pipe","url","method","headers","request"])

function ClientRequest(e,opts){
	var haveOpts= !!opts
	if(e instanceof Object){
		opts= e
		e= null
	}else if(!opts){
		opts= {}
	}
	if(!e){
		if(opts.assertPacket){
			throw "Expected packet, was empty"
		}
		e= module.exports.defaultRequest.splice(0)
	}
	if(opts.verify)
		verify.call(e)
	if(!e[4])
		e[4]= {p:e[1]}
	else
		e[4].p= e[1]

	// defineProperty-s
	for(var i= 0; i< clientRequestProps.length; ++i){
		var prop= clientRequestProps[i]
		Object.defineProperty(e,prop.name,prop.a)
	}

	// initialize
	e.__proto__= ClientRequest
	e.length = Array.prototype.length
	Readable.call(e,opts)

	e.httpVersion= '-1.1'
	e.httpVersionMajor= -1
	e.httpVersionMinor= 1
	e.setTimeout= nop
	e.socket= e

	return e
}
util.inherits(ClientRequest,streams.ReadableStreams)

function _read(){
	this.push(this.request)
	this.trailers= {}
	this.emit("close")
	this.end()
	this._read= nop
}
ClientRequest.prototype._read= _read

function verify(){
	if(this[0]!= wamp.CALL)
		(errs||(errs= [])).push("CALL (was "+wamp[e.msgType]+")")
	if(!this[1])
		(errs||(errs= [])).push("pipe")
	if(!this[2])
		(errs||(errs= [])).push("url")
	if(!this[3])
		(errs||(errs= [])).push("method")
	if(errs){
		throw "Expected "+errs.join(",")
	}
}
ClientRequest.prototype.verify= verify

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

	// target url
	if(!opts.url){
		throw "no url specified"
	}
	var url= opts.url

	// pick and register an id
	var headers= opts.headers||{},
	 id= headers["p-create"]= getUuid(),
	 defer= this.__outstanding[id]= Q().defer()

	// send
	var method= wamp[opts.method]||wamp.GET,
	  data= opts.data,
	  transfer= opts.transfers,
	  msgType= wamp.CALL,
	  pipe= getUuid()
	if(method == "NOTIFY"){
		msgType= wamp.EVENT
		method= null
	}else if(method == "M-SEARCH"){
		msgType= wamp.PUBLISH
		method= null
	}

	var packet= data!==undefined? [method, headers, data]:  [method, headers],
	  msg= [msgType, pipe, url, packet]
	this.__port.postMessage(msg,transfer)
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
	//var loc= getLocation()
	//return loc? uuid.v5(loc): uuid.v4()
	return uuid.v4()
}

function id(){
	return this
}
