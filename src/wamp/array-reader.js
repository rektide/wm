var util= require("util")
  msgs= require("./msgs")

var byId= {}
for(var i in msgs){
	var msg= msgs[i],
	  lines= ["this.messageType= ",msg.messageType,"\n"],
	  j= 0;
	while(j< msg.fields.length){
		lines.push("this.",msg.fields[j],"= arr[",++j,"]\n")
	}
	if(msg.vargs){
		lines.push("this.arguments= arr[",j++,"]\n")
		lines.push("this.argumentsKw= arr[",j,"]\n")
	}
	var fn= Function("arr", lines.join(""))
	util.inherits(fn, msg)
	byId[msg.messageType]= fn
}

function arrayReader(arr){
	if(!Array.isArray(arr)){
		throw "expected array"
	}
	var fn= byId[arr[0]]
	return new fn(arr)
}
module.exports= arrayReader
