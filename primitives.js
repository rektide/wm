module.exports.PromiseRequest= PromiseRequest
module.exports.PromiseResponse= PrmoiseResponse

function PromiseRequest(e){
	this.val= e
	return this
}
makeArrayAccessors(PromiseRequest.prototype, ["method","url","headers","request"])



/**
* Semi- XMLHttpRequest Respones compliant implementation for request
*/
function PromiseResponse(e){
	this.val= e
	e.length? this.val[0]= "RE"
	this.responseType= "document"
	return this
}
makeArrayAccessors(PromiseResponse.prototype, [undefined, "status","headers","response"])

/**
  Retrieve a single header from the PromiseReponse
*/
PromiseResponse.prototype.getResponseHeader(h){
	return this.headers[h.toLowerCase()]
}
/**
*/
Object.defineProperty(PromiseResponse.prototype,"responseHeader",function(){
	
})
PromiseResponse.prototype.getAllResponseHeaders(){
	return this.headers
}
PromiseResponse.prototype.overrideMimeType(mimeType){
	throw "not supported"
}


/**
  @param Obj
*/
function makeArrayAcessors(obj,named){
	var defineProperties= function definer(val,index){
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
	}.bind(obj)
	named.forEach(named, defineProperties)
}

