var msgs= require("./msgs")

var all= [msgs.Goodbye.msgType, msgs.Hearbeat.msgType],
  client= all.concat([msgs.Hello.msgType, msgs.Authenticate.msgType]),
  server= all.concat([msgs.Welcome.msgtype, msgs.Abort.msgType, msgs.Challenge.msgType, msgs.Error.msgType])

function allowed(base){
	var rv= base.slice(0)
	for(var i= 1; i< arguments.length; ++i)
		rv.push(arguments[i].msgType)
	return rv
}

module.exports.Caller= {
	allowed: allowed(client, msgs.Call, msgs.Cancel)
}

module.exports.Callee= {
	allowed: allowed(client, msgs.Error, msgs.Register, msgs.Unregister, msgs.Yield)
}

module.exports.Publisher= {
	allowed: allowed(client, msgs.Publish)
}

module.exports.Subscriber= {
	allowed: allowed(client, msgs.Subscribe, msgs.Unsubscribe)
}

module.exports.BrokerFront= {
	side: "front",
	allowed: allowed(server, msgs.Published)
}

module.exports.BrokerBack= {
	side: "back",
	allowed: allowed(server, msgs.Subscribed, msgs.Unsubscribed, msgs.Event)
}

module.exports.DealerFront= {
	side: "front",
	allowed: allowed(server, msgs.Result)
}

module.exports.DealerBack= {
	side: "back",
	allowed: allowed(server, msgs.Registered, msgs.Unregistered, msgs.Invocation, msgs.Interrupt)
}
