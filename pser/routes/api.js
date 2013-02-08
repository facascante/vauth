var version = {};
version.v1 = require('./v1/user.js');
version.v2 = require('./v2/user.js');

module.exports = {
	verify : function(req,res,next){
		version[req.params.version].verify(req,res);
	},
	register : function(req,res,next){
		version[req.params.version].register(req,res);
	}

};