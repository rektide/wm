var util= require("util"),
  Base= require("../base")

module.exports= Session
module.exports.Session= Session

function Session(sessionId){
	this.sessionId= sessionId

	return this
}
util.inherits(Session, Base)
