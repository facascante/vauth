module.exports = function(req,res){
  var restler = require('restler');
  var content = {};
  content.page_no = 1;
  content.title = 'SmartNet: Create New Account';
  content.accounts_url = 'http://'+req.global.AUTHWEB_URL+':'+req.global.PORT+'/dialogs/auth';
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
        req.assert('first_name', req.local.ERROR_MESSAGES.first_name).notEmpty();
        req.assert('last_name', req.local.ERROR_MESSAGES.last_name).notEmpty();
        req.assert('username', req.local.ERROR_MESSAGES.username).len(5,200);
        req.assert('password', req.local.ERROR_MESSAGES.password).len(6,200);
        req.assert('repassword', req.local.ERROR_MESSAGES.repassword).equals(req.body.password);
        
        info.first_name = req.body.first_name;
        info.last_name = req.body.last_name;
        info.username = req.body.username;
        info.password = req.body.password;
      break;
      case 3 :
        req.assert('sec_q', req.local.ERROR_MESSAGES.sec_q).notEmpty();
        req.assert('sec_a', req.local.ERROR_MESSAGES.sec_q).notEmpty(); 
        
        info.sec_q = req.body.sec_q;
        info.sec_a = req.body.sec_a;
      break;
      case 4 :
        if(!req.body.mobile_number){
          req.assert('email', req.local.ERROR_MESSAGES.email).isEmail();
        }
        if(!req.body.email){
          req.assert('mobile_number', req.local.ERROR_MESSAGES.mobile_number).len(10,13);
        }
        req.assert('tcagree', req.local.ERROR_MESSAGES.tcagree).notEmpty(); 
        
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
      content.info = info;
      content.errors = errors;
      res.render('register',content);
    }
    else{
      errors = {};
      if(content.page_no == 4){
         restler.post("http://"+req.global.PROFILE_URL + ':'+req.global.PORT+  '/api/'+ req.params.version +'/users/register', {
                headers: {
                  "Accept":"application/json",
                  "Content-Type":"application/json"
                },
                data:JSON.stringify(info)
          }).on('complete', function(data,response) {
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
};
