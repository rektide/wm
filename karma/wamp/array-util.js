var chai= require("chai"),
  msgs= require("../../src/wamp/msgs"),
  arrayReader= require("../../src/wamp/array-reader"),
  arrayWriter= require("../../src/wamp/array-writer")

var expect= chai.expect,
  realm= "realm:basic"

describe("ArrayReader deserialization", function(){
	it("should read a Hello", function(){
		var hello= arrayReader([1,realm,{}])
		expect(hello).to.be.instanceof(msgs.Hello)
		expect(hello.realm).to.equal(realm)
	})
})

describe("ArrayWriter serialization", function(){
	it("should write a Hello", function(){
		var hello= new msgs.Hello(realm, {}),
		  arr= arrayWriter(hello)
		expect(arr).to.be.instanceof(Array)
		expect(arr[0]).to.equal(msgs.Hello.messageType)
		expect(arr[1]).to.equal(realm)
	})
})
