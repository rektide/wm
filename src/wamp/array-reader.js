var util= require("util")
  msgs= require("./msgs")

var byId= {}
for(var i in msgs){
	var msg= msgs[i],
	  lines= ["this.messageType= "+msg.messageType],
	  j= 1;
	for(; j< msg.fields.length; ++j){
		lines.push("this."+msg.fields[j]+"= arr["+j+"]")
	}
	if(msg.vargs){
		lines.push("this.arguments= arr["+j+++"]"
		lines.push("this.argumentsKw= arr["+j+"]"
	}
	var fn= Function(arr, lines.join("\n")
	util.inherits(fn, msg)
	byId[msg.messageType]= fn
}

function arrayReader(arr){
	if(!Arrays.isArray(arr)){
		throw "expected array"
	}
	var fn= byId[arr[0]]
	return new fn(arr)
}
module.exports= arrayReader
