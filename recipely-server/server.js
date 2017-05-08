var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var morgan = require('morgan');

app.use(morgan('dev'));
app.use(bodyParser.json());

// the following line is needed because heroku assigns a port dynamically
// default to 8080 for development
var port = process.env.PORT || 8080;

app.listen(port, function() {
  console.log('Server is now listening on port', port);
});
