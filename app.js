
var express = require('express');

express()
.use(express.vhost('localhost', require('./pser')))
.listen(8080,function(){
	 console.log("----------------AS READY----------------");
});
