	var fs = require('fs'),
		 crypto = require('crypto'),
         path = require('path'),
         config = require('../config/global.js');

	exports.generateKey = function(raw_key){
	  
	  var raw_key = JSON.stringify(raw_key);
	  var sign; 
	  sign = crypto.createSign('RSA-SHA256');
	  sign.update(raw_key);
	  var key_sig = web_safe_encode(sign.sign(private_key, 'base64')); 
	  var key = config.PK_ID + "." + key_sig + "." + base64_web_safe_encode(raw_key);
	  
	  return key;
	  
	};

	exports.verifyKey = function(key){
	  
	  key_array = key.split("."); 
	  var pk_id  = key_array[0];
	  var public_key = fs.readFileSync(config.getPublicKey(pk_id), 'ascii'); 
	  var key_sig = key_array[1];
	  var raw_key = base64_web_safe_decode(key_array[2]);
	  var verifier; 
	  verifier = crypto.createVerify('RSA-SHA256');
	  verifier.update(raw_key);
	  var result = verifier.verify(public_key, web_safe_decode(key_sig), 'base64');
	  if(result){
		return JSON.parse(raw_key);
	  }
	  else{
		return result;
	  } 
	};

	function web_safe_encode(str) {
	  return str.replace(/\+/g, '-').replace(/\//g, '_');
	}

	function web_safe_decode(str) {
	  return str.replace(/\-/g, '+').replace(/\_/g, '/');
	}

	function base64_web_safe_encode(str) {
	  return web_safe_encode((new Buffer(str)).toString('base64'));
	}

	function base64_web_safe_decode(str) {
	  return ((new Buffer(web_safe_decode(str), 'base64')).toString());
	}
