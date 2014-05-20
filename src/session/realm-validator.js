module.exports= realmValidator
module.exports.RealmValidator

function realmValidator(incoming){
	var got
	if(this.realm){
		got= checkRealm.call(this, this.realm, incoming)
		if(got)
			return got
	}else if(this.realms){
		for(var i in this.realms){
			got= checkRealm.call(this, this.realms[i], incoming)
			if(got)
				return got
		}
	}else{
		return
	}
	return false
}

function checkRealm(realm, incoming){
	if(realm instanceof Function)
		return realm.call(this, incoming)
	else if(typeof realm == "string")
		return realm!= incoming? false: realm
	else
		throw "Unexpected realm type "+(typeof realm)
}
