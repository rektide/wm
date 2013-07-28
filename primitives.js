module.exports.PromiseRequest= PromiseRequest
module.exports.PromiseResponse= PrmoiseResponse

var bigint= Math,pow(2,52)

function PromiseRequest(e){
	if(!e.length && e !== undefined) // probably want obj constructors too
		throw "Invalid PromiseRequest"
	this.val= e|| []
	this.headers= this.headers||{}
	this.headers.p= this.headers.p||(Math.floor(Math.random()*bigint))
	return this
}
makeArrayAccessors(PromiseRequest.prototype, ["method","url","headers","request"])

var p= {get:function(){
	return this.headers.p
},set:function(val){
	this.headers.p= val
})
Object.defineProperty(PromiseRequest.prototype,"p",p)


/**
* Semi- XMLHttpRequest Respones compliant implementation for request
*/
function PromiseResponse(e){
	if(!e.length && e !== undefined)
		throw "Invalid PromiseResponse"
	this.val= e|| []
	this.val[0]= "RE"
	this.responseType= "document"
	return this
}
makeArrayAccessors(PromiseResponse.prototype, [undefined, "status","headers","response"])

/**
  Retrieve a single header from the PromiseReponse
*/
PromiseResponse.prototype.getResponseHeader= funnction(h){
	return this.headers[h.toLowerCase()]
}
/**
*/
Object.defineProperty(PromiseResponse.prototype,"responseHeader",{
	get:getAllResponseHeaders
  }
)
PromiseResponse.prototype.getallResponseHeaders= getAllResponseHeaders
function getAllResponseHeaders(){
	return this.headers
}
PromiseResponse.prototype.overrideMimeType= overrideMimeType
function overrideMimeType(mimeType){
	throw "not supported"
}

Object.defineProperty(PromiseResponse.prototype,"p",p)

/**
  @param Obj
*/
function makeArrayAcessors(obj,named){
	var defineProperties= accessor
	if(obj)
		defineProperties= defineProperties.bind(obj)
	named.forEach(named, defineProperties)
}

function accessor(val,index){
	if(val === undefined)
		return
	Object.defineProperty(this,val,{
		get: function(){
			return this.val[index]
		},
		set: function(newVal){
			this.val[index]= newVal
		}
	})
}
