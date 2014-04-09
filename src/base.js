var events= require("events"),
  util= require("util")

var _emit= events.EventEmitter.prototype.emit

module.exports= Base
module.exports.Base= Base

function Base(opts){
	if(!(this instanceof Base)){
		return new Base(opts)
	}

	Base.super_.call(this)
	Base.go(this, opts, Base)
}
util.inherits(Base, events.EventEmitter)

function prefs(opts){
	if(opts){
		this.target= opts.target
		if(this.noOpen)
			this.noOpen= true
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


