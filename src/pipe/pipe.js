var events= require("events"),
  util= require("util"),
  arrayReader= require("../wamp/array-reader"),
  arrayWriter= require("../wamp/array-writer")

var _emit= events.EventEmitter.prototype.emit

module.exports= Pipe
module.exports.Pipe= Pipe

/**
  A pipe exposes incoming messages as events, and sends outgoing messages via emit.
*/
function Pipe(port,opts){
	if(!(this instanceof Pipe))
		return new Pipe(port,opts)

	if(port && opts){
		opts.port= port
	}else if(port && !opts){
		opts= {port:port}
	}else if(!port){
		throw "expected port"
	}
	
	Pipe.super._call(this)

	Base.go(this, opts, Pipe)
}
util.inherits(Pipe, Base)

var baseProto= Pipe.super_.prototype

function prefs(opts){
	baseProto.prefs.call(this, opts)


	var self= this
	function messageListener(e){
		if(Arrays.isArray(e.data)){
			var msg= arrayReader(e.data)
			_emit.call(self.target, msg.messageType, msg)
		}
	}

	this.port= opts.port
	this.origin= opts.origin||"*"
	this.messageListener= messageListener
}
Pipe.prototype.prefs= prefs

function open(){
	baseProto.open.call(this)
	this.port.addEventListener("message", this.messageListener, false)
}
Pipe.prototype.open= open

/**
  Emit must transfer a message down the pipe
*/
function emit(msgType, msg){
	var arrMsg= arrayWriter(msg? msg: msgType)
	this.port.postMessage(arrMsg, this.origin)
}
Pipe.prototype.emit= emit
