var _= require("lodash"),
  when= require("when"),
  Base= require("../base"),
  Session= require("./session"),
  msgs= require("../wamp/msgs")

module.exports= ClientSession
module.exports.Helloer= ClientSession

/**
  ClientSession commences a client connection on a pipe, issuing a Hello message and establishing a session with the first resulting Welcome
*/
function ClientSession(pipe, realm, opts){
	if(!(this instanceof ClientSession)){
		return new ClientSession(pipe, realm, opts)
	}

	if(opts){
		opts.realm= realm
		opts.pipe= pipe
	}else if(realm && realm instanceof Object){
		opts= realm
		opts.pipe= pipe
	}else if(pipe.pipe){
		opts= pipe
	}else if(!opts){
		opts= {pipe:pipe, realm:realm}
	}

	ClientSession.super_.call(this, opts)
	Base.go(this, opts, ClientSession)
}
util.inherits(ClientSession, Session)

function prefs(opts){
	this.details= _.extend({}, opts.pipe.details, opts.details)
	this.realm= opts.realm|| ""
	this._sessionId= when.defer()
	this.sessionId= this._sessionId.promise
	this._serverDetails= when.defer()
	this.serverDetails= this._serverDetails.promise
}
ClientSession.prototype.prefs= prefs

function open(){
	var hello = new msgs.Hello(realm, details)
	this.emit(hello)
	this.once(msgs.Welcome.messageType, function(msg){
		this._sessionId.resolve(msg.session)
		this.serverDetails.resolve(msg.details)
	})
}
ClientSession.prototype.open= open


