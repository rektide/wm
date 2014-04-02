self.onmessage = function(e) {
	self.postMessage(e == "ping"? "pong": e)
}
