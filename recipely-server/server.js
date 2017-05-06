var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var morgan = require('morgan');

app.use(morgan('dev'));
app.use(bodyParser.json());


app.listen(8080, function() {
  console.log('Server is now listening on port 8080');
});
