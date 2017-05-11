var express = require('express');
var bodyParser = require('body-parser');
var axios = require('axios');
var db = require('./models/database');
var jwtAuth = require('./models/jwtAuth');
var bcrypt = require('./models/bcrypt')
var isAuthenticated = require('./models/auth');
var app = express();
var key = process.env.F2F_API_KEY || require('./config/config').F2F_API_KEY;
var morgan = require('morgan');

app.use(morgan('dev'));
app.use(bodyParser.json());

// the following line is needed because heroku assigns a port dynamically
// default to 8080 for development
var port = process.env.PORT || 8080;

// recipes endpoints
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
          });
      } else {
        const savedCount = results.rows[0].saved_count;
        db.queryAsync('UPDATE recipes SET saved_count=saved_count+1 where f2f_id=$1 RETURNING *', [f2f_id])
        .then(recipe => {
          db.queryAsync("INSERT INTO recipes_users (user_id, f2f_id) VALUES ($1, $2)", [userId, f2f_id])
            .then( results => {
              res.status(200).json(recipe.rows[0]);
            })
            .catch(err => {
              res.status(500).json(err);
            });
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

app.get('/api/users/recipes', isAuthenticated, (req, res) => {
  const userId = req.body.issuer;
  db.queryAsync('SELECT r.f2f_id, r.title, r.ingredients, r.source_url,\
     r.thumbnail_url, r.saved_count FROM recipes AS r JOIN recipes_users ON\
      recipes_users.user_id=$1 AND recipes_users.f2f_id = r.f2f_id', [userId])
    .then(results => {
      if(!results.rows.length) {
        res.status(400).end('No saved recipes found!')
      } else {
        res.status(200).json(results.rows);
      }
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

app.delete('/api/users/recipes/:recipeId', isAuthenticated, (req, res) => {
  const userId = req.body.issuer;
  const f2f_id = req.params.recipeId;

  db.queryAsync('DELETE FROM recipes_users WHERE user_id = $1 AND f2f_id = $2', [userId, f2f_id])
    .then(results => {
      if(results.rowCount) {
        res.status(201).json(results.rows)
      } else {
        res.status(404).end('The resource is not found')       
      }
    })
    .catch(err => {
      res.status(500).json(err);
    });
});
// auth endpoints
app.post('/api/login', (req, res) => {
  const body = req.body;
  db.queryAsync('SELECT * from users where username = $1', [body.username])
    .then((results)=> {
      if(results.rows.length) {
        bcrypt.comparePassword(body.password, results.rows[0].password, (err, match) => {
          if(err || !match) {
            res.status(401).end('invalid password or username');
            return;
          } 

          jwtAuth.encodeToken(results.rows[0].id, (err, token) => {
            if(err) {
              res.status(401).end('invalid password or username');
            } else {
              res.status(200)
                .json(token);
            }
          });
        });
      } else {
        res.status(401).end('invalid password or username');
      }
    })
});

app.post('/api/signup', (req, res) => {
  const body = req.body;
  db.queryAsync('SELECT * FROM users where username = $1', [body.username])
    .then((results) => {
      if(results.rows.length) {
        res.status(401).end('the user name is already taken :(');
      } else {
        bcrypt.hashPassword(body.password, (err, hashedPassword) => {
          if(err) {
          res.status(500).end('please can you try to signup again in a moment!');
          return;
          } 

          db.queryAsync('INSERT INTO users (username, password) values ($1, $2) RETURNING id', [body.username, hashedPassword])
            .then((results)=> {
              jwtAuth.encodeToken(results.rows[0].id, (err, token) => {
                if(err) {
                 res.status(401).json(err);
                 return;
                } else if(token) {
                  res.status(200).json(token);
                }

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

// users endpoints
app.get('/api/users', isAuthenticated, (req, res) => {
  db.queryAsync('SELECT * FROM users')
    .then(response => {
      res.status(200).json(response.rows.map(user => user.username));
    })
    .catch(err => {
      res.status(400).json('Error getting users')
      console.error(err);
    });
});

//QUESTION: should we get rid of this endpoint or change it's uri???
// app.get('/api/users/:id', isAuthenticated, (req, res) => {
//   db.queryAsync(`SELECT * FROM users WHERE ID = ${req.params.id}`)
//     .then(response => {
//       res.status(200).json(response.rows);
//     })
//     .catch(err => {
//       res.status(400).json('Error getting the user');
//       console.error(err);
//     });
// });

app.put('/api/users', isAuthenticated, (req, res) => {
  const body = req.body;
  const userId = req.body.issuer;
  const newUsername = body.username;
  const newPassword = body.password;
  db.queryAsync('SELECT * FROM users where id = $1', [userId])
    .then((results) => {
      if(newPassword && newUsername) {
        bcrypt.hashPassword(newPassword, (err, hashedPassword) => {
          if(err) res.status(500).end('please can you try to signup again in a moment!');
          db.queryAsync('UPDATE users SET username = $1, password = $2 RETURNING id', [newUsername, hashedPassword])
            .then((results)=> {
              jwtAuth.encodeToken(results.rows[0].id, (err, token) => {
                if(err) res.status(401).json(err);
                if(token) res.status(201).json({username: newUsername, password: newPassword});
              })
            })
            .catch(err => {
              res.status(400).json(err);
            });
        });
      } else if(newPassword) {
        bcrypt.hashPassword(newPassword, (err, hashedPassword) => {
          if(err) res.status(500).end('please can you try again in a moment!');
          db.queryAsync('UPDATE users SET password = $1 where id = $2 RETURNING id', [hashedPassword, userId])
            .then((results)=> {
              jwtAuth.encodeToken(results.rows[0].id, (err, token) => {
                if(err) res.status(401).json(err);
                if(token) res.status(201).json({password: newPassword});
              })
            })
            .catch(err => {
              res.status(400).json(err);
            });
        });
      } else if(newUsername) {
        db.queryAsync('UPDATE users SET username = $1 where id= $2 RETURNING id', [newUsername, userId])
          .then((results)=> {
            res.status(201).json({username: newUsername});
          })
          .catch(err => {
            res.status(400).json(err);
          });
      }
    })
    .catch(err => {
      res.status.json(err);
    });
});

app.delete('/api/users/:id', (req, res) => {
  const userId = req.params.id;
  const deleteUser = `DELETE FROM users WHERE ID = ${userId}`;
  const deleteUserNotes = `DELETE FROM notes WHERE user_id = ${userId}`;
  const deleteUserRecipes = `DELETE FROM recipes_users WHERE user_id = ${userId}`;
  const queryStrings = [deleteUser, deleteUserRecipes, deleteUserNotes];
  queryStrings.forEach(queryString => {
    db.queryAsync(queryString).then(results => {
      res.json('User deleted')
    }).catch(err => {
      res.json('Error deleting user');
    });
  });
});

// notes endpoints
app.get('/api/users/notes', isAuthenticated, (req, res) => {
  const userId = req.body.issuer;
  db.queryAsync('SELECT n.text, n.user_id, n.f2f_id, r.title, r.thumbnail_url\
   FROM notes AS n JOIN recipes AS r ON\
   n.f2f_id = r.f2f_id WHERE n.user_id = $1', [userId])
    .then(results => {
      if(results.rows.length) {
        res.status(200).json(results.rows);
      } else {
        res.status(404).end('resources are not found');
      }
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

app.get('/api/users/recipes/:id/notes', isAuthenticated, (req, res) => {
  db.queryAsync('SELECT * FROM notes WHERE f2f_id = $1', [req.params.id])
    .then(results => {
      if(results.rows.length) {
        res.status(200).json(results.rows);
      } else {
        res.status(404).end('there is no notes for this recipe');
      }

    })
    .catch(err => {
      res.status(500).json(err);
    })
});

app.post('/api/users/recipes/notes', isAuthenticated, (req, res) => {
  const f2f_id = req.body.f2f_id;
  const text = req.body.text;
  const userId = req.body.issuer;
  const params = [text, userId, f2f_id];
  const queryString = `INSERT INTO notes(text, user_id, f2f_id) VALUES ($1, $2, $3) RETURNING *`;
  db.queryAsync(queryString, params).then(results => {
    res.status(201).json(results.rows);
  }).catch(e => {
    res.status(500).json(e);
  });
});

app.put('/api/notes/:id_note', isAuthenticated, (req, res) => {
  const userId = req.body.issuer;
  const noteId = req.params.id_note;
  const text = req.body.text;

  // query must return something for the if else block to check
  db.queryAsync('UPDATE notes SET text = $1 WHERE id = $2 AND user_id = $3 RETURNING *', [text, noteId, userId])
    .then(results => {
      if(results.rows.length) {
        res.status(201).send(text);
      } else {
        res.status(404).send('resource is not available');
      }
    })
    .catch(err => {
      res.status(500).send(err);
    });
});

app.delete('/api/notes/:id_note', isAuthenticated, (req, res) => {
  const userId = req.body.issuer;
  const noteId = req.params.id_note;

  db.queryAsync('DELETE FROM notes WHERE id = $1 AND user_id = $2 RETURNING *', [noteId, userId])
    .then(results => {
      if(results.rows.length) {
        res.status(201).send(results.rows[0]);
      } else {
        res.status(404).send('resource is not available');
      }
    })
    .catch(err => {
      res.status(500).send(err);
    });
});


app.listen(port, function() {
  console.log('Server is now listening on port', port);
});
