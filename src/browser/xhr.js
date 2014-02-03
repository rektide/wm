var EventTarget= require("event-target"),
  Plexer= require("./xhr-plexer"),
  primitives= require("../primitives"),
  applyXhr= primitives.applyXhr,
  err= primitives.err,
  httpStatus= primitives.httpStatus
  methods= primitives.methods,
  progressNotifier= primitives.progressNotifier,
  state= primitives.xhrState,
  wamp= primitives.wamp,
  accessor= primitives.util.accessor,
  biset= primitives.util.biset,
  uuid= primitives.util.uuid,
  ArrayBuffer= primitive.web.ArrayBuffer,
  Blob= primitive.web.Blob,
  Document= primitive.web.Document,
  FormData= primitive.web.FormData,
  Origin= primitive.web.Origin

var state= module.exports= XMLHttpRequest
XMLHttpRequest.strict= false
XMLHttpRequest.cors= false
XMLHttpRequest.endpoint= "p:///"
XMLHttpRequest.verbotenMethods= ["CONNECT","TRACE","TRACK"]
XMLHttpRequest.verbotenHeaders= {}
XMLHttpRequest.noIntervalProgress= true

["","accept-charset","accept-encoding","access-control-request-headers",
"access-control-request-method","connection","content-length","cookie","cookie2",
"content-transfer-encoding","date","expect","host","keep-alive","origin","referer","te",
"trailer","transfer-encoding","upgrade","user-agent","via"].forEach(biset,XMLHttpRequest.verbotenHeaders)

/* XMLHttpRequestEventTarget events:
loadstart
progress
abort
error
load
timeout
loadend */

function XMLHttpRequest(opts){
	if(opts.port)
		this.port= opts.port
	else if(opts.postMessage)
		this.port= opts
	if (this.port && !this.port.mailboxes)
		Plexer.port(this.port)
	this.wamp= [wamp.CALL,uuid(),methods.GET,null,{}]
	this.readyState= state.UNSENT
	this.status= 0
	this.statusText= ""
	this.responseType= ""
}

// mixin WAMP Request and Response properties
applyXhr(XMLHttpRequest.prototype)

// mixin EventTarget
["addEventListener","removeEventListener","dispatchEvent"].forEach(function(slot){
	this[slot]= EventTarget[slot]
},XMLHttpRequest.prototype)

// monkey patch EventTarget.dispatchEvent to handle EventListeners
XMLHttpRequest.prototype.dispatchEvent= (function dispatchEvent(e){
	EventTarget.dispatchEvent.call(e)
	if((var on= this["on"+e.type]))
		on.call(this,e)
})

XMLHttpRequest.prototype.open= (function open(method, url, async, user, password){
	if(this.strict){
		var haveMethod= false
		for(var i in methods){
			if(method == methods[i]){
				haveMethod= true
				break
			}
		}
		if(!haveMethod)
			throw err.SyntaxError
		var endpoint= XMLHttpRequest.endpoint
		if(endpoint && !url.startsWith(endpoint))
			throw err.SyntaxError
		for(var i in XMLHttpRequest.secureMethods)
			if(XMLHttpRequest.secureMethods[i]==method)
				throw err.SecurityError
		if(this.timeout != 0 || this.withCredentials || this.responseType)
			throw err.InvalidAccessError
	}

	delete this.error
	delete this.sent
	this.url= url
	this.method= method.toUpperCase()
	if(async===false)
		this.sync= true
	if(user)
		this.user= user
	if(password)
		this.password= password
	this.headers= {}
	this.readyState= state.OPENED
	if(this.timeout && !isNaN(this.timeout)){
		this.timeoutCheck= setTimeout(timeoutFn.bind(this),this.timeout)
	}
	if(this.cors){
		this.origin= Origin()
	}
	this.dispatchEvent({type:"readyStateChange"})
})

