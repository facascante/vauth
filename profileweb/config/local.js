
var config = module.exports = {
		ERROR_MESSAGES : {
			first_name : "Invalid Firstname",
			last_name : "Invalid Lastname",
			username : "Invalid Username",
			password : "Invalid password",
			repassword : "Password not match",
			sec_q : "Please select security question",
			sec_a : "Invalid answer to security question",
			email : "Invalid email address",
			mobile_number : "Invalid Mobile Number",
			tcagree : "You should agree to the Terms and Condition",
			identity : "Invalid Mobile Number",
			key : 'Invalid Activation key',
			channel : 'Invalid Activation channel'
		  }
}

module.exports.local = function(req,res,next){

	req.local = config;
	return next();
};