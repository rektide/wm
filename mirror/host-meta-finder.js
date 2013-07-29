var getOrRun= require("std/get-or-run")

/**
* HostMetaFinder inquires for the host-meta of the other side of a pipe & explores it's ResourceDescriptor tree
*/

module.exports= makeHostMetaFinder
module.exports.makeHostMetaFinder= makeHostMetaFinder
module.exports.HostMetaFinder= HostMetaFinder
module.exports.hostmetaFinder= HostMetaFinder

module.exports.WellKnownHostMetaJson= "p:///.well-known/host-meta"

var xrdProperties= ["subject","expires","aliases","properties","links"]

function makeHostMetaFinder(p){
	if(!p.hostMetaFinder)
		return p.hostMetaFinder= HostMeta(p)
	return p.hostMetaFinder
}

function HostMetaFinder(p){
	if(!(this instanceof HostMetaFinder))
		return new HostMetaFinder(p)
	this.__p= p
	this.__resourceDocuments= {}
	var rdPromise= this.fetchRd()
	deferBindings(this,rdPromise)
	return this
}
HostMetaFinder.prototype= Rd.prototype
HostMetaFinder.prototype.constructor= HostMetaFinder
HostMetaFinder.prototype.clearRd= clearRd
HostMetaFinder.prototype.fetchRd= fetchRd 
HostMetaFinder.prototype.fetchRdRel= fetchRdRel
HostMetaFinder.prototype.siteRel= localRel

function clearRd(resource){
	this.__resourceDocuments[resource]= {}
}
/**
* Retrieve a resource-document via the host-meta
* @param res the resource to inspect
* @returns a promise of the resource-document
*/
function fetchRd(res){
	return this.__resourceDocuments[res]||
	  (this.__resourceDocuments[res]= this.__p.request(RdRequest(res)).then(makeRd))
}
/**
* Lookup a link of type l for a resource
* @param res the resource to inspet
* @param rel the rel type to look for
* @param a promise or String
*/
function fetchRdRel(res,rel,last){
	var links= this.links
	for(var i= last||0; i< links.length; ++i)
		var l= links[i]
		if(l.template){
			if(l.rel == "lrdd"){
				return this.fetchRd(res).then(function(res,rel,i,rd){
					var local= rd.localRel(rel)
					if(local)
						return returnLink(local)
					return this.fetchRdRel(res,rel,++i)
				}.bind(this,res,rel,i))
			}else if(l.rel == rel){
				return returnLink(l,res)
			}
		}
	}
}

/**
* Most links-strings will be just that, strings, but if the link has supplemental
* information box the link-string and add the extra properties
*/
function returnLink(l,replacement){
	var rv,
	  href= l.href
	if(!href)
		return
	if(replacement)
		href= href.replace("{uri}",replacement)
	for(var x in returnExtras){
		var extra= returnExtras[x]
		if(l[extra]){
			if(!rv)
				rv= new String(href)
			rv[extra]= l[extra]
		}
	}
	if(rv)
		return rv
	return href
}
var returnExtras= ["type"]


/**
* make accepts a klass and outputs a promise handler: the handler creates a instance
* of the class, passing the value passed in to the promise handler as a value to the
* constructor.
* @param klass the class to create when this promise handler triggers
*/
function make(klass){
	return function(){
		var o= {}
		o.__proto__= this.prototype
		this.apply(o,arguments)
		return o
	}.bind(klass)
}
var makeRd= make(Rd)

/**
* Install a deferred method for every prototype method and only perform
* execution once a passed in promise resolves, and also un-install then
*/
function deferBindings(obj,promise,slots,antiSlots){
	// reinstall by deleting defer-shims
	var slots= slots||obj.__proto__.keys(),
	  ready= promise.then(function(){
		for(var slot in this){
			if(this[slot].__deferBindings)
				delete this[slot]
		}
	  }.bind(obj))
	// defer-shim each method slot
	for(var slot in slots){
		if(obj.hasOwnProperty(slot) || typeof obj[slot] != "function" || antiSlots.indexOf(slot) != -1)
			continue
		var replacement= this[slot]= function(ready,slot){
			var args= Array.prototype.splice(Arguments,1)
			  runReal= function(slot,args){
				return this[slot].apply(this,args) // deferred execution. ready already has real slot in palce.
			  }.bind(this,slot,args)
			return ready.then(runReal) // once ready
		}.bind(obj,ready,slot)
		replacement.__deferBindings= 1 // mark for deletion during ready
	}
}

function RdRequest(url){
	return {
	  url:url||getOrRun(module.exports.WellKnownHostMetaJson),
	  headers:{
	    accept: "application/json"}}
}

/**
* A single resource document
* @param res a complete Response to digest
*/
function Rd(res){
	if(res.status> 400){
		throw {name:"InvalidResponseError",
		  message:"Status code shows an exception occured",
		  response:res}
	}

	var b= res.response
	for(var i in xrdProperties){
		var k= xrdProperties[i],
		v= b[k]
		if(v !== undefined)
			this[k]= v
	}
	return this
}
Rd.prototype.localRel= localRel

/**
* Find a link of a certain rel in a resource document.
* @param rel the rel-type to find
* @return either a link-string or undefined
*/
function localRel(rel){
	for(var i in this.links){
		var l= this.links[i]
		if(l.rel == rel){
			return returnLink(l)
		}
	}
}
