var msgs= require("./msgs")

for(var i in msgs){
	var msg= msgs[i]
	module.exports[msg.messageType]= msg
}
