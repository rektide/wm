var events= require("events"),
  util= require("util"),
  primitive= require("./primitives")

module.exports.Req= EventedRequest
module.exports.Res= EventedResponse

function EventedRequest(e){
	primitive.Req.apply(this,e)
}
util.inherits(EventedRequest,events.EventEmitter)

function EventedResponse(req){
	primitive.Res.apply(this,req)
}
util.inherits(EventedResponse,events.EventEmitter)
