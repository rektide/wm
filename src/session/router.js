var util= require("util"),
  _= require("lodash"),
  when= require("when"),
  Base= require("../base"),
  Session= require("./session"),
  msgs= require("../wamp/msgs"),
  rand= require("../util/rand"),
  superFn= require("../util/super-fn"),
  RoleResponder= require("./role-responder"),
  RealmValidator= require("./realm-validator"),
  Session= require("./session")

module.exports= Router
module.exports.ClientSession= Router

/**
  Router configures a pipe to listen for incoming Hello messages, responding by:
   + putting a Welcome reply into the pipe
   + emit a new "session" event
   + store the Session by key in the sessions map

  If a goodbye is receieved on the port, Router will:
   + return a matching Goodbye to the pipe
   + emit a "close" event for the session.

  @option pipe (or pipes) set of pipes to listen and respond on
  @option rolesMandatory (named-option) roles the client must bear
  @option rolesAllowed (named-option) roles to permit the client to have
  @option rolesDisallowed (named-option) roles to disallow on the client
  @option welcome (named-option) function to respond to a hello
  @option noAbort (named-option)
  @option sessions (named-option) existing mapping of sessionId to Session
*/
function Router(pipe, opts){
	if(!(this instanceof Router)){
		return new Router(pipe, opts)
	}

	if(opts){
		opts.pipe= pipe
	}else if(pipe.pipe){
		opts= pipe
	}else if(pipe.pipes){
		opts= pipe
	}else if(!opts){
		opts= {pipe:pipe}
	}

	Router.super_.call(this, opts)
	Base.go(this, opts, Router)
}
util.inherits(Router, Base)

function prefs(opts){
	superFn("prefs", opts, this, Router)

	if(opts.pipe && !(opts.pipe instanceof Array))
		this.pipes= [opts.pipe]
	else if(opt.pipe)
		this.pipes= [opt.pipe]
	else if(opts.pipes instanceof Array)
		this.pipes= opt.pipes

	if(opts.realms)
		this.realms= opts.realms
	else
		this.realm= opts.realm|| null
	this.realmValidator= opts.realmValidator|| RealmValidator

	if(opts.rolesMandatory)
		this.rolesMandatory= opts.rolesMandatory
	if(opts.rolesAllowed)
		this.rolesAllowed= opts.rolesAllowed
	this.roleResponder= opts.roleResponder|| RoleResponder

	if(opts.welcome)
		this.welcome= opts.welcome
	if(opts.noAbort)
		this.noAbort= true
	this.details= opts.details
	this.target= this
	this.sessions= {}
	return this
}
Router.prototype.prefs= prefs

function open(){
	superFn("open", this, Router)

	var self= this
	function welcomer(hello){
		return self.welcome(hello, this)
	}
	this._welcomer= welcomer
	function goodbyer(gb){
		return self.goodbye(gb, this)
	}
	this._goodbyer= goodbyer
	for(var i in this.pipes){
		this.pipes[i].on(msgs.Hello.messageType, this._welcomer)
		this.pipes[i].on(msgs.Goodbye.messageType, this._goodbyer)
	}
	return this
}
Router.prototype.open= open

function addPipe(pipe){
	this.pipes.push(pipe)
	if(this.isOpen){
		pipe.on(msgs.Hello.messageType, this._welcomer)
		pipe.on(msgs.Goodbye.messageType, this._goodbyer)
	}
	return this
}
Router.prototype.addPipe= addPipe

function welcome(hello, pipe){
	// check realm
	var realm= this.realmValidator(hello.realm)
	if(!realm)
		return this.noMatch("realm", hello, pipe)
	// compute roles
	var roles= this.roleResponder(hello.details.roles, pipe)
	if(!roles)
		return this.noMatch("role", hello, pipe)

	var details= this.details
	if(this.details instanceof Function)
		details= this.details(hello, pipe)
	details= _.merge({roles:roles}, details, pipe.details)

	var sessionId= rand(),
	  wel= new msgs.Welcome(sessionId, details)
	pipe.emit(wel)

	var session= new Session(sessionId)
	session.pipe= pipe
	session.router= this
	session.realm= realm
	session.roles= roles
	session.details= details
	session.clientDetails= hello.details
	this.sessions[sessionId]= session
	this.emit("session", session)
}
Router.prototype.welcome= welcome

function goodbye(gb, pipe){
	var reason= ""
	if(gb){
		reason= "wamp.error.goodbye_and_out"
	}
	var msg= new msgs.Goodbye({}, reason)
	pipe.emit(msg)

	var sessionId= gb&& gb.details.session
	if(sessionId){
		var session= this.sessions[sessionId]
		this.emit("close", session)
	}else{
		this.emit("close")
	}
}
Router.prototype.goodbye= goodbye

function noMatch(cause, hello, pipe){
	console.log("death",cause)
	if(!this.noAbort)
		pipe.emit(new msgs.Abort({message: cause}, "wm.error."+cause))
	this.emit("noMatch", cause, hello, pipe)
}
Router.prototype.noMatch= noMatch
