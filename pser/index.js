
/**
 * Module dependencies.
 */

var express = require('express')
  , pser = require('./routes/autoload')
  , http = require('http')
  , path = require('path');


var app = module.exports = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler({showStack: true, dumpExceptions: true}));
});

app.all('/api/:version/users/verify', pser.verify);
app.all('/api/:version/users/register', pser.register);


