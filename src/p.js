var _= require("lodash"),
  XMLHttpRequest= require("./browser/xhr"),
  request= require("./node/request"),
  createServer= require("./session/createServer")

module.exports= p
module.exports.p= p

/**
* p extends a port with request/response semantics
*/
function p(opts, port){
	if(!(this instanceof p)){
		return new p(opts, port)
	}
	if(opts && port === undefined && !opts.port){
		port= opts
		opts= {}
	};

	_.extend(this, opts)
	this.port= port;
	return this
}

p.prototype.XMLHttpRequest= XMLHttpRequest
p.prototype.request= request
p.prototype.createServer= createServer
