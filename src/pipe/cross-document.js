var events= require("events"),
  util= require("util"),
  arrayReader= require("../wamp/array-reader"),
  arrayWriter= require("../wamp/array-writer")

module.exports= CrossDocumentPipe

function CrossDocumentPipe(opts,port){
	if(!port && opts){
		if(opts.addEventListener){
			port= opts
		}else if(opts.port){
			port= opts.port
		}
	}
	if(!port)
		throw "expected port"
	if(!(this instanceof CrossDocumentPipe))
		return new CrossDocumentPipe(opts,port)
	CrossDocumentPipe.super_.call(this)

	this.origin= opts && opts.origin || "*"
	this.target= opts && opts.target || this
	this.messageListener= opts && opts.messageListener.bind(this) || this.messageListener.bind(this)
	this.port= port

	this.open()
}
util.inherits(CrossDocumentPipe, events.EventEmitter)

function open(){
	this.port.addEventListener("message", this.messageListener, false)
}
CrossDocumentPipe.prototype.open= open

function emit(msgType,msg){
	var arrMsg= arrayWriter(msg? msg: msgType)
	this.port.postMessage(arrMsg, this.origin)
}
CrossDocumentPipe.prototype.emit= emit

var e_emit= events.EventEmitter.prototype.emit

function messageListener(e){
	if(Arrays.isArray(e.data)){
		var msg= arrayReader(e.data)
		e_emit.call(this.target, msg.messageType, msg)
	}
}
CrossDocumentPipe.prototype.messageListener= messageListener
