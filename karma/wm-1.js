var assert= require("assert"),
  w= new Worker("./worker/echo"),
  p= require("../p")(w)

var i = 1
p.on("request", function(req,res){
	res.on("data",function(data){
		assert.equals(data,"pong")
		assert.equals(--i, 0)
	})
})

p.request({"url":"p:///echo", "data": "ping"})
