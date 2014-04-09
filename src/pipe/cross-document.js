var events= require("events"),
  util= require("util"),
  Base= require("../base"),
  arrayReader= require("../wamp/array-reader"),
  arrayWriter= require("../wamp/array-writer")

var _emit= events.EventEmitter.prototype.emit

module.exports= CrossDocumentPipe

/**
  CrossDocumentPipe exposes incoming messages as events, and sends outgoing messages via emit.
*/
function CrossDocumentPipe(port, opts){
	if(!(this instanceof CrossDocumentPipe))
		return new CrossDocumentPipe(port, opts)
	if(port && opts){
		opts.port= port
	}else if(port && !opts){
		opts= {port:port}
	}else if(!opts.port){
		throw "expected port"
	}

	CrossDocumentPipe.super_.call(this, opts)
	Base.go(this, opts, CrossDocumentPipe)
}
util.inherits(CrossDocumentPipe, Base)

var baseProto= CrossDocumentPipe.super_.prototype

function prefs(opts){
	baseProto.prefs.call(this, opts)

	var self= this
	function messageListener(e){
		if(Array.isArray(e.data)){
			var ingressMsg= self.readMessage(e)
			_emit.call(self.target, ingressMsg.messageType, ingressMsg)
		}
	}

	this.port= opts.port
	this.details= opts.details|| {}
	this.messageListener= messageListener
	this.target= opts.target|| this
	if(opts.origin !== undefined){
		this.origin= opts.origin
	}else if(this.port.constructor && this.port.constructor.name == "MessagePort"){
		this.origin= null
	}else{
		this.origin= "*"
	}
}
CrossDocumentPipe.prototype.prefs= prefs

function readMessage(e){
	return arrayReader(e.data)
}
CrossDocumentPipe.prototype.readMessage= readMessage

/**
  Ingressing messages are sent to listeners
*/
function open(){
	this.port.addEventListener("message", this.messageListener, false)
	this.port.start()
}
CrossDocumentPipe.prototype.open= open

/**
  Egressing messages are send to port
  Accepts node style invocation, or raw message with no event specified
*/
function emit(msgType, msg){
	if(msgType && !msg){
		msg= msgType
		msgType= null
	}
	var egressMsg= this.writeMessage(msgType, msg)
	this.port.postMessage(egressMsg, this.origin)
}
CrossDocumentPipe.prototype.emit= emit

function writeMessage(msgType, msg){
	return arrayWriter(msg)
}
CrossDocumentPipe.prototype.writeMessage= writeMessage
