
/**
 * Module dependencies.
 */

var express = require('express')
  , router = require('./routes/autoload')
  , path = require('path')
  , config = require('./config/local.js')
  , expressValidator = require('express-validator');

var app = module.exports = express();

app.configure(function(){
  app.use(express.logger('dev'));
  app.use(expressValidator);
  app.use(config.local);
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(app.router);
  
});

app.configure('development', function(){
app.use(express.errorHandler({showStack: true, dumpExceptions: true}));

});

app.all('/api/:version/users/register', router.register);


