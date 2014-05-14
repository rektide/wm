var events= require("events"),
  util= require("util")

var _emit= events.EventEmitter.prototype.emit

module.exports= Base
module.exports.Base= Base

/**
  Base is a convention for a two stage constructor that initializes itself
  and then opens itself (unless the "noOpen" option is passed to the constructor).

  Beyond the "open" auto-call, implementing constructors also by convention accept
  a trailing "options" object. The options ought pass through to parent constructors.

  @param target (optional) an EventTarget to specify output to
  @param direct (optional) not implemented, tell sub-constructors that they should bind their data to the primary method
*/
function Base(opts){
	if(!(this instanceof Base)){
		return new Base(opts)
	}

	Base.super_.call(this)
	Base.go(this, opts, Base)
}
util.inherits(Base, events.EventEmitter)

// TODO: eliminate, this is just the constructor
function prefs(opts){
	if(opts){
		this.target= opts.target|| this
		if(this.noOpen)
			this.noOpen= true
		if(this.direct)
			throw "Direct not implemented"
	}else{
		this.target= this
	}
}
Base.prototype.prefs= prefs

function open(){
	if(this.isOpen){
		throw "already open"
	}
	this.isOpen= true
	return this
}
Base.prototype.open= open

function emit(e, msg){
	return _emit.call(this.target, e, msg, this)
}
Base.prototype.emit= emit

function go(o, opts, proto){
	if(proto && Object.getPrototypeOf(o).constructor != proto){
		return
	}
	o.prefs(opts)
	if(!o.noOpen)
		o.open()
}
Base.go= go

Base.targetMessage= function(self, msgName){
	return function(o){
		self[msgName].call(self.target, o)
	}
}
