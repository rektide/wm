var events= require("events"),
  util= require("util"),
  _= require("lodash"),
  when= require("when"),
  Base= require("../base"),
  Session= require("./session"),
  msgs= require("../wamp/msgs")

module.exports= ClientSession
module.exports.ClientSession= ClientSession
module.exports.defaultRealm= ""

/**
  ClientSession commences a client connection on a pipe, issuing a Hello message and
    establishing a session with the first resulting Welcome

  @param pipe (required) the pipe to make the ClientSession on (required, explicit or named)
  @param opts (optional) extra named parameters, as below
  @param realm (optional) realm to initiate Hello for
  @param details (optional) optional details to past in the Hello message
  @param roles (optional) roles to Hello as
  @param noTarget (optional) do not target the pipe: be own event-source
  @property sessionId a promise of the found sessionId
  @property routerDetails a promise of the resolved details from the Router
*/
function ClientSession(pipe, realm, opts){
	if(!(this instanceof ClientSession || this instanceof events)){
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

	var self= this
	self= ClientSession.super_.call(self, opts)
	Base.go(self, opts, ClientSession)
	return self
}
util.inherits(ClientSession, Session)

var baseProto= ClientSession.super_.prototype

function prefs(opts){
	baseProto.prefs.call(this, opts)
	this.pipe= opts.pipe
	this.realm= opts.realm|| module.exports.defaultRealm

	var roles= opts.roles|| (opts.details&& opts.details.roles)|| {caller:{}},
	  details= opts.details
	if(details instanceof Function)
		details= details.call(this, opts)
	this.details= _.extend({roles:roles}, this.pipe.details, details)

	this._sessionId= when.defer()
	this.sessionId= this._sessionId.promise
	this._routerDetails= when.defer()
	this.routerDetails= this._routerDetails.promise
	var self= this
	function welcomed(welcome){
		self._sessionId.resolve(welcome.session)
		self._routerDetails.resolve(welcome.details)
		delete self._sessionId
		delete self.routerDetails
		// TODO: switch to event-based notification (edge-triggered eventing, syndication)
		//self.target.emit("welcomed", self)
	}
	this.welcomed= welcomed
}
ClientSession.prototype.prefs= prefs

function open(){
	this.pipe.once(msgs.Welcome.messageType, this.welcomed)
	// TODO: a multiplexing helloId in details
	var hello= new msgs.Hello(this.realm, this.details)
	this.pipe.emit(hello)
	baseProto.open.call(this)
}
ClientSession.prototype.open= open
