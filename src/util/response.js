var helper= require("./helper")

var accessor= helper.accessor

function mixinResponse(o,opts){
	var acc= ".wampResponse", prefix= ""
	if(opts instanceof String)
		acc= opts
	else if(opts){
 		if(opts.acc)
			acc= opts.acc
		if(opts.prefix)
			prefix= opts.prefix
	}

	var headerName, response= {
	  get: Function("var val= this"+acc+"; if(val) val= val[2]; if(val) val= val[2]; if(val) return val; return (!this.responseType || this.responseType == 'text')? '': null;"),
	  enumerable: true
	}
	if(prefix){
		Object.defineProperty(o,prefix+"MsgType",accessor(acc+"[0]"))
		Object.defineProperty(o,prefix+"Pipe",accessor(acc+"[1]"))
		Object.defineProperty(o,prefix+"Status",accessor(acc+"[2][0]"))
		Object.defineProperty(o,prefix+"Headers",accessor(acc+"[2][1]"))
		Object.defineProperty(o,prefix+"Response",response)
	}else{
		Object.defineProperty(o,"msgType",accessor(acc+"[0]"))
		Object.defineProperty(o,"pipe",accessor(acc+"[1]"))
		Object.defineProperty(o,"status",accessor(acc+"[2][0]"))
		Object.defineProperty(o,"headers",accessor(acc+"[2][1]"))
		Object.defineProperty(o,"response",response)
	}
}
module.exports.mixinResponse= mixinResponse

function RawResponse(){}
mixinResponse(RawResponse.prototype)
module.exports.proto.RawResponse= RawResponse

function WrappedResponse(){}
mixinResponse(WrappedResponse.prototype,".wampResponse")
module.exports.proto.WrappedResponse= WrappedResponse

function ResponseResponse(){}
mixinResponse(ResponseResponse.prototype,{acc:".response",prefix:".wampResponse"})
module.exports.proto.ResponseResponse= ResponseResponse
