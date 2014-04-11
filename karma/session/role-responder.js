var chai= require("chai"),
  RoleResponder= require("../../src/session/role-responder")

var expect= chai.expect

describe("RoleResponder", function(){
	it("Passes a basic this.rolesMandatory", function(){
		var base= {roleResponder:RoleResponder,
			rolesMandatory: ["must"]}
		expect(base.roleResponder(["must"]).to.equal(true)
	})
	it("Passes a basic passed in rolesMandatory", function(){
		var base= {roleResponder:RoleResponder}
		expect(base.roleResponder(["must"],["must"]).to.equal(true)
	})
	it("Can pass mixed roleMandatories", function(){
		var base= {roleResponder:RoleResponder,
			roleMandatory: ["good"]}
		expect(base.roleResponder(["must","good"],["must"]).to.equal(true)
	})
	it("Can fail a basic this.rolesMandatory", function(){
		var base= {roleResponder:RoleResponder,
			rolesMandatory: ["must","bad"]}
		expect(base.roleResponder(["bad"]).to.equal(false)
	})
	it("Can fail a basic passed in rolesMandatory", function(){
		var base= {roleResponder:RoleResponder}
		expect(base.roleResponder(["bad"],["bad","must"]).to.equal(false)
	})
	it("Can fail a mixed roleMandatories", function(){
		var base= {roleResponder:RoleResponder,
			roleMandatory: ["good","nice"]}
		expect(base.roleResponder(["must","good"],["must"]).to.equal(false)
	})
})
