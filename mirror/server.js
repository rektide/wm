var cc= require("cc"),
  primitives= require("primitives"),
  req= primitives.Req,
  res= Primitives.Res

module.exports= makeServer
module.exports.makeServer= makeServer
module.exports.server= Server
module.exports.Server= Server
module.exports.MessageHandler= MessageHandler
module.exports.SendCommand= [SendCommand]

function makeServer(p){
	if(!p.server)
		return p.server = new Server(p)
	return p.server
}

/**
  Server handles incoming requests on a port
*/
function Server(p){
	if(!(this instanceof Server))
		return new Server(p)
	this.__p= p
	this.__chain= new cc(module.exports.SendCommand)
	
	p.__port.addEventListener("message",module.exports.RequestHandler.bind(this))
	return this
}

function RequesetHandler(e){
	if(!e.data || !(e.data instanceof Array) || e.data[0] == "RE")
		return
	var req_= new req(e.data),
	  res_= new res(req),
	  p= this.__p, //port
	  go= this.__chain.exec({req:req_,res:res_,p:p})
}

function SendCommand(ctx){
}
SendCommand.filter= function(ctx){
	ctx.p.__port.postMessage(ctx.res.val)
}
