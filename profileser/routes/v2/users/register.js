var sms = require('../../../../library/sms.js');
var email = require('../../../../library/email.js');
var hash = require('../../../../library/passwordHash.js');

var crypto = require('crypto');
var ShortId = require('shortid/index');
var async = require('async');

module.exports = function(req,res,model){
	async.auto({ 
	     
	    /*
	     * Validate Request
	     */
	    validation: function(callback){
	      
	      req.assert('first_name', req.local.ERROR_MESSAGES.first_name).notEmpty();  
	      req.assert('last_name', req.local.ERROR_MESSAGES.last_name).notEmpty(); 
	      req.assert('username', req.local.ERROR_MESSAGES.username).len(5,200); 
	      req.assert('password', req.local.ERROR_MESSAGES.password).len(6,200); 
	      req.assert('sec_q', req.local.ERROR_MESSAGES.sec_q).notEmpty();
	      req.assert('sec_a', req.local.ERROR_MESSAGES.sec_q).notEmpty(); 
	      if(req.body.mobile_no || req.body.email_add){
  	      if(req.body.mobile_no){
  	        req.assert('mobile_number', req.local.ERROR_MESSAGES.mobile_number).isNumeric();
  	      }
  	      if(req.body.email_add){
  	        req.assert('email', req.local.ERROR_MESSAGES.email).isEmail();
  	      }
	      }
	        
	      var errors = req.validationErrors();  
	      if (errors) {
	        callback(errors);
	      }
	      else{
	        callback(null,true);
	      }
	      
	    },
	    
	    /*
       * Save Record to MongoDb if neo4j node created
       */
	    
	    addUser: ['validation', function(callback,result){
	      
	      var content = {};    
	      content.user_id = ShortId.generate();
	      content.first_name = req.body.first_name;
	      content.last_name = req.body.last_name;
	      content.username = req.body.username;
	      content.salt = crypto.randomBytes(256).toString('base64',0,30);
	      content.password = hash.generatePassword(content.salt,req.body.password);
	      content.sec_q = req.body.sec_q;
	      content.sec_a = req.body.sec_a;
	      if(req.body.mobile_number){
	    	  content.mobile_number = req.body.mobile_number;
	      }
	      if(req.body.email){
	    	content.email = req.body.email; 
	      }
	      
	      content.created_at = new Date();
	      content.status = "Pending";
	      if(content.email){
	        req.body.eac = content.eac = crypto.randomBytes(256).toString('hex',0,30);
	      }
	      if(content.mobile_number){
	        req.body.mac = content.mac = crypto.randomBytes(256).toString('hex',0,2);
	      }
	      console.log(model);
	      var User = new model.User(function(model){
	    	  var user = new User(content);
	    	  user.keywordize();
	    	  user.keywords = new Array(content.username.toLowerCase(),content.last_name.toLowerCase(),content.first_name.toLowerCase());
	    	  user.save(function(error, data){
	    	    if(error) {
	    	      console.log(error.err);
	    	      if(error.code == 11000){
	    	        problem = {};
	    	        if(error.err.indexOf("mobile") !== -1){
	    	          problem.param = "mobile_number";
	    	          problem.msg = "Duplicate Mobile Number";
	    	        }
	    	        if(error.err.indexOf("username") !== -1){
	    	          problem.param = "username";
	    	          problem.msg = "Duplicate User Name";
	    	        }
	    	        if(error.err.indexOf("email") !== -1){
	    	          problem.param = "email";
	    	          problem.msg = "Duplicate Email Address";
	    	        }
	    	        var errors = {};
	    	        errors[problem.param] = problem;
	    	        callback(errors); return; 
	    	      }
	    	      else{
	    	        callback(error); return; 
	    	      }
	    	      
	    	    }    
	    	    else{
	    	      callback(null,data);
	    	    }
	    	  });	
	      });
      }],
      
    
      /*
       * Send Activation Code to email and sms
       */
      
      sendActivationCode: ['addUser', function(callback,result){
        if(req.body.mobile_number){
          var msg = "Your Account Activation code is : "+req.body.mac;
          
          sms.Send(req.body.mobile_number,msg,function(error,callback){
            if(error){
              console.log("Problem on sending SMS to: " + req.body.mobile_number + ", of account: " + req.body.username + " with message: " + msg);
            }
          });
        }
        if(req.body.email){
          var subject = "Welcome to SmartNet "+ req.body.first_name;
          var message = "<b>Hi,<br/><br/>Please click the link to validate your account <br/><br/> <a href='http://"+req.global.PROFILEWEB_URL+"/dialogs/verify?key="+req.body.eac + "'>Verify my Account</a></b>";
          email.Send(req.body.email,subject,message,function(error,callback){
            if(error){
              console.log("Problem on sending EMAIL to: " + req.body.email + ", of account: " + req.body.username + " with message: " + message);
            }
          });
        }
        callback(null,result.addUser);
        
      }]
	  },
	  function(errors, results){
	    if(errors){
	      res.json(400,{error:errors});
	    }
	    else{
	      res.json(200,req.local.SUCCESS_MESSAGES);
	    }
	  });		
};
