var restler = require('restler');
var config = require('../config/global.js');

exports.Send = function(mobile,message,callback){
  
  
  var data = {  
        "outboundSMSMessageRequest" : {
          "address" : ["tel:"+ mobile],
          "senderAddress" : "406895",
          "outboundSMSTextMessage" : {"message": message},
          "clientCorrelator":"1234567"
          }
      };
  data = JSON.stringify(data);
  restler.post(config.SMS_SERVER +'/1/smsmessaging/outbound/406895/requests', {
      headers: {
        "Accept":"application/json",
        "Content-Type":"application/json",
        "Authorization" : "WSSE realm=\"SDP\", profile=\"UsernameToken\"",
        "X-WSSE": "UsernameToken Username=\"002204\", PasswordDigest=\"OqMMvA1ep/Gy6bRXC3+pj6elIgU=\",Nonce=\"2010082108334600001\", Created=\"2010-08-21T08:33:46Z\"",
        "X-RequestHeader": "request ServiceId=\"0022042000001479\""
      },
      data:data
  }).on('complete', function(data,response) {
    console.log("SMS:" + data);
    callback(null,true);
   
  }).on('fail', function(data, response) {
    console.log("SMS:" + data);
    callback(data);
  });
  

};