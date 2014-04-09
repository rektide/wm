var helper= require("./helper"),
  bisetAll= helper.bisetAll

var wamp= module.exports.wamp= module.exports.WAMP= (module.exports= {});
wamp[1]= "HELLO"
wamp[2]= "WELCOME"
wamp[3]= "ABORT"
wamp[4]= "CHALLENGE"
wamp[5]= "AUTHENTICATE"
wamp[6]= "GOODBYE"
wamp[7]= "HEARTBEAT"
wamp[8]= "ERROR"

wamp[32]= "SUBSCRIBE"
wamp[33]= "SUBSCRIBED"
wamp[34]= "UNSUBSCRIBE"
wamp[35]= "UNSUBSCRIBED"
wamp[36]= "EVENT"

wamp[48]= "CALL"
wamp[49]= "CANCEL"
wamp[50]= "RESULT"

wamp[64]= "REGISTER"
wamp[65]= "REGISTERED"
wamp[66]= "UNREGISTER"
wamp[67]= "UNREGISTERED"
wamp[68]= "INVOCATION"
wamp[69]= "INTERRUPT"
wamp[70]= "YIELD"
bisetAll(wamp)

wamp.SERVER= [wamp.WELCOME, wamp.CALLRESULT, wamp.CALLERROR, wamp.EVENT]
wamp.CLIENT= [wamp.PREFIX, wamp.CALL, wamp.SUBSCRIBE, wamp.UNSUBSCRIBE, wamp.PUBLISH]

wamp.isServerMsg= function(o,or){
	for(var i in wamp.SERVER)
		if(wamp.SERVER[i] == o)
			return true
	for(var i in or)
		if(or[i] == o)
			return true
	return false
}
wamp.isClientMsg= function(o,or){
	for(var i in wamp.CLIENT)
		if(wamp.CLIENT[i] == o)
			return true
	for(var i in or)
		if(or[i] == o)
			return true
	return false
}


