var chai= require("chai"),
  chaiAsPromised= require("chai-as-promised"),
  when= require("when"),
  msgs= require("../src/wamp/msgs"),
  cross= require("../src/pipe/cross-document")

chai.use(chaiAsPromised)

var realm= "realm:basic"

describe('basic message sending', function() {

	it('should send a message', function() {
		var channel= new MessageChannel(),
		  pipe= new cross(channel.port1, {origin:null}),
		  run= 1,
		  done= when.defer()

		channel.port2.onmessage= function(msg){
			chai.expect(--run).to.equal(0)
			chai.expect(msg.data[0]).to.equal(2)
			chai.expect(msg.data[1]).to.equal("realm:basic")
			done.resolve()
		}

		var welcome= new msgs.Welcome(realm, pipe.details)
		pipe.emit(welcome)
		return done.promise
	})
})
