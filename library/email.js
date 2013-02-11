var nodemailer = require("nodemailer");
var transport = nodemailer.createTransport("sendmail");

exports.Send = function(email,subject,message,callback){
  
  var mailOptions = {
        from: "no-reply@smartnet.ph", 
        to: email, 
        subject: subject, 
        html: message    
  };

  transport.sendMail(mailOptions, function(error, response){
      if(error){
        console.log("EMAIL : Message failed -  " + error);
          callback(error);
      }else{
          console.log("EMAIL : Message sent - " + response.message);
          callback(null,true);
      }

  });
};