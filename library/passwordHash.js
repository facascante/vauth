var crypto = require('crypto');

exports.generatePassword = function(secret,password){
  
  return crypto.createHmac('sha256', secret).update(password).digest('hex');
  
};