var version = {};
version.v1 = {
		routes : require('./v1/_user.js'),
		models : require('./v1/_model.js'),
}
version.v2 = {
		routes : require('./v2/_user.js'),
		models : require('./v2/_model.js'),
}

module.exports = {
	verify : function(req,res,next){

		if(!(typeof version[req.params.version] == 'undefined')){
			version[req.params.version].routes.verify(req,res,version[req.params.version].models);
		}
		else{
			res.json(404,{message:"Invalid"});
		}
	},
	register : function(req,res,next){
		if(!(typeof version[req.params.version] == 'undefined')){
			version[req.params.version].routes.register(req,res,version[req.params.version].models);
		}
		else{
			res.json(404,{message:"Invalid"});
		}
	}

};