var config = require('./config/global.js');
var express = require('express');

express()
.use(config.global)
.use(express.vhost(config.AUTH_URL, require('./authser')))
.use(express.vhost(config.AUTHWEB_URL, require('./authweb')))
.use(express.vhost(config.PROFILE_URL, require('./profileser')))
.use(express.vhost(config.PROFILEWEB_URL, require('./profileweb')))
.listen(config.PORT,function(){
	 console.log("----------------AS READY----------------");
});