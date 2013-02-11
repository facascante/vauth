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

		var instance = version[req.params.version];
		if(!(typeof instance == 'undefined')){
			instance.routes.verify(req,res,instance.models);
		}
		else{
			res.json(404,{message:"Invalid"});
		}
	},
	register : function(req,res,next){
		
		var instance = version[req.params.version];
		if(!(typeof instance == 'undefined')){
			instance.routes.register(req,res,instance.models);
		}
		else{
			res.json(404,{message:"Invalid"});
		}
	}

};