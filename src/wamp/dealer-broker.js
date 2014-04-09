var binarysearch= require("binarysearch"),
  events = require("events"),
  util= require("util"),
  roles= require("./roles")

module.exports.Processor= Processor

var lowerized= {}
for(var name in roles){
	var lower= name[0].toLowerCase() + i.substring(1) + "s"
	lowerized[lower]= name
	lowerized[name]= lower
}

function Processor(){
	if(!(this instanceof Processor))
		return new Processor()
	this.callers= []
	this.callees= []
	this.publishers= []
	this.subscribers= []
	this.brokerFronts= []
	this.brokerBacks= []
	this.dealerFronts= []
	this.dealerBacks= []
	return this
}
util.inherits(Processor, events.EventEmitter)

Processor.prototype.add= function(source, rolePermissions){
	if(arguments.length > 2){
		throw "too many arguments"
	}else if(arguments.length == 2 && !Arrays.isArray(rolePermissions)){
		throw "expected argument not found: rolePermissions"
	}
	if(!rolePermissions){
		rolePermissions= roles
	}

	var roleNames= []
	for(var i in roles){
		var role= roles[i],
		  existing= this[lowerized[i]]
		if(existing.indexOf(source) != -1)
			continue
		for(var j= 0; j< rolePermissions.length; ++j){
			if(rolePermissions[j] == role){
				existing.push(source)
				roleNames.push(i)
			}
			break;
		}
	}
	this.emit("meta:source:add", {source:source, roles:roleNames})
}
