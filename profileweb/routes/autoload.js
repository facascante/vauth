var version = {};
version.v1 = {
		routes : require('./v1/_user.js')
}
version.v2 = {
		routes : require('./v2/_user.js')
}

module.exports = {
	verify : function(req,res,next){

		var instance = version[req.params.version];
		if(!(typeof instance == 'undefined')){
			instance.routes.verify(req,res);
		}
		else{
			res.json(404,{message:"Invalid"});
		}
	},
	register : function(req,res,next){
		
		var instance = version[req.params.version];
		if(!(typeof instance == 'undefined')){
			instance.routes.register(req,res);
		}
		else{
			res.json(404,{message:"Invalid"});
		}
	}

};