var express = require('express');
var bodyParser = require('body-parser');
var axios = require('axios');
var db = require('./models/database');
var jwtAuth = require('./models/jwtAuth');
var bcrypt = require('./models/bcrypt')
var app = express();
var key = process.env.F2F_API_KEY || require('./config/config').F2F_API_KEY;

var morgan = require('morgan');

// to be moved to util models directory after adding the check it the user exists in the DB funciton
var isAuthenticated = (req, res, next) => {
  if(!req.header('x-access-token')) {
    res.status(400).end('please log in!')
  }

  const token = req.header('x-access-token').split(' ')[1];
  jwtAuth.decodeToken(token, (err, payload) => {
    console.log(payload.sub)
    if(err) res.status(400).end(err);
    if(payload) {
      db.queryAsync('SELECT * FROM users where id = $1', [payload.sub])
        .then(results => {
          if(results.rows.length) {
            req.body.issuer = payload.sub;
            next();
          } else {
            res.status(400).end('Please login/signup');
          }
        }).catch((err)=> {
          res.status(500).json(err);
        });
    }
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

app.post('/api/users/recipes', isAuthenticated,(req, res) => {
  const userId = req.body.issuer;
  const title = req.body.title;
  const image_url = req.body.image_url;
  const source_url = req.body.source_url;
  const f2f_id = req.body.f2f_id;
  const ingredients = req.body.ingredients;
  db.queryAsync(`SELECT saved_count FROM recipes WHERE f2f_id = $1`, [f2f_id])
    .then((results)=> {
      if(!results.rows.length) {
        db.queryAsync('INSERT INTO recipes (title, thumbnail_url, source_url, ingredients, f2f_id, saved_count) VALUES ($1, $2, $3, $4, $5, $6)', [title, image_url, source_url,ingredients ,f2f_id, 1])
          .then(results => {
            db.queryAsync("INSERT INTO recipes_users (user_id, f2f_id) VALUES ($1, $2)", [userId, f2f_id])
              .then( results => {
                res.status(201).json(req.body);
              })
              .catch(err => {
                res.status(500).json(err);
              });
          })
          .catch(err => {
            res.status(501).json(err);
          })
      } else {
        const savedCount = results.rows[0].saved_count;
        // UPDATE films SET kind = 'Dramatic' WHERE kind = 'Drama';
        db.queryAsync('UPDATE recipes SET saved_count=saved_count+1 where f2f_id=$1 RETURNING *', [f2f_id])
        .then(results => {
          res.json(results.rows[0]);
        })
        .catch(err => {
          res.status(500).json(err);
        });
      }
    })
    .catch((err)=> {
      res.status(500).json(err);
    });

});

app.post('/api/login', (req, res) => {
  const body = req.body;
  db.queryAsync('SELECT * from users where username = $1', [body.username])
    .then((results)=> {
      if(results.rows.length) {
        bcrypt.comparePassword(body.password, results.rows[0].password, (err, match) => {
          if(err || !match) res.status(401).end('invalid password or username');
          jwtAuth.encodeToken(results.rows[0].id, (err, token) => {
            if(err) res.status(401).end('invalid password or username');
            res.status(200)
              .json(token);
          });
        });
      } else {
        res.status(401).end('invalid password or username');
      }
    })
});

app.post('/api/signup', (req, res) => {
  const body = req.body;
  // TODO: add the user to the data base with the salted password after checking that there's no duplicate username in the DB
  db.queryAsync('SELECT * FROM users where username = $1', [body.username])
    .then((results) => {
      if(results.rows.length) {
        res.status(401).end('the user name is already taken :(');
      } else {
        bcrypt.hashPassword(body.password, (err, hashedPassword) => {
          if(err) res.status(500).end('please can you try to signup again in a moment!');
          db.queryAsync('INSERT INTO users (username, password) values ($1, $2) RETURNING id', [body.username, hashedPassword])
            .then((results)=> {
              jwtAuth.encodeToken(results.rows[0].id, (err, token) => {
                if(err) res.status(401).json(err);
                if(token) res.status(200).json(token);
              })
            })
            .catch(err => {
              res.status(400).json(err);
            });
        });
      }
    })
    .catch(err => {
      res.status.json(err);
    });
});

app.get('/api/users', isAuthenticated, (req, res) => {
  db.queryAsync('SELECT * FROM users')
    .then(response => {
      res.status(200).json(response.rows);
    })
    .catch(err => {
      res.status(400).json('Error getting users')
      console.error(err);
    });
});

app.get('/api/users/:id', isAuthenticated, (req, res) => {
  db.queryAsync(`SELECT * FROM users WHERE ID = ${req.params.id}`)
    .then(response => {
      res.status(200).json(response.rows);
    })
    .catch(err => {
      res.status(400).json('Error getting the user');
      console.error(err);
    });
});

app.delete('/api/users/:id', (req, res) => {
  const userId = req.params.id;
  const deleteUser = `DELETE FROM users WHERE ID = ${userId}`;
  const deleteUserNotes = `DELETE FROM notes WHERE user_id = ${userId}`;
  const deleteUserRecipes = `DELETE FROM recipes_users WHERE user_id = ${userId}`;
  const queryStrings = [deleteUser, deleteUserRecipes, deleteUserNotes];
  queryStrings.forEach(queryString => {
    db.queryAsync(queryString).then(res => {
      console.log('Deleted!');
      res.json('User deleted')
    }).catch(err => {
      console.error(`Error deleting row(s)\nError: ${err}`);
      res.json('Error deleting user');
    });
  });
});

app.post('/api/notes', (req, res) => {
  const recipeId = req.body.recipe_id;
  const userId = req.body.user_id;
  const note = req.body.text;
  const params = [note, userId, recipeId];
  const queryString = `INSERT INTO notes(text, user_id, recipe_id) VALUES ($1, $2, $3)`;
  db.queryAsync(queryString, params).then(res => {
    console.log('Added note!');
    res.status(201).json('Added note!')
  }).catch(e => {
    console.error(`Error adding note\nError: ${e}`);
    res.json('Error adding note')
  });
});


app.listen(port, function() {
  console.log('Server is now listening on port', port);
});
