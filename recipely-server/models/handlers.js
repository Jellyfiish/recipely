const db = require('./database');
const bcrypt = require('../utils/bcrypt');
const jwtAuth = require('../utils/jwtAuth');
const axios = require('axios');

// check if running in deployment or development environment so we only require config once
if (!process.env.F2F_API_KEY) {
  var config = require('../config/config');
};

// config/environment variables
const key = process.env.F2F_API_KEY || config.F2F_API_KEY;
const CLIENT_ID = process.env.CLIENT_ID || config.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET || config.CLIENT_SECRET;

function postLogin(req, res) {
  const body = req.body;

  // QUESTION: We might want to do a toLowerCase on body.username and also when whenever we store a username (put username/signup) unless we care about username being case sensitive.
  return db.queryAsync('SELECT * from users where username = $1', [body.username])
    .then((results)=> {
      if(results.rows.length) {
        return bcrypt.comparePassword(body.password, results.rows[0].password).then(match => {
          if(!match) {
            res.status(401).end('invalid password or username');
            return;
          }

          return jwtAuth.encodeToken(results.rows[0].id, results.rows[0].username).then(token => {
            res.status(200)
              .json(token);
          }).catch(err => res.status(500).json(err))
        }).catch(err => {
          res.status(500).json(err);
        })
      } else {
        res.status(401).end('invalid password or username');
      }
    });
}

function postSignup(req, res) {
  const body = req.body;
  return db.queryAsync('SELECT * FROM users where username = $1', [body.username])
    .then((results) => {
      if(results.rows.length) {
        res.status(401).end('the username is already taken :(');
      } else {
        return bcrypt.hashPassword(body.password).then(hashedPassword => {
          return db.queryAsync('INSERT INTO users (username, password) values ($1, $2) RETURNING id, username', [body.username, hashedPassword])
            .then((results)=> {
              return jwtAuth.encodeToken(results.rows[0].id, results.rows[0].username).then(token => {
                res.status(200).json(token);
              }).catch(err => res.status(401).json(err));
            })
            .catch(err => {
              res.status(400).json(err);
            });
        }).catch(err => {
          res.status(500).end('please can you try to signup again in a moment!')
        })
      }
    })
    .catch(err => {
      res.status.json(err);
    });
}

function getUsers(req, res) {
  return db.queryAsync('SELECT * FROM users')
    .then(response => {
      res.status(200).json(response.rows.map(user => user.username));
    })
    .catch(err => {
      res.status(400).json('Error getting users')
    });
}

function putUsers(req, res) {
  const body = req.body;
  const userId = req.body.issuer;
  const newUsername = body.username;
  const newPassword = body.password;
  return db.queryAsync('SELECT * FROM users where id = $1', [userId])
    .then((results) => {
      if(newPassword && newUsername) {
        return bcrypt.hashPassword(newPassword).then(hashedPassword => {
          return db.queryAsync('UPDATE users SET username = $1, password = $2 WHERE id = $3 RETURNING id, username', [newUsername, hashedPassword, userId])
            .then((results)=> {
              return jwtAuth.encodeToken(results.rows[0].id, results.rows[0].username).then(token => {
                res.status(201).json({username: newUsername, password: newPassword});
              }).catch(err => res.status(401).json(err));
            })
            .catch(err => {
              res.status(400).json(err);
            });
        }).catch(err => {
          res.status(500).end('please can you try to signup again in a moment!');
        })
      } else if(newPassword) {
        return bcrypt.hashPassword(newPassword).then(hashedPassword => {
          return db.queryAsync('UPDATE users SET password = $1 where id = $2 RETURNING id, username', [hashedPassword, userId])
            .then((results)=> {
              return jwtAuth.encodeToken(results.rows[0].id, results.rows[0].username).then(token => {
                // for now I will simply append the token, but I would assume that we should return the new token instead of the username and password?
                if(token) res.status(201).json({password: newPassword});
              }).catch(err => res.status(401).json(err));
            })
            .catch(err => {
              res.status(400).json(err);
            });
        }).catch(err => {
          res.status(500).end('please can you try again in a moment!');
        })
      } else if(newUsername) {
        return db.queryAsync('UPDATE users SET username = $1 where id= $2 RETURNING id, username', [newUsername, userId])
          .then((results)=> {
            if(results.rows.length) {
              res.status(201).json({username: newUsername});
            } else {
              res.status(404).end('resource is not found');
            }
          })
          .catch(err => {
            res.status(400).json(err);
          });
      }
    })
    .catch(err => {
      res.status.json(err);
    });
}

function deleteUsers(req, res) {
  const userId = req.body.issuer;
  const deleteUser = `DELETE FROM users WHERE ID = ${userId}`;
  const deleteUserNotes = `DELETE FROM notes WHERE user_id = ${userId}`;
  const deleteUserRecipes = `DELETE FROM recipes_users WHERE user_id = ${userId}`;
  const queryStrings = [deleteUser, deleteUserRecipes, deleteUserNotes];
  return queryStrings.forEach(queryString => {
    return db.queryAsync(queryString).then(results => {
      res.json('User deleted')
    }).catch(err => {
      res.json('Error deleting user');
    });
  });
}

