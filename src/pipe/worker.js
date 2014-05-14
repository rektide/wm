var events= require("events"),
  util= require("util"),
  CrossDocumentPipe= require("./cross-document"),
  arrayReader= require("../wamp/array-reader"),
  arrayWriter= require("../wamp/array-writer")

module.exports= WorkerPipe

/**
  Worker extends {@link CrossDocumentPipe} with a WebWorker focused implementation,
  which performs the extra, necessary steps of serializing-deserializing the event
  payloads into and out of JSON.
*/
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

	var self= this
	self= WorkerPipe.super_.call(self, opts, port)
	Base.go(self, opts, WorkerPipe)
	return this
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
