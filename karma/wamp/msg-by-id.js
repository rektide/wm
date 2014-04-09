var chai= require("chai"),
  msgs= require("../../src/wamp/msgs"),
  byId= require("../../src/wamp/msgs-by-id")

var expect= chai.expect

describe("MsgsById", function(){
	it("should have 1: Hello", function(){
		expect(byId[1]).to.equal(msgs.Hello)
	})
	it("should have 2: Welcome", function(){
		expect(byId[2]).to.equal(msgs.Welcome)
	})
})
