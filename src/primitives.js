var uuid= require("uuid")

var methods= modules.exports.methods= {}
["GET","POST","PUT","DELETE","PATCH"].forEach(biset,module.exports.methods)

var xhrState= modules.exports.xhrState= {}
["UNSENT","OPENED","HEADERS_RECEIVED","LOADING","DONE"].forEach(biset,xhrState)

//// WAMP

var wamp= modules.export.wamp= {}
["WELCOME", "PREFIX", "CALL", "CALLRESULT", "CALLERROR", "SUBSCRIBE", "UNSUBSCRIBE", "PUBLISH", "EVENT"].forEach(biset,module.exports.wamp)
wamp.SERVER= [wamp.WELCOME, wamp.CALLRESULT, wamp.CALLERROR, wamp.EVENT]
wamp.CLIENT= [wamp.PREFIX, wamp.CALL, wamp.SUBSCRIBE, wamp.UNSUBSCRIBE, wamp.PUBLISH]
wamp.isServerMsg= function(o,or){
	for(var i in wamp.SERVER)
		if(wamp.SERVER[i] == o)
			return true
	for(var i in or)
		if(or[i] == o)
			return true
	return false
}
wamp.isClientMsg= function(o,or){
	for(var i in wamp.CLIENT)
		if(wamp.CLIENT[i] == o)
			return true
	for(var i in or)
		if(or[i] == o)
			return true
	return false
}

//// WAMP ACCESSOR PROTOTYPES

function applyRequestProperties(o,acc){
	acc= acc||""
	["msgType","pipe","url",null,"headers","request"].forEach(function(slot,i){
		if(!slot) return
		Object.defineProperty(o,slot,accessor(acc+"["+i+"]"))
	})
}
module.exports.applyRequestProperties= applyRequestProperties

module.exports.proto= {}
function WrappedRequest(){}
module.exports.proto.WrappedRequest= WrappedRequest
applyRequestProperties(RawRequest.prototype)
function RawRequest(){}
module.exports.proto.RawRequest= RawRequest
applyRequestProperties(WrappedRequest.prototype,".wamp")

function applyResponseProperties(o,opts){
	var acc= "", prefix= ""
	if(opts instanceof String)
		acc= opts
	else if(opts){
 		if(opts.acc)
			acc= opts.acc
		if(opts.prefix)
			prefix= opts.prefix
	}

	var headerName, response= {
	  get: Function("var val= this"+acc+"; if(val) val= val[2]; if(val) val= val[2]; if(val) return val; return (!this.responseType || this.responseType == 'text')? "": null;")
	  enumerable: true
	}
	if(prefix){
		Object.defineProperty(o,prefix+"MsgType",accessor(acc+"[0]"))
		Object.defineProperty(o,prefix+"Pipe",accessor(acc+"[1]"))
		Object.defineProperty(o,prefix+"Status",accessor(acc+"[2][0]"))
		Object.defineProperty(o,prefix+"Headers",accessor(acc+"[2][1]"))
		Object.defineProperty(o,prefix+"Response",response)
		headerSlot
	}else{
		Object.defineProperty(o,"msgType",accessor(acc+"[0]"))
		Object.defineProperty(o,"pipe",accessor(acc+"[1]"))
		Object.defineProperty(o,"status",accessor(acc+"[2][0]"))
		Object.defineProperty(o,"headers",accessor(acc+"[2][1]"))
		Object.defineProperty(o,"response",response)
	}
}
module.exports.applyResponseProperties= applyResponseProperties

function RawResponse(){}
module.exports.proto.RawResponse= RawResponse
applyResponse(RawResponse.prototype)
function WrappedReponse(){}
module.exports.proto.WrappedResponse= WrappedResponse
applyResponse(WrappedResponse.prototype,".wamp")
function ResponseRespones(){}
module.exports.proto.ResponseResponse= ResponseResponse
applyResponse(ResponseResponse.prototype,{acc:".response",prefix:"response"})

function applyXhr(o){
	applyRequest(o,".wamp")
	applyResponse(o,{acc:".wampResponse",prefix:"response"})
}
module.exports.applyXhr= applyXhr

function XhrRequest(){}
module.exports.proto.XhrRequest= XhrRequest
applyXhr(XhrRequest.prototype)

//// HELPER

module.exports.progressNotifier= (function(){
	var interval,
	  progs= [],
	  next= []

	function intervalHandler(){
		for(var i= progs.length-1; i>= 0; --i){
			if(progs[i].state < 4)
				progs[i].dispatchProgress()
			else
				progs.splice(i,1)
		}
		while(next.length){
			progs.push(next.pop())
		}
		if(progs.length == 0){
			clearInterval(interval)
			interval= null
		}
	}

	return (function progressNotifier(xhr){
		if(!interval){
			setInterval(intervalHandler,50)
			progs.push(xhr)
		}else{
			next.push(xhr)
		}
	})
})()

//// CODES

