var primitives= require("../primitives"),
  uuid= primitives.uuid,
  nop= primitives.nop,
  err= primitives.err,
  wamp= primitives.WAMP,
  Request= primitives.Request,
  Response= primitives.Response

module.exports= server
module.exports.makeServerHandler= makeServerHandler
module.exports.unknownHandler= null

function makeHandler(opts){
	opts= opts||{}
	var handler = function serverHandler(e){
		var res= Request(e.data)
		if(!res || !(res instanceof Array) || !wamp.isClientMsg(data[0])){
			(handler.unknownHandler||module.exports.unknownHandler||nop)(err.NoDataError,e)
		}
		pipeId= res.pipeId()
		if(!res.outstandings[pipeId]){
			(handler.unknownHandler||module.exports.unknownHandler||nop)(e)
		}
	}
	serverHandler.outstanding= opts.outstanding||new WeakMap()
	serverHandler.unknownHandler= opts.unknownHandler||null
	serverHandler.prefixes= opts.prefixes||{}
	serverHandler.idGenerator= [uuid.v4(),null]
	return serverHandler
}

function server(opts,port){
	var handler= makeHandler(opts)
	port.addEventListener("message",handler)
	return handler
}
