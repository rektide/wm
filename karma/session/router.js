var chai= require("chai"),
  chaiAsPromised= require("chai-as-promised"),
  when= require("when"),
  Cross= require("../../src/pipe/cross-document"),
  ClientSession= require("../../src/session/client"),
  Router= require("../../src/session/router")

chai.use(chaiAsPromised)

var expect= chai.expect,
  realm= "realm:routertest"

/**
  @option optRouter options to pass router
*/
function baseTest(opts){
	var realm= {realm:opts.realm||realm}
	var channel= new MessageChannel(),
	  pipe1= new Cross(channel.port, _.extend({}, realm, opts.pipe1, opts.pipe, opts.realmExtra),
	  router1= new Router(pipe1, _.merge({}, opts.routerExtra)
	  pipe2= new Cross(channel.port2, _.merge({}, opts.pipe2, opts.pipe, opts.),
	  clientSession2= new ClientSession(pipe2, realm)
	  done= when.defer()
	  ctx= {
		router1: router1,
		clientSession2, clientSession2
		pipe1: piep1,
		pipe2: pipe2,
		channel: channel,
		done: done,
		session: function(session){
			done.resolve(session)
		}
	  }
	if(!opts.noOnSession)
		router2.on("session", ctx.session)
	return ctx
}

describe("Router", function(){
	it("Welcomes", function(){
		test({optRouter:{realm:realm}})
	})
	it("Insures a role", function(){
		test({optRouter:{
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
