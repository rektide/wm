var cc= require("cc")

module.exports= Server
module.exports.server= Server
module.exports.Server= Server

var primitives= require("primitives"),
  req= primitives.PromiseRequest,
  res= Primitives.PromiseResponse

function Server(p){
	if(!(this instanceof HHGI))
		return new HHGI(p)
	this.p= p
	this.chain= new cc()

	p.addEventListener("message",function(e){
		if(!e.data || !(e.data instanceof Array) || e.data[0] == "RE")
			return
		var req_= new req(e.data),
		  res_= new res(),
		  p= this.p, //port
		  go= this.chain.exec({req:req_,res:res_,port:p})
	}.bind(this))
	return this
}
