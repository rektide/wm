var streams= require("streams"),
  util= require("util"),
  primitives= require("./primitives"),
  wamp= primitives.wamp,
  methods= primitives.methods,
  accessor= primitives.util.accessor,
  empty= primitives.util.empty,
  nop= primitives.util.nop

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
	var haveOpts== !!opts
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
