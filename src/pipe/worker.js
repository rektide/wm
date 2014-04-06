var events= require("events"),
  util= require("util"),
  CrossDocumentPipe= require("./cross-document"),
  arrayReader= require("../wamp/array-reader"),
  arrayWriter= require("../wamp/array-writer")

module.exports= WorkerPipe

function WorkerPipe(opts,port){
	if(!port && opts){
		if(opts.addEventListener){
			port= opts
		}else if(opts.port){
			port= opts.port
		}
	}
	if(!port)
		throw "expected port"
	if(!(this instanceof WorkerPipe))
		return new WorkerPipe(opts,port)

	WorkerPipe.super_.call(this,opts,port)
}
util.inherits(WorkerPipe, CrossDocumentPipe)


function emit(msgType,msg){
	var arrMsg= arrayWriter(msg? msg: msgType),
	  stringMsg= JSON.stringify(arrMsg)
	this.port.postMessage(stringMsg)
}
WorkerPipe.prototype.emit= emit

var e_emit= events.EventEmitter.prototype.emit

function messageListener(e){
	var data= JSON.parse(e.data)
	if(Arrays.isArray(data)){
		var msg= arrayReader(data)
		e_emit.call(this.target, msg.messageType, msg)
	}
}
