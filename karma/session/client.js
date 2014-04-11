var chai= require("chai"),
  chaiAsPromised= require("chai-as-promised"),
  when= require("when"),
  msgs= require("../../src/wamp/msgs"),
  Cross= require("../../src/pipe/cross-document"),
  ClientSession= require("../../src/session/client"),
  arrayWriter= require("../../src/wamp/array-writer")

chai.use(chaiAsPromised)

var expect= chai.expect,
  realm= "realm:basic",
  session= "0xa7a7a8"

describe("ClientSession", function(){
	it("Sends a Hello", function(){
		var channel = new MessageChannel(),
		  pipe= new Cross(channel.port1),
		  clientSession= ClientSession(pipe, realm),
		  port2= channel.port2,
		  done= when.defer()

		port2.onmessage= function(msg){
			var hello= msg.data
			expect(hello).to.be.instanceof(Array)
			expect(hello[0]).to.equal(msgs.Hello.messageType)
			expect(hello[1]).to.equal(realm)
			expect(clientSession.sessionId.inspect().state).to.equal("pending")
			expect(clientSession.serverDetails.inspect().state).to.equal("pending")
			done.resolve()
		}
		expect(clientSession.realm).to.equal(realm)
		expect(clientSession.pipe).to.equal(pipe)
		return chai.assert.isFulfilled(done.promise)
	})
	it("Accepts a Welcome, making a session", function(){
		var channel = new MessageChannel(),
		  pipe= new Cross(channel.port1),
		  clientSession= ClientSession(pipe, realm),
		  port2= channel.port2

		port2.onmessage= function(msg){
			var hello= msg.data
			expect(hello[1]).to.equal(realm)
			var welcome= new msgs.Welcome(session,{})
			port2.postMessage(arrayWriter(welcome))
		}
		return chai.assert.becomes(clientSession.sessionId, session)
	})
})
