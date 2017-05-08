var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var axios = require('axios');

var key = process.env.F2F_API_KEY || require('./config/config');

var morgan = require('morgan');

app.use(morgan('dev'));
app.use(bodyParser.json());

// the following line is needed because heroku assigns a port dynamically
// default to 8080 for development
var port = process.env.PORT || 8080;


app.post('/api/recipes', (req, res) => {
  var query = req.body.ingredients;
  axios.get(`http://food2fork.com/api/search?key=${key}&q=${query}`)
    .then(response => {
      res.json(response.data.recipes);
    })
    .catch(err => console.error(err));
  });


app.listen(port, function() {
  console.log('Server is now listening on port', port);
});

