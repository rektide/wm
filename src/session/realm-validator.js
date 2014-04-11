module.exports= realmValidator
module.exports.RealmValidator

function realmValidator(incoming){
	if(this.realm){
		if(checkRealm.call(this, this.realm, incoming))
			return true
	}else if(this.realms){
		for(var i in this.realms){
			if(checkRealm.call(this, this.realms[i], incoming))
				return true
		}
	}
}

function checkRealm(realm, incoming){
	if(realm instanceof Function && realm.call(this,incoming))
		return false
	else if(typeof realm == "string" && realm != incoming)
		return false
	else if(typeof realm == "string")
		return true
	else
		throw "Unexpected realm type "+(typeof realm)
}
