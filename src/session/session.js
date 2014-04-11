var util= require("util"),
  Base= require("../base")

module.exports= Session
module.exports.Session= Session

function Session(sessionId){
	this.sessionId= sessionId
}
util.inherits(Session, Base)
