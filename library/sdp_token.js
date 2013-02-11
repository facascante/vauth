var crypto = require('crypto');

function bcd(str) {  // supports only BCD of digits.
  var len = str.length;
  if (len%2 !=0) {
    str = "0" + str;
    len = str.length;
  }
  len = len / 2;
  var buffer = new Buffer(len);
  for (i=0; i<len; i++) {
    var a = str[i*2] - '0';
    var b = str[i*2+1] - '0';
    //console.log(str[i*2] + ':' + str[i*2+1] + "--" + a + ':' + b);
    var val = (a << 4) + b;
    buffer[i] = val;
  }
  console.log(buffer.toString('base64'));
  return buffer;
}

exports.createToken = function(random_string, user_id, expire_time, user_version){
  var flag = new Buffer('|');
  var random_string_buffer = new Buffer(random_string, 'binary');
  
  var bufArray = new Array(bcd(user_id), flag, bcd(expire_time), flag, random_string_buffer);
  var authInfo =  Buffer.concat(bufArray).toString('binary');
  //console.log(authInfo);
  
  var aes = crypto.createCipheriv('aes128', 'AAAabcdefghijklm', 'abcdefghijklmnop');
  var authEncrypt = aes.update(authInfo, 'binary', 'binary');
  authEncrypt += aes.final('binary');
  //console.log(authEncrypt);
  var authEncryptBase64 = new Buffer(authEncrypt, 'binary').toString('base64');
  
  var result = random_string + "|" + user_version + "|" + authEncryptBase64;
  
  return result;
  
};

