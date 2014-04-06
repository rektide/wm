function Hello(){
	this.messageType= 1
}
module.exports.Hello= Hello
Hello.messageType= 1
Hello.fields= ["realm","details"]
Hello.fieldTypes= ["uri","dict"]

function Welcome(){
	this.messageType= 2
}
module.exports.Welcome= Welcome
Welcome.messageType= 2
Welcome.fields= ["session","details"]
Welcome.fieldtypes= ["id","dict"]

function Abort(){
	this.messageType= 3
}
module.exports.Abort= Abort
Abort.messageType= 3
Abort.fields= ["details","reason"]
Abort.fieldTypes= ["dict","uri"]

function Challenge(){
	this.messageType= 4
}
module.exports.Challenge= Challenge
Challenge.messageType= 4
Challenge.fields= ["challenge","extra"]
Challenge.fieldTypes= ["string","dict"]
Challenge.advanced= true

function Authenticate(){
	this.messageType= 5
}
module.exports.Authenticate= Authenticate
Authenticate.messageType= 5
Authenticate.fields= ["signature","extra"]
Authenticate.fieldTypes= ["string","dict"]
Authenticate.advanced= true

function Goodbye(){
	this.messageType= 6
}
module.exports.Goodbye= Goodbye
Goodbye.messageType= 6
Goodbye.fields= ["details","reason"]
Goodbye.fieldTypes= ["dict","uri"]

function Heartbeat(){
	this.messageType= 7
}
module.exports.Heartbeat= Heartbeat
Heartbeat.messageType= 7
Heartbeat.fields= ["incomignSeq","outgoingSeq"]
Heartbeat.fieldTypes= ["number","number"]
Heartbeat.advanced= true

function WampError(){
	this.messageType= 8
}
module.exports.WampError= WampError
WampError.msgtype= 8
WampError.fields= ["requestType","requestId","details","error"]
WampError.fieldTypes= ["number","id","dict","uri"]
WampError.vargs= true



function Publish(){
	this.messageType= 16
}
module.exports.Publish= Publish
Publish.messageType= 16
Publish.fields= ["request","options","topic"]
Publish.fieldTypes= ["id","dict","uri"]
Publish.vargs= true

function Published(){
	this.messageType= 17
}
module.exports.Published= Published
Published.messageType= 17
Published.fields= ["publishId","publication"]
Published.fieldTypes= ["id","id"]



function Subscribe(){
	this.messageType= 32
}
module.exports.Subscribe= Subscribe
Subscribe.messageType= 32
Subscribe.fields= ["request","options","topic"]
Subscribe.fieldTypes= ["number","dict","uri"]

function Subscribed(){
	this.messageType= 33
}
module.exports.Subscribed= Subscribed
Subscribed.messageType= 33
Subscribed.fields= ["subscribeId","subscription"]
Subscribed.fieldTypes= ["id","id"]

function Unsubscribe(){
	this.messageType= 34
}
module.exports.Unsubscribe= Unsubscribe
Unsubscribe.messageType= 34
Unsubscribe.fields= ["request","subscriptionId"]
Unsubscribe.fieldTypes= ["id","id"]

function Unsubscribed(){
	this.messageType= 35
}
module.exports.Unsubscribed= Unsubscribed
Unsubscribed.messageType= 35
Unsubscribed.fields= ["unsubscribeId"]
Unsubscribed.fieldTypes= ["id"]

function WampEvent(){
	this.messageType= 36
}
module.exports.WampEvent= WampEvent
WampEvent.messageType= 36
WampEvent.fields= ["subscriptionId","publicationId","details"]
WampEvent.fieldTypes= ["id","id","dict"]
WampEvent.vargs= true



function Call(){
	this.messageType= 48
}
module.exports.Call= Call
Call.messageType= 48
Call.fields= ["request","options","procedure"]
Call.fieldTypes= ["id","dict","uri"]
Call.vargs= true

function Cancel(){
	this.messageType= 49
}
module.exports.Cancel= Cancel
Cancel.messageType= 49
Cancel.fields= ["callId","options"]
Cancel.fieldTypes= ["id","dict"]
Cancel.advanced= true

function Result(){
	this.messageType= 50
}
module.exports.Result= Result
Result.messageType= 50
Result.fields= ["callId","details"]
Result.fieldTypes= ["id","dict"]
Result.vargs= true



function Register(){
	this.messageType= 64
}
module.exports.Register= Register
Register.messageType= 64
Register.fields= ["request","options","procedure"]
Register.fieldTypes= ["id","dict","uri"]

function Registered(){
	this.messageType= 65
}
module.exports.Registered= Registered
Registered.messageType= 65
Registered.fields= ["request","registration"]
Registered.fieldTypes= ["id","id"]

function Unregister(){
	this.messageType= 66
}
module.exports.Unregister= Unregister
Unregister.messageType= 66
Unregister.fields= ["request","registrationId"]
Unregister.fieldTypes= ["id","id"]

function Unregistered(){
	this.messageType= 67
}
module.exports.Unregistered= Unregistered
Unregistered.messageType= 67
Unregistered.fields= ["unregisterId"]
Unregistered.fieldTypes= ["id"]

function Invocation(){
	this.messageType= 68
}
module.exports.Invocation= Invocation
Invocation.messageType= 68
Invocation.fields= ["request","registrationId","details"]
Invocation.fieldTypes= ["id","id","dict"]
Invocation.vargs= true

function Interrupt(){
	this.messageType= 69
}
module.exports.Interrupt= Interrupt
Interrupt.messageType= 69
Interrupt.fields= ["invocationId","options"]
Interrupt.fieldTypes= ["id","dict"]
Interrupt.advanced= true

function Yield(){
	this.messageType= 70
}
module.exports.Yield= Yield
Yield.messageType= 70
Yield.fields= ["invocationId","options"]
Yield.fieldTypes= ["id","dict"]
Yield.vargs= true