module.exports.httpStatus= {100: "Continue",
	101: "Switching Protocols",
	102: "Processing",
	200: "OK",
	201: "Created",
	202: "Accepted",
	203: "Non-Authoritative Information",
	204: "No Content",
	205: "Reset Content",
	206: "Partial Content",
	207: "Multi-Status",
	208: "Already Reported",
	226: "IM Used",
	300: "Multiple Choices",
	301: "Moved Permanently",
	302: "Found",
	303: "See Other",
	304:	"Not Modified",
	305: "Use Proxy",
	306: "Switch Proxy",
	307: "Temporary Redirect",
	308: "Permanent Redirect",
	400: "Bad Request",
	401: "Unauthorized",
	402: "Payment Requierd",
	403: "Forbidden",
	404: "Not Found",
	405: "Method Not Allowed",
	406: "Not Acceptable",
	407: "Proxy Authentication Required",
	408: "Request Timeout",
	409: "Conflict",
	410: "Gone",
	411: "Length Required",
	412: "Precondition Failed",
	413: "Requested Entity Too Large",
	414: "Request-URI Too Long",
	415: "Unsupported Media Type",
	416: "Request Range Not Satisfiable",
	417: "Expectation Failed",
	418: "I'm a teapot",
	419: "Authentication Timeout",
	420: "Enhance Your Calm",
	422: "Unprocessable Entity",
	423: "Locked",
	424: "Failed Dependency/Method Failure",
	425: "Unordered Collection",
	426: "Upgrade Required",
	428: "Precondition Requierd",
	429: "Too Many Requests",
	431: "Request Header Fields Too Large",
	440: "Login Timeout",
	444: "No Response",
	449: "Retry With",
	450: "Blocked By Parental Controls",
	451: "Unavailable For Legal Reasons",
	494: "Request Too Large",
	495: "Cert Error",
	496: "No Cert",
	499: "Client Closed Request",
	500: "Internal Server Error",
	501: "Not Implemented",
	502: "Bad Gateway",
	503: "Service Unavailable",
	504: "Gateway Timeout",
	505: "HTTP Version Not Supported",
	506: "Variant Also Negotiates",
	507: "Insufficient Storage",
	508: "Loop Detected",
	509: "Bandwidth Limit Exceeded",
	510: "Not Extended",
	511: "Network Authentication Required",
	520: "Origin Error",
	522: "Connection Timeout"
}
for(var i in module.exports.httpStatus){
	module.exports.httpStatus[module.exports.httpStatus[i]]= i
}

var err = module.exports.err= []
err[1]= "IndexError"
err[3]= "HierarchyRequestError"
err[4]= "WrongDocumentError"
err[5]= "InvalidCharacterError"
err[7]= "NoModificationAllowedError"
err[8]= "NotFoundError"
err[9]= "NotSupportedError"
err[11]= "InvalidStateError"
err[12]= "SyntaxError"
err[13]= "InvalidModificationError"
err[14]= "NamespaceError"
err[15]= "InvalidAccessError"
err[18]= "SecurityError"
err[19]= "NetworkError"
err[20]= "AbortError"
err[21]= "URLMismatchError"
err[22]= "QuotaExceededError"
err[23]= "TimeoutError"
err[24]= "InvalidNodeTypeError"
err[25]= "DataCloneError"
err[2049]= "EncodingError"
err[2050]= "NoDataError"
err[2051]= "NoPipeError"
err[2052]= "WebSucksError"
err.forEach(function(name,i){
	this[name]= this[i]= {name:name, code:i}
},err)


//// WEB

var web= module.exports.web= {}
if(typeof document !== "undefined"){
	web.Origin= function(){return document.location.origin}
}
if(typeof self !== "undefined" && !web.Origin){
	web.Origin= function(){return self.location.origin}
}
if(!web.Origin){
	web.Origin= function(){return "p:///"}
}
["ArrayBuffer","Blob","Document","FormData","setInterval","XMLHttpRequest"].forEach(function(slot){
	try{
		web[slot]= eval(slot)
	}catch(e){
		web[slot]= Function()
	}
})

//// UTILITY FUNCTIONS

module.exports.util= {nop:nop, empty:empty, rand:rand, biset:biset, accessor:accessor, namePropExpand:namePropExpand, urlRegex:urlRegex, uuid:uuid.v4}

function accessor(a,opts){
	var enumerable= opts.enumerable!==false,
	  configurable= opts.configurable!==false,
	  set= opts.set!==false
	  o= {get:Function("return this"+a),
		        set:Function("o","this"+a+"= o"),
		        enumerable:enumerable, configurable:configurable}
	if(!set)
		delete o.set
	return o
}

function biset(val,key){
	this[key]= val
	this[val]= key
}

module.exports.minPipe= 0
module.exports.stridePipe= Math.pow(2,52)-1
function rand(min,stride){
	min= min|| module.exports.minPipe
	stride= stride|| module.exports.stridePipe
	return Math.floor(Math.random()*stride)+min
}

function namePropExpand(slots){
	var res= []
	for(var i= 0; i< slots.length; ++i){
		res.push({name:slots[i],a:accessor("["+i+"]")})
	}
	return res
}

function nop(){}

function empty(){
	return {}
}