function getNotes(req, res) {
  const userId = req.body.issuer;
  return db.queryAsync('SELECT n.text, n.user_id, n.f2f_id, n.id, r.title, r.thumbnail_url\
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
}

function getRecipeNotes(req, res) {
  return db.queryAsync('SELECT * FROM notes WHERE f2f_id = $1', [req.params.id])
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
}

function postRecipeNote(req, res) {
  const f2f_id = req.body.f2f_id;
  const text = req.body.text;
  const userId = req.body.issuer;
  const params = [text, userId, f2f_id];
  const queryString = `INSERT INTO notes(text, user_id, f2f_id) VALUES ($1, $2, $3) RETURNING *`;
  return db.queryAsync(queryString, params).then(results => {
    res.status(201).json(results.rows);
  }).catch(e => {
    res.status(500).json(e);
  });
}

function putNote(req, res) {
  const userId = req.body.issuer;
  const noteId = req.params.id_note;
  const text = req.body.text;

  // query must return something for the if else block to check
  return db.queryAsync('UPDATE notes SET text = $1 WHERE id = $2 AND user_id = $3 RETURNING *', [text, noteId, userId])
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
}

function deleteNote(req, res) {
  const userId = req.body.issuer;
  const noteId = req.params.id_note;

  return db.queryAsync('DELETE FROM notes WHERE id = $1 AND user_id = $2 RETURNING *', [noteId, userId])
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
}

function getRecipes(req, res) {
  var query = req.query.q || '';
  var url = `http://food2fork.com/api/search?key=${key}&q=${query}`
  axios.get(url)
    .then(response => {
      res.status(200).json(response.data);
    })
    .catch(err => res.status(500).json(err));
}

function getRecipe(req, res) {
  axios.get(`http://food2fork.com/api/get?key=${key}&rId=${req.params.id}`)
    .then(response => {
      res.status(200).json(response.data);
    })
    .catch(err => res.status(500).json(err));
}

function postUserRecipes(req, res) {
  const userId = req.body.issuer;
  const title = req.body.title;
  const image_url = req.body.image_url;
  const source_url = req.body.source_url;
  const f2f_id = req.body.f2f_id;
  const ingredients = req.body.ingredients;

  // check if recipe already exists in the database
  return db.queryAsync(`SELECT saved_count FROM recipes WHERE f2f_id = $1`, [f2f_id])
    .then((results)=> {
      if(!results.rows.length) {  // if recipe does not exist
        // stringify ingredients array for storage in database
        var stringIngredients = JSON.stringify(ingredients);
        // insert new recipe with save count of 1
        return db.queryAsync('INSERT INTO recipes (title, thumbnail_url, source_url, ingredients, f2f_id, saved_count) VALUES ($1, $2, $3, $4, $5, $6)', [title, image_url, source_url, stringIngredients, f2f_id, 1])
          .then(results => {
            // insert user and recipe into the junction table
            return db.queryAsync("INSERT INTO recipes_users (user_id, f2f_id) VALUES ($1, $2)", [userId, f2f_id])
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
      } else {  // recipe already exists in the database
        // increment saved count
        return db.queryAsync('UPDATE recipes SET saved_count=saved_count+1 where f2f_id=$1 RETURNING *', [f2f_id])
        .then(recipe => {
          // insert user and recipe into the junction table
          // THIS PROBABLY DUPLICATES
          return db.queryAsync("INSERT INTO recipes_users (user_id, f2f_id) VALUES ($1, $2)", [userId, f2f_id])
            .then( results => {
              recipe.rows[0].ingredients = JSON.parse(recipe.rows[0].ingredients);
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
}

function getUsersRecipes(req, res) {
  const userId = req.body.issuer;
  return db.queryAsync('SELECT r.f2f_id, r.title, r.ingredients, r.source_url,\
     r.thumbnail_url, r.saved_count FROM recipes AS r JOIN recipes_users ON\
      recipes_users.user_id=$1 AND recipes_users.f2f_id = r.f2f_id', [userId])
    .then(results => {
      if(!results.rows.length) {
        res.status(400).end('No saved recipes found!')
      } else {
        // parse ingredients string into an array so clientside only has to json parse once
        results.rows.forEach((recipe) => {
          recipe.ingredients = JSON.parse(recipe.ingredients);
        });
        res.status(200).json(results.rows);
      }
    })
    .catch(err => {
      res.status(500).json(err);
    });
}

function deleteUsersRecipe(req, res) {
  const userId = req.body.issuer;
  const f2f_id = req.params.recipeId;

  return db.queryAsync('DELETE FROM recipes_users WHERE user_id = $1 AND f2f_id = $2', [userId, f2f_id])
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
}

function postClarifai(req, res) {
  axios.post('https://api.clarifai.com/v2/token', null, {
    auth: {
      username: config.CLIENT_ID,
      password: config.CLIENT_SECRET
    }
  }).then(response => {
    res.send(response.data);
  }).catch(e => {
    res.status(500).json(e);
  });
}

module.exports = {
  postLogin,
  postSignup,
  getUsers,
  putUsers,
  deleteUsers,
  getNotes,
  getRecipeNotes,
  postRecipeNote,
  putNote,
  deleteNote,
  getRecipes,
  getRecipe,
  postUserRecipes,
  getUsersRecipes,
  deleteUsersRecipe,
  postClarifai
}