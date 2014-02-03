var primitives= require("../primitives"),
  xhr= primitives.web.XMLHttpRequest,
  pxhr= require("xhr")

module.exports= xhr
module.exports.xhr= xhr
module.exports.port= port

function port(p){
	if(!p.mailboxes){
		p.welcomeListener= welcomeListener.bind(p)
		p.addEventListener("message",p.welcomeListener)
		p.resultListener("message",resultListener)
		p.mailboxes= new WeakMap()
	}
	return p.mailboxes
}

function xhr(x){
	var mailboxes = x.port.mailboxes
	if(!mailboxes)
		mailboxes= port(p)
	mailboxes.set(x.callId,x)
}

function welcomeListener(msg){
	if(this.origin)
		return
	if(msg.origin){
		this.origin= msg.origin
	}
	var data= msg.data
	if(data && data.length){
		if(data[0]== wamp.WELCOME && !this.origin){
			this.origin= data[1]
		}
	}
	this.removeEventListener("message",this.welcomeListener)
	delete this.welcomeListener
}

function resultListener(msg){
	var data= msg.data
	if(data[0] == wamp.CALLRESULT || data[0] == wamp.CALLERROR){
		var mailboxes= msg.source.mailboxes
		if(!mailboxes){
			console.error("Got a "+wamp[data[0]]+" but no mailboxes on port",msg.source)
			return
		}
		var callId= data[1],
		  x= mailboxes.get(callId)
		x.complete(msg)
	}
}
