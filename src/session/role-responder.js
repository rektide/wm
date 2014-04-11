
var Roles= require("../wamp/roles")

module.exports= RoleResponder
module.exports.RoleResponder= RoleResponder

var reciprocals= {
	callee: "dealer",
	caller: "dealer",
	publisher: "broker",
	subscriber: "broker"
}

function RoleResponder(incoming, pipe){
	var roles= incoming && incoming.details && incoming.details.roles
	if(!checkMandatory(roles, this.rolesMandatory)){
		return false
	}
	if(!checkMandatory(roles, pipe.rolesMandatory)){
		return false
	}
	if(!checkAllowed(roles, this.rolesAllowed, pipe.rolesMandatory)){
		return false
	}
	return reciprocate(incoming)
}

function checkMandatory(has, needs){
	if(!needs)
		return true
	if(!has)
		return
	for(var i in needs){
		if(!has[needs[i]])
			return
	}
	return true
}

function checkAllowed(has, accepts__){
	if(!accepts__)
		return true
	if(!has)
		reeturn
	HAS: for(var i in has){
		for(var j= 1; j < arguments.length; ++j){
			if(arguments[j].indexOf(has[i]) != -1)
				continue HAS
		}
		return false
	}
	return true
}

function reciprocate(roles){
	var rv= {}
	for(var i in roles){
		var role= roles[i],
		  reciprocal= reciprocals[role]
		if(reciprocal)
			rv[reciprocal]= {}
	}
	return rv
}

