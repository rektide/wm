module.exports.Req= PromiseRequest
module.exports.Res= PromiseResponse
module.exports.PromiseRequest= PromiseRequest
module.exports.PromiseResponse= PrmoiseResponse
module.exports.accessor= accessor

module.exports.minPipe= 0
module.exports.stridePipe= Math.pow(2,52)-1

/**
  Pipe ID range selector
*/
function rand(min,stride){
	min= min|| module.exports.minPipe
	stride= stride|| module.exports.stridePipe
	return Math.floor(Math.random()*stride)+min
}

// default values to use for Request/Response
module.exports.defaultRequest= [undefined,undefined,empty]
module.exports.defaultResponse= [undefined,100,empty]

function empty(){
	return {}
}

function PrimitiveRequest(e){
	if(!e.length && e !== undefined) // probably want obj constructors too
		throw "Invalid PromiseRequest"
	this.val= e|| []
	this.headers= this.headers||{}
	this.headers.p= this.headers.p||(Math.floor(Math.random()*bigint))
	return this
}
makeArrayAccessors(PrimitiveRequest.prototype, ["method","url","headers","request"], module.exports.defaultRequest)

var p= {get:function(){
	return this.headers.p
},set:function(val){
	this.headers.p= val
}}
Object.defineProperty(PrimitiveRequest.prototype,"p",p)


/**
* Semi- XMLHttpRequest Respones compliant implementation for request
*/
function PrimitiveResponse(req){
	this.val= ["RE",undefined,{p:req.headers.p}]
	this.responseType= "json"
	return this
}
makeArrayAccessors(PrimitiveResponse.prototype, [undefined, "status","headers","response"], module.exports.defaultResponse)

/**
  Retrieve a single header from the PromiseReponse
*/
PrimitiveResponse.prototype.getResponseHeader= function(h){
	return this.headers[h.toLowerCase()]
}
/**
*/
Object.defineProperty(PrimitiveResponse.prototype,"responseHeader",{
	get:getAllResponseHeaders
  }
)
PrimitiveResponse.prototype.getallResponseHeaders= getAllResponseHeaders
function getAllResponseHeaders(){
	return this.headers
}
PrimitiveResponse.prototype.overrideMimeType= overrideMimeType
function overrideMimeType(mimeType){
	throw "not supported"
}

Object.defineProperty(PrimitiveResponse.prototype,"p",p)

/**
  @param Obj
*/
function makeArrayAcessors(obj,named,defaults){
	var defineProperties= accessor
	if(obj)
		defineProperties= defineProperties.bind(obj,defaults?defaults:{})
	named.forEach(named, defineProperties)
}


function accessor(defaults,name,index){
	if(val === undefined)
		return
	Object.defineProperty(this,name,{
		get: function(){
			var val= this.val[index],
			  def
			if(val === undefined && !!(def= defaults[index]))
				val= this.val[index]= getOrSet(def)
			return val
		},
		set: function(newVal){
			this.val[index]= newVal
		}
	})
}
