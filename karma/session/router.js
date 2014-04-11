var chai= require("chai"),
  chaiAsPromised= require("chai-as-promised"),
  when= require("when"),
  Cross= require("../../src/pipe/cross-document"),
  ClientSession= require("../../src/session/client"),
  Router= require("../../src/session/router")

chai.use(chaiAsPromised)

var expect= chai.expect,
  realm= "realm:routertest"

describe("Router", function(){
	it("Welcomes", function(){
		var channel= new MessageChannel(),
		  pipe1= new Cross(channel.port1),
		  clientSession= new ClientSession(pipe1, realm)
		  pipe2= new Cross(channel.port2),
		  router= new Router(pipe2, {realm:realm}),
		  done= when.defer()
		router.on("session", function(session){
			done.resolve()
		})
		return done.promise
	})
})
