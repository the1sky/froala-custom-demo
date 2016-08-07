var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var md5 = require('md5');
var fs = require('fs');
var busboy = require('connect-busboy');
var swig = require('swig');

var routes = require('./routes/index');
var users = require('./routes/user');

var app = express();

var env = process.env.NODE_ENV || 'development';
app.locals.ENV = env;
app.locals.ENV_DEVELOPMENT = env == 'development';

// view engine setup
app.engine('swig', swig.renderFile)
app.set('view cache', false);
swig.setDefaults({cache: false});
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'swig');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(busboy());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);


var uploadDir = __dirname + '/public/files/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

app.post('/upload_image', function (req, res, next) {
  var fstream;
  req.busboy.on('file', function (fieldname, file, filename) {
    filename = md5(filename);
    fstream = fs.createWriteStream(uploadDir + filename);
    file.pipe(fstream);
    fstream.on('close', function () {
      res.end(JSON.stringify({
        link: '/files/' + filename
      }))
    });
  });
  req.pipe(req.busboy);
});
app.use('/users', users);

/// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/// error handlers

// development error handler
// will print stacktrace

if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err,
      title: 'error'
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {},
    title: 'error'
  });
});


module.exports = app;
