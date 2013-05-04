/**
* finder inquires for the host-meta of the other side of a pipe & explores it's ResourceDescriptor tree
*/

module.exports=finder
module.exports.HostMeta= HostMeta

var xrdProperties= ["subject","expires","aliases","properties",links]

function finder(p){
	p.rdHostMeta= HostMeta(p)
}

function HostMeta(p){
	this.__p= p
	this.__resourceDocuments= {}
	this.__proto__= Rd.prototype
	var rdPromise= p
	  .request(RdRequest(url))
	  .then(Rd.bind(this))
	deferBindings(this,rdPromise)
}
HostMeta.prototype.clearRd= clearRd
HostMeta.prototype.fetchRd= fetchRd 
HostMeta.prototype.resourceRel= resourceRel
HostMeta.prototype.siteRel= localRel

function clearRd(resource){
	this.__resourceDocuments[resource]= null
}
/**
* Retrieve a resource-document via the host-meta
* @param res the resource to inspect
* @returns a promise of the resource-document
*/
function fetchRd(res){
	return this.__resourceDocuments[res]||
	  (this.__resourceDocuments[res]=this.request(RdRequest(res)).then(makeRd)
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
				return hm.fetchRd(res).then(function(res,rel,i,rd){
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
function deferBindings(obj,promise,slots){
	// defer bindings
	var slots= slots||obj.__proto__.keys()
	for(var slot in slots){
		if(obj.hasOwnProperty(slot) || typeof obj[slot] != Function)
			continue
		var replacement= this[slot]= function(slot){
			return this.then(function(slot,args){
				return this[slot].apply(this,args)
			}.bind(this,slot,Array.prototype.splice(arguments,1))
		}.bind(promise,slot)
		replacement.__deferBindings= 1
	}
	promise.then(function(){
		for(var slot in this){
			if(this[slot].__deferBindings)
				delete this[slot]
		}
	}.bind(this))
}

function RdRequest(url){
	return {
	  url:url,
	  headers:{
	    accept: "application/json"}}
}

/**
* A single resource document
* @param res a complete Response to digest
*/
function Rd(res){
	if(res.status> 400){
		throw{name:"InvalidResponseError",
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
