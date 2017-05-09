var express = require('express');
var bodyParser = require('body-parser');
var axios = require('axios');
//var db = require('./models/database');

var app = express();

var key = process.env.F2F_API_KEY || require('./config/config').F2F_API_KEY;

var morgan = require('morgan');

app.use(morgan('dev'));
app.use(bodyParser.json());

// the following line is needed because heroku assigns a port dynamically
// default to 8080 for development
var port = process.env.PORT || 8080;


app.get('/api/recipes', (req, res) => {
  var query = req.query.q || '';
  var url = `http://food2fork.com/api/search?key=${key}&q=${query}`
  axios.get(url)
    .then(response => {
      res.status(200).json(response.data);
    })
    .catch(err => console.error(err));
});

app.get('/api/recipes/:id', (req, res) => {
  axios.get(`http://food2fork.com/api/get?key=${key}&rId=${req.params.id}`)
    .then(response => {
      res.status(200).json(response.data);
    })
    .catch(err => console.error(err));
});



app.listen(port, function() {
  console.log('Server is now listening on port', port);
});