XMLHttpRequest.prototype.setRequestHeader= (function setRequestHeader(header,value){
	header= header.toLowerCase()
	if(this.strict){
		if(this.readyState != this.OPENED || this.sent)
			throw err.InvalidStateException
		if(XMLHttpRequest.verbotenHeaders[header])
			return
		if(header.startsWith("proxy-") || header.startsWith("sec-")
			return
	}
	this.headers[header]= value
}

Object.define(XMLHttpRequest.prototype,"timeout",{
	set:function(value){
		if(this.strict){
			if(this.sync)
				throw err.InvalidAccessError
			if(isNaN(value))
				throw err.SyntaxError // not in spec
		}
		this.timeout= value
	},
	get:function(){
		return this.timeout
	}
})

Object.define(XMlHttpRequest.prototype,"withCredentials",{
	set:function(value){
		if(this.strict){
			if(this.readyState > state.OPENED)
				throw err.InvalidStateException
			if(this.sent)
				throw err.InvalidStateException
			if(this.anonymous)
				throw err.InvalidAccessError
			if(this.document && this.sync)
				throw err.InvalidAccessError
		}
		this.credentials= !!value
	},
	get:function(){
		return this.credentials
	}
})

Object.define(XMLHttpRequest.prototype,"upload",{
	get:function(){
		if(!this.uploadTarget){
			this.uploadTarget= {}
			this.uploadTarget.addEventListener= EventTarget.addEventListener
			this.uploadTarget.removeEventListener= EventTarget.removeEventListener
			this.uploadTarget.dispatchEvent= dispatchEvent
		}
		return this.uploadTarget
	}
})

XMLHttpRequest.prototype.send= (function send(data){
	if(this.readyState != state.OPENED || this.sent)
		throw err.InvalidStateError
	if(this.method == "GET" || this.method == "HEAD"){
		data= null
	}
	var mimeType
	if(data instanceof String){
		type= "text/plain;charset=UTF-8"
	}
	else if(!data){}
	else if(data instanceof Blob && data.type)
		mimeType= data.type
	else if(data instanceof Document){
		mimeType= "application/html;charset="+(document.encoding||"UTF-8")
		data= data.innerHTML
	}
	else if(data instanceof FormData){
		mimeType= "multipart/form-data" // no boundary specified
		if(!data.toHeaderValue)
			throw err.WebSucksError // FormData deliberately opaque because "fuck you"
		data= data.toHeaderValue()
	}else{
		mimeType= "application/json"
	}
	if(mimeType && !this.headers["mime-type"])
		this.headers["mime-type"]= mimeType
	this.error= null
	if(!this.sync){
		this.sent= true
		this.dispatchEvent({type:"readyStateChange"})
		this.dispatchProgress("loadstart")
		if(this.uploadTarget && data){
			this.dispatchUpload("loadstart",true)
		}
	}

	// -- "send" returns here in the spec --

	this.request= data
	Plexer(this)
	this.port.send(this.wamp)

	if(this.uploadTarget && data){
		this.dispatchUpload("load")
		this.dispatchUpload("loadend")
	}
	if(!XMLHttpRequest.noIntervalProgress){
		progressNotifier(this)
	}
})

XMLHttpRequest.prototype.abort= (function abort(){
	if(!this.error)
		this.error= err.AbortError
	delete this.sync
	if(this.readyState != state.UNSENT && (this.sent || this.readyState != state.OPENED) && this.readyState != DONE){
		this.readyState= state.DONE
		delete this.sent
		this.dispatchEvent({type:"readyStateChange"})
		this.dispatchProgress()
		this.dispatchProgress("loadend")
		if(this.uploadTarget){
			this.dispatchUpload("abort")
			this.dispatchUpload("loadend")
		}
	}
	this.readyState= state.UNSENT
})

XMLHttpRequest.prototype.overrideMimeType= (function overrideMimeType(type){
	if(this.readyState >= state.LOADING)
		throw err.InvalidStateException
	this.overrideMime= type
})

XMLHttpRequest.prototype.getAllResponseHeaders= (function getAllResponseHeaders(){
	if(!this.response) return ""
	var res= []
	for(var i in this.responseHeaders){
		res.push(i+": "+this.responseHeaders[i])
	}
	return res.join("\n")
})

XMLHttpRequest.prototype.getResponseHeader= (function getResponseHeader(header){
	return this.response? this.responseHeaders[header.toLowerCase()]: null
})

Object.defineProperty(XMLHttpRequest.prototype,"statusText",{
	get:function(){
		return this.response? httpStatus[this.status]||this.status||"": ""
	},
	enumerable: true
})

// HELPERS

var redirected = [301,302,303,307]

XMLHttpRequest.prototype.complete= (function complete(msg){
	if(this.error)
		return
	this.wampResponse= msg.data
	for(var i in this.responseHeaders){
		this.responseHeaders[i]= this.responseHeaders[i].toLowerCase()
	}
	if(redirected.indexOf(this.responseStatus) != -1){
		var url= this.responseHeaders["location"]
		if(url){
			this.url= url
			this.pipe= uuid()
			Plexer(this)
			this.send(this.wamp)
		}
		return
	}

	var mime= this.responseHeaders["mime-type"]||""
	if(this.response instanceof Object || this.response instanceof Array)
		this.responseType= "json"
	else if(this.response instanceof String)
		this.responseType= "string"
	if(this.response instanceof ArrayBuffer)
		this.responseType= "arraybuffer"
	else if(this.response instanceof Blob)
		this.responseType= "blob"
	else if(mime.startsWith("application/html") || mime.startsWith("text/html") || mime.endsWith("+xml"){
		this.responseType= "document"
		if(this.response instanceof String){
			var xml= (new DOMParser()).parseFromString(this.response, "text/xml")
			if(xml.documentElement.nodeName == "parsererror"){
				console.error("Failed to convert XML response")
			}else{
				this.response= xml
			}
		}
	}else
		this.responseType= ""

	var readyState= {type:"readyStateChange"}
	this.readyState= state.HEADERS_RECEIVED
	this.dispatchEvent(readyState)
	this.readyState= state.LOADING
	this.dispatchEvent(readyState)
	delete this.sync
	this.readyState= state.DONE
	this.dispatchEvent(readyState)
	this.dispatchProgress("load")
	this.dispatchProgress("loadend")
})

XMLHttpRequest.prototype.dispatchProgress= (function dispatchProgress(type,unsent){
	if(!type)
		type= "progress"
	}
	if(this.response && this.response.length)
		this.dispatchEvent({
		  type:type,
		  lengthComputable:true,
		  loaded:unsent?0:this.response.length,
		  total:this.response.length})
	else
		this.dispatchEvent({
		  type:type,
		  lengthComputable:false,
		  loaded:0,
		  total:0})
})

XMLHttpRequest.prototype.dispatchUpload= (function dispatchUpload(type,unsent){
	if(!this.uploadTarget)
		return
	if(!type)
		type= "progress"
	}
	if(this.request && this.request.length)
		this.uploadTarget.dispatchEvent({
		  type:type,
		  lengthComputable:true,
		  loaded:unsent?0:this.request.length,
		  total:this.request.length})
	else
		this.uploadTarget.dispatchEvent({
		  type:type,
		  lengthComputable:false,
		  loaded:0,
		  total:0})
})

function timeoutFn(){
	if(this.readyState > states.DONE){
		this.error= err.TimeoutError
		this.abort()
	}
}
