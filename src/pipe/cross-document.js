var events= require("events"),
  util= require("util"),
  Base= require("../base"),
  arrayReader= require("../wamp/array-reader"),
  arrayWriter= require("../wamp/array-writer")

var _emit= events.EventEmitter.prototype.emit

module.exports= CrossDocumentPipe

/**
  CrossDocumentPipe exposes a bidirectional port as an EventEmitter, which:
    + will emit any of messages that come in from the port
    + custom-implements the 'emit' method, putting such messages into the port (rather than firing normal EventListeners)

  Users of CrossDocumentPipe get a Procuder interface for themselves in Emit, which ingresses messages into the port
  and an Application/Consumer interface as a listener, to egressing events from the port

  @param port (required) port to wire up as a CrossDocumentPipe
  @param details (named-option) default Detail information to send on the port
  @param messageListener (named-option) optional listener
  @param target (named-option) where to emit messages into
  @param noStart (named-option) do not start the port on open
  @param origin (named-option) origin name to postMessage
*/
function CrossDocumentPipe(port, opts){
	if(!(this instanceof CrossDocumentPipe || this instanceof events))
		return new CrossDocumentPipe(port, opts)
	if(port && opts){
		opts.port= port
	}else if(port && !opts){
		opts= {port:port}
	}else if(!opts.port){
		throw "expected port"
	}

	var self= this
	self= CrossDocumentPipe.super_.call(self, opts)
	Base.go(self, opts, CrossDocumentPipe)
	return self
}
util.inherits(CrossDocumentPipe, Base)

var baseProto= CrossDocumentPipe.super_.prototype

function prefs(opts){
	baseProto.prefs.call(this, opts)

	this.port= opts.port
	this.details= opts.details|| {}
	this.target= opts.target|| this
	if(opts.messageListener){
		this.messageListener= opts.messageListener
	}else{
		var self= this
		function messageListener(e){
			if(Array.isArray(e.data)){
				var ingressMsg= self.readMessage(e)
				_emit.call(self.target, ingressMsg.messageType, ingressMsg)
			}

		}
		this.messageListener= messageListener
	}
	if(opts.noStart){
		this.noStart= true
	}
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
	baseProto.open.call(this)
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
