function mixinRequest(o,acc){
	acc= acc||"";
	["msgType","pipe","url",null,"headers","request"].forEach(function(slot,i){
		if(!slot) return
		Object.defineProperty(o,slot,accessor(acc+"["+i+"]"))
	})
}
module.exports.mixinRequest= mixinRequest


module.exports.proto= {}
function WrappedRequest(){}
module.exports.proto.WrappedRequest= WrappedRequest
mixinRequest(RawRequest.prototype)
function RawRequest(){}
module.exports.proto.RawRequest= RawRequest
mixinRequest(WrappedRequest.prototype,".wampRequest")
