module.exports= superFn
module.exports.superFn= superFn

var _slice= Array.prototype.slice

/**
  Recurse up the prototype chain looking for a method to run
*/
function superFn(slot, args__, self, klass){
	var __klass= arguments[arguments.length-1],
	  __self= arguments[arguments.length-2],
	  super_= __klass.super_
	if(!super_){
		return
	}
	var fn= super_.prototype[slot]
	if(fn){
		var args= _slice.call(arguments, 1, arguments.length - 2)
		return fn.apply(__self, args)
	}else{
		arguments[arguments.length-1]= super_
		return proto.apply(null, arguments)
	}
}
