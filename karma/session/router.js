var _= require("lodash"),
  chai= require("chai"),
  chaiAsPromised= require("chai-as-promised"),
  when= require("when"),
  Cross= require("../../src/pipe/cross-document"),
  ClientSession= require("../../src/session/client"),
  Router= require("../../src/session/router")

chai.use(chaiAsPromised)

var expect= chai.expect,
  defaultRealm= "realm:routertest"

/**
  @option optRouter options to pass router
*/
function baseTest(opts){
	opts= opts|| {}
	if(typeof opts.realm == "string"){
		opts.realm= {realm:opts.realm}
	}
	var realm= {realm:opts.realm||defaultRealm}
	var channel= new MessageChannel(),
	  pipe1= new Cross(channel.port1, _.extend({}, opts.realm, opts.pipe1, opts.pipe)),
	  router1= new Router(pipe1, _.merge({}, opts.realm, opts.router1)),
	  pipe2= new Cross(channel.port2, _.merge({}, opts.realm, opts.pipe2, opts.pipe)),
	  clientSession2= new ClientSession(pipe2, _.merge({}, opts.realm, opts.client2)),
	  done= when.defer(),
	  ctx= {
		router: router1,
		clientSession: clientSession2,
		pipe1: pipe1,
		pipe2: pipe2,
		channel: channel,
		done: done.promise,
		session: function(session){
			done.resolve(session)
		}
	  }
	if(!opts.noOnSession)
		router1.on("session", ctx.session)
	return ctx
}

describe("Router", function(){
	it("Welcomes", function(){
		var t= baseTest()
		expect(t.router.pipes).to.deep.equal([t.pipe1])
		expect(t.clientSession.pipe).to.deep.equal(t.pipe2)
		expect(t.clientSession.sessionId).to.eventually.equal(t.done)
		return t.done.then(function(session){
			expect(session.realm).to.be.undefined
			expect(session.pipe).to.equal(t.pipe1)
			expect(session.router).to.equal(t.router)
			expect(session).to.equal(t.router.sessions[session.id])
		})
	})
	it("Tests a realm", function(){
		var t= baseTest({realm:defaultRealm+"2"})
		return t.done.then(function(session){
			expect(session.realm).to.equal(defaultRealm+"2")
		})
	})
	it("Insures a role", function(){
		//var ctx= baseTest({})
	})
})
