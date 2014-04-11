module.exports= rand
module.exports.rand= rand

var max= Math.pow(2,53)

function rand(){
	return Math.floor(Math.random()*max)
}
