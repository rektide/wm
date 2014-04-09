var events= require("events"),
  util= require("util"),
  CrossDocumentPipe= require("./cross-document"),
  arrayReader= require("../wamp/array-reader"),
  arrayWriter= require("../wamp/array-writer")

module.exports= WorkerPipe

function WorkerPipe(port, opts){
	if(!(this instanceof WorkerPipe))
		return new WorkerPipe(port, opts)
	if(port && opts){
		opts.port= port
	}else if(port && !opts){
		opts= {port:port}
	}else if(!opts.port){
		throw "expected port"
	}

	WorkerPipe.super_.call(this, opts, port)
	Base.go(this, opts, WorkerPipe)
}
util.inherits(WorkerPipe, CrossDocumentPipe)

function readMessage(e){
	var parseMsg= JSON.parse(e.data)
	return arrayReader(parseMsg)
}
WorkerPipe.prototype.readMessage= readMessage

function writeMsg(msgType, msg){
	var arrayMsg= arrayWriter(msg)
	return JSON.stringify(arrayMsg)
}
WorkerPipe.prototype.writeMessage= writeMessage
