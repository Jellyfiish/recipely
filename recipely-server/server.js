var express = require('express');
var bodyParser = require('body-parser');
var axios = require('axios');
var client = require('./models/database');
var jwtAuth = require('./models/jwtAuth');
var bcrypt = require('./models/bcrypt')
var app = express();
var key = process.env.F2F_API_KEY || require('./config/config').F2F_API_KEY;

var morgan = require('morgan');

// to be moved to util models directory after adding the check it the user exists in the DB funciton
var isAuthenticated = (req, res, next) => {
  if(!(req.header && req.header.token)) {
    res.status(400).end('please log in!')
  }
  const token = req.header.token.split(' ')[1];
  jwtAuth.decodeToken(req.header.token, (err, payload) => {
    if(err) res.status(400).end(err);
    // check if user still exits in the db
      // yes next();
      // no return 400
  });
}

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

app.post('/api/login', (req, res) => {
  const body = req.body;
  // waiting until writing a function that retrieves users from DB
  // db
  //   .getUser(body.username)
  //   .bcrypt.comparePassword(body.password, user.password)
    jwtAuth.encodeToken(body.username, (err, token) => {
      if(err) res.status(400).end('invalid password or username');
      res.status(200)
        .json(token);
    });
});

app.post('/api/signup', (req, res) => {
  const body = req.body;
  // TODO: add the user to the data base with the salted password after checking that there's no duplicate username in the DB
  jwtAuth.encodeToken(body.username, (err, token) => {
    if(err) res.status(400).end(err);
    if(token) res.status(200).end(token);
  })
});

app.get('/api/users', (req, res) => {
  client.queryAsync('SELECT * FROM users')
    .then(response => {
      res.status(200).json(response.rows);
    })
    .catch(err => console.error(err));
});

app.get('/api/users/:id', (req, res) => {
  client.queryAsync(`SELECT * FROM users WHERE ID = ${req.params.id}`)
    .then(response => {
      res.status(200).json(response.rows);
    })
    .catch(err => console.error(err));
});

app.delete('/api/users/:id', (req, res) => {
  const userId = req.params.id;
  const deleteUser = `DELETE FROM users WHERE ID = ${userId}`;
  const deleteUserNotes = `DELETE FROM notes WHERE user_id = ${userId}`;
  const deleteUserRecipes = `DELETE FROM recipes_users WHERE user_id = ${userId}`;
  // TODO: Decrement saved count of recipes by 1 that deleted user saved
  // const decrementSavedCounts = `UPDATE TABLE recipes WHERE ID = `;
  const queryStrings = [deleteUser, deleteUserRecipes, deleteUserNotes];
  queryStrings.forEach(queryString => {
    client.queryAsync(queryString).then(res => {
      console.log('Deleted!');
    }).catch(e => {
      console.error(`Error deleting row(s)\nError: ${e}`);
    });
  });
});


app.listen(port, function() {
  console.log('Server is now listening on port', port);
});
