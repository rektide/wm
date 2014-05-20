var chai= require("chai"),
  chaiAsPromised= require("chai-as-promised"),
  when= require("when"),
  msgs= require("../../src/wamp/msgs"),
  cross= require("../../src/pipe/cross-document"),
  arrayWriter= require("../../src/wamp/array-writer")

chai.use(chaiAsPromised)

var expect= chai.expect,
  realm= "realm:basic"

describe("CrossDocumentPipe sending", function(){
	var channel= new MessageChannel(),
	  pipe= new cross(channel.port1),
	  port2= channel.port2,
	  done= when.defer()

	it("should be able to send a Hello", function(){
		var run= 1
		port2.onmessage= function(msg){
			expect(--run).to.equal(0)
			expect(msg.data[0]).to.equal(msgs.Hello.messageType)
			expect(msg.data[1]).to.equal(realm)
			done.resolve()
		}

		//var hello= new msgs.Hello(realm, pipe.details)
		//pipe.emit(hello)
		//return done.promise
	})
})

describe("CrossDocumentPipe receiving", function(){
/*
	var channel= new MessageChannel(),
	  pipe= new cross(channel.port1),
	  port2= channel.port2,
	  done= when.defer()

	it("should be able to receive a Hello", function(){
		var run= 1
		pipe.on(msgs.Hello.messageType, function(msg){
			chai.expect(--run).to.equal(0)
			expect(msg).to.be.instanceof(msgs.Hello)
			expect(msg.realm).to.equal(realm)
			done.resolve()
		})

		var hello= new msgs.Hello(realm, pipe.details)
		port2.postMessage(arrayWriter(hello))
		return done.promise
	})
*/
})
