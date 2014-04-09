module.exports.accessor= accessor
function accessor(a,opts){
	opts= opts||{}
	var enumerable= opts.enumerable!==false,
	  configurable= opts.configurable!==false,
	  set= opts.set!==false
	  o= {get:Function("return this"+a),
		        set:Function("o","this"+a+"= o"),
		        enumerable:enumerable, configurable:configurable}
	if(!set)
		delete o.set
	return o
}

module.exports.biset= biset
function biset(val,key){
	this[key]= val
	this[val]= key
}

module.exports.bisetAll= bisetAll
function bisetAll(o){
	if(o instanceof Array){
		o.forEach(biset, o)
	}
	for(var i in o){
		biset.call(o,o[i],i)
	}
	return o
}

module.exports.rand= rand
module.exports._minPipe= 0
module.exports._stridePipe= Math.pow(2,52)-1
function rand(min,stride){
	min= min|| module.exports._minPipe
	stride= stride|| module.exports._stridePipe
	return Math.floor(Math.random()*stride)+min
}

module.exports.namePropExpand= namePropExpand
function namePropExpand(slots){
	var res= []
	for(var i= 0; i< slots.length; ++i){
		res.push({name:slots[i],a:accessor("["+i+"]")})
	}
	return res
}

module.exports.nop= nop
function nop(){}

module.exports.empty= empty
function empty(){
	return {}
}
