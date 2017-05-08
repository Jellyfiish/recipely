var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var axios = require('axios');

var key = require('./config/config');

var morgan = require('morgan');

app.use(morgan('dev'));
app.use(bodyParser.json());

app.post('/api/recipes', (req, res) => {
  var query = req.body.ingredients;
  axios.get(`http://food2fork.com/api/search?key=${key}&q=${query}`)
    .then(response => {
      console.log('Success!', response.data.recipes);
      res.json(response.data.recipes);
    })
    .catch(e => console.error(e));
  });

// the following line is needed because heroku assigns a port dynamically
// default to 8080 for development
var port = process.env.PORT || 8080;

app.listen(port, function() {
  console.log('Server is now listening on port', port);
});

