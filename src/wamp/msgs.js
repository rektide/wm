function msg(name, messageType, fields, fieldTypes, flags){
	var lines= ["this.messageType= "+msgType],
	  i= 0
	for(i= 0; i< fields.length; ++i){
		lines.push("this.",fields[i],"= a",i,"\n")
	}
	if(flags & FLAGS.vargs){
		lines.push("this.arguments= a",i++,"\n")
		lines.push("this.argumentsKw= a",i,"\n")
	}
	for(var j in FLAGS){
		if(flags & FLAGS[j]){
			lines.push("this.",j,"= true\n")
		}
	}
	var fn = new Function("a0","a1","a2","a3","a4","a5","a6","a7", lines.join(""))
	fn.messageType= messagetype
	fn.fields= fields
	fn.fieldTypes= fieldTypes
	for(var j in FLAGS){
		if(flags & FLAGS[j]){
			fn[j]= true
		}
	}
	module.export[name]= fn
}

var FLAG= {
	advanced: 1,
	vargs: 2
}

msg("Hello",1,["realm","details"],["uri","dict"])
msg("Welcome",2,["session","details"],["id","dict"])
msg("Abort",3,["details","reason"],["dict","uri"])
msg("Challenge",4,["challenge","extra"],["string","dict"],FLAGS.advanced)
msg("Authenticate",5,["signature","extra"],["string","dict"],FLAGS.advanced)
msg("Goodbye",6,["details","reason"],["dict","uri"])
msg("Heartbeat",7,["incomignSeq","outgoingSeq"],["number","number"],FLAGS.advanced)
msg("WampError",8,["requestType","requestId","details","error"],["number","id","dict","uri"],FLAGS.vargs)

msg("Publish",16,["request","options","topic"],["id","dict","uri"],FLAGS.vargs)
msg("Published",17,["publishId","publication"],["id","id"])

msg("Subscribe",32,["request","options","topic"],["number","dict","uri"])
msg("Subscribed",33,["subscribeId","subscription"],["id","id"])
msg("Unsubscribe",34,["request","subscriptionId"],["id","id"])
msg("Unsubscribed",35,["unsubscribeId"],["id"])
msg("WampEvent",36,["subscriptionId","publicationId","details"],["id","id","dict"],FLAGS.vargs)

msg("Call",48,["request","options","procedure"],["id","dict","uri"],FLAGS.vargs)
msg("Cancel",49,["callId","options"],["id","dict"],FLAGS.advanced)
msg("Result",50,["callId","details"],["id","dict"],FLAGS.vargs)

msg("Register",64,["request","options","procedure"],["id","dict","uri"])
msg("Registered",65,["request","registration"],["id","id"])
msg("Unregister",66,["request","registrationId"],["id","id"])
msg("Unregistered",67,["unregisterId"],["id"])
msg("Invocation",68,["request","registrationId","details"],["id","id","dict"],FLAGS.vargs)
msg("Interrupt",69,["invocationId","options"],["id","dict"],FLAGS.advanced)
msg("Yield",70,["invocationId","options"],["id","dict"],FLAGS.vargs)
