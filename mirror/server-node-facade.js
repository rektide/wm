var primitives= require("../primitives")

module.exports= ServerNodeFacade
module.exports.ServerNodeFacade= ServerNodeFacade

/**
  ServerNodeFacade wraps a Server context, adorning it's res objects with a variety of Node.js alike interfaces. However,
  the semantics of wm are very different, and many things are expected to never work alike: wm is a packet protocol where
  the Node interface is streaming.

  On the other hand, trailers work great. :)
*/
function ServerNodeFacade(ctx){
	for(var in ResponseNodeFacade){
		ctx.res[i]= ResponseNodeFacade[i]
	}
	Object.defineProperty(ctx.res,"statusCode",primitives.accessor.bind(ctx.res,primitives.defaultResponse))
	Object.defineProperty(ctx.res,"headersSent",{
		get:function(){
			return this.state !== undefined  && this.state !== "headers"
	}}
	Object.defineProperty(ctx.res,"sendDate",{
		get:function(){
			return this.appendDate===undefined? False: this.appendDate
		},
		set:function(val){
			this.appendDate= !!val
	}}
}

// statusCode, headersSent, sendDate, property

RepsonseNodeFacade= {
	writeContinue: function(){
		this.status= 100
		this.state= "done"
	},
	writeHead: function(status,reasonPhrase,headers){
		if(status !== undefined){
			this.status= status
		}
		if(typeof reasonPhrase == "object" && headers === undefined){
			headers= reasonPhrase
			reasonPhrase= undefined
		}
		if(this.headers !== undefined){
			this.headers= headers
		}
		this.state= "body"
	},
	setTimeout: function(msec,cb){
	},
	setHeader: function(name,val){
		var have= this.headers[name],
		  isHaveArr= !(have instanceof Array)
		this.headers[name]= isHaveArr? have.concat(val): (have? [have].concat(val): val)
	},
	getHeader: primitives.Res.getResponseHeader,
	removeHeader: function(name){
		delete this.headers[name]
	},
	write: function(chunk, encoding){ // usually we want to message in objects, hopefully this isn't really used.
		this.state= "body"
		this.responseType= "blob"
		this.response= (this.response||"")+chunk // todo: encodings?
	},
	addTrailers: function(headers){
		for(var i in headers){
			this.setHeader(i,headers[i])
		}
	},
	end: function(data,encoding){
		if(data)
			this.write(data,encoding)
		this.state= "done"
		if(this.emit)
			this.emit("finish")
	}
}

