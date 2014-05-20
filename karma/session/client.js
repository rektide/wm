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
	it("Sends a valid Hello", function(){
		var channel = new MessageChannel(),
		  pipe1= new Cross(channel.port1),
		  clientSession1= ClientSession(pipe1, realm),
		  port2= channel.port2,
		  done= when.defer()

		port2.onmessage= function(msg){
			var hello= msg.data
			expect(hello).to.be.instanceof(Array)
			expect(hello).to.lengthOf(3)
			expect(hello[0]).to.equal(msgs.Hello.messageType)
			expect(hello[1]).to.equal(realm)
			expect(hello[2]).to.be.instanceOf(Object)
			expect(clientSession1.sessionId.inspect().state).to.equal("pending")
			expect(clientSession1.routerDetails.inspect().state).to.equal("pending")
			done.resolve()
		}
		expect(clientSession1.realm).to.equal(realm)
		expect(clientSession1.pipe).to.equal(pipe1)
		return chai.assert.isFulfilled(done.promise)
	})

	it("Accepts a Welcome, making a session", function(){
		var channel = new MessageChannel(),
		  pipe1= new Cross(channel.port1),
		  clientSession1= ClientSession(pipe1, realm),
		  port2= channel.port2

		port2.onmessage= function(msg){
			var hello= msg.data
			expect(hello[1]).to.equal(realm)
			var welcome= new msgs.Welcome(session,{})
			port2.postMessage(arrayWriter(welcome))
		}
		return chai.assert.becomes(clientSession1.sessionId, session)
	})
	// "{Targets the pipe,targets,noTarget} an onwelcomed"
	// "Sends details in the Hello"
	// "Gets details from the Router"
	// "Runs the context's welcome"
})
