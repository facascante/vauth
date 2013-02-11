var global = require('../../config/global.js');
var local = require('../config/local.js');
var restler = require('restler');
module.exports = {

	Register : function(req,res){
		var content = {};
		content.page_no = 1;
		content.title = 'SmartNet: Create New Account';
		content.accounts_url = 'http://'+global.AUTHWEB_URL+':'+global.PORT+'/dialogs/auth';
		var info = {};	
		var errors = {};
		if(req.method == "POST"){
			content.page_no = parseInt(req.body.btnnav);
			var cookie = JSON.parse(req.cookies.registration || "{}")
			info.first_name = req.body.first_name || cookie.first_name;
			info.last_name = req.body.last_name || cookie.last_name;
			info.username = req.body.username || cookie.username;
			info.password = req.body.password || cookie.password;
			info.sec_q = req.body.sec_q || cookie.sec_q;
			info.sec_a = req.body.sec_a || cookie.sec_a;
			info.email = req.body.email || cookie.email;
			info.mobile_number = req.body.mobile_number || cookie.mobile_number;
			res.cookie('registration',JSON.stringify(info));
			
			switch(content.page_no){
				case 2 : 
					req.assert('first_name', local.ERROR_MESSAGES.first_name).notEmpty();
					req.assert('last_name', local.ERROR_MESSAGES.last_name).notEmpty();
					req.assert('username', local.ERROR_MESSAGES.username).len(5,200);
					req.assert('password', local.ERROR_MESSAGES.password).len(6,200);
					req.assert('repassword', local.ERROR_MESSAGES.repassword).equals(req.body.password);
					
					info.first_name = req.body.first_name;
					info.last_name = req.body.last_name;
					info.username = req.body.username;
					info.password = req.body.password;
				break;
				case 3 :
					req.assert('sec_q', local.ERROR_MESSAGES.sec_q).notEmpty();
					req.assert('sec_a', local.ERROR_MESSAGES.sec_q).notEmpty(); 
					
					info.sec_q = req.body.sec_q;
					info.sec_a = req.body.sec_a;
				break;
				case 4 :
					if(!req.body.mobile_number){
						req.assert('email', local.ERROR_MESSAGES.email).isEmail();
					}
					if(!req.body.email){
						req.assert('mobile_number', local.ERROR_MESSAGES.mobile_number).len(10,13);
					}
					req.assert('tcagree', local.ERROR_MESSAGES.tcagree).notEmpty(); 
					
					info.email = req.body.email;
					info.mobile_number = req.body.mobile_number;
				break;
			}
			if(content.page_no < 0){
				content.page_no = content.page_no*-1;
			}
			errors = req.validationErrors(true);
			if (errors) {
				content.page_no--;
				console.log(errors);
				content.info = info;
				content.errors = errors;
				res.render('register',content);
			}
			else{
				errors = {};
				console.log(info);
				if(content.page_no == 4){
				   restler.post("http://"+global.PROFILE_URL + ':'+global.PORT+  '/api/users', {
		    	        headers: {
		    	          "Accept":"application/json",
		    	          "Content-Type":"application/json"
		    	        },
		    	        data:JSON.stringify(info)
		    	  }).on('complete', function(data,response) {
		    		 console.log(data);
		    	     if(response && response.statusCode == 200){
		    	    	 res.clearCookie('registration');
		    	     }
		    	     else{
		    	    	 
		    	    	 errors = data.error;
		    	    	 if(data.error.mobile_number || data.error.email){
		    	    		 content.page_no--;
		    	    	 }
		    	    	 else{
		    	    		 content.page_no = 1;
		    	    	 }
		    	     }
		    	     content.info = info;
		    		 content.errors = errors;
		    	     res.render('register',content);
		    	 });
				}
				else{
					content.info = info;
					content.errors = errors;
					res.render('register',content);
				}
			}
		}
		else{
			info.first_name = "";
			info.last_name = "";
			info.username = "";
			info.password = "";
			content.info = info;
			content.errors = errors;
			res.render('register',content);
		}

	},
	Verify : function(req,res){
		var content = {}, info ={},errors = {};
		content.title = 'SmartNet: Confirm Account';
		content.accounts_url = 'http://'+global.AUTHWEB_URL+':'+global.PORT+'/dialogs/auth';
		if(req.query.key){
			info.channel = "email";
			info.identity = req.query.email;
			info.key = req.query.key;
		}
		else{
			info.channel = "sms";
			info.identity = "";
			info.key = "";
		}
		content.info = info;
		content.page_no = 1;
		content.errors = errors;
		if(req.method == "POST"){
			content.page_no = parseInt(req.body.btnnav);
			req.assert('identity', local.ERROR_MESSAGES.identity).notEmpty();
			req.assert('channel', local.ERROR_MESSAGES.channel).notEmpty();
			req.assert('key', local.ERROR_MESSAGES.key).notEmpty();
			errors = req.validationErrors(true);
			
			info.identity = req.body.identity;
			info.channel = req.body.channel;
			info.key = req.body.key;
			
			console.log(errors);
			if (errors) {
				
				content.info = info;
				content.errors = errors;
				content.page_no--;
				res.render('verify',content);
			}
			else{
				restler.put("http://"+global.PROFILE_URL + ':'+global.PORT+  '/api/users/verify', {
		    	        headers: {
		    	          "Accept":"application/json",
		    	          "Content-Type":"application/json"
		    	        },
		    	        data:JSON.stringify(info)
		    	  }).on('complete', function(data,response) {
		    	     if(response && response.statusCode == 200){
		    	    	 res.render('verify',content);
		    	     }
		    	     else{
		    	    	content.page_no--;
		    	    	content.info = info;
			    		content.errors = {identity:{msg:"Record not found"}};
			    		res.render('verify',content);
		    	     }
		    	     
		    	 });
			   
			}
		}
		else{
			res.render('verify',content);
		}
		
	},
	Activate : function(req,res){
		var content = {};
		var info = {};	
		var errors = {};
		content.page_no = 1;
		content.title = 'SmartNet: Create New Account';
		content.accounts_url = 'http://'+global.AUTHWEB_URL+':'+global.PORT+'/dialogs/auth';
		content.info = info;
		content.errors = errors;
		res.render('activate',content);
	}
};