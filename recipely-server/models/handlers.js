const db = require('./database');
const bcrypt = require('../utils/bcrypt');
const jwtAuth = require('../utils/jwtAuth');

function postLogin(req, res) {
  const body = req.body;
  // QUESTION: We might want to do a toLowerCase on body.username and also when whenever we store a username (put username/signup) unless we care about username being case sensitive.
  
  // check if the user name exists in the db
    // yes then check if the password given equal to the one in the db
      // yes return the token with 200
      // no return 401 and err
    //return 401 and err
  db.queryAsync('SELECT * from users where username = $1', [body.username])
    .then((results)=> {
      if(results.rows.length) {
        bcrypt.comparePassword(body.password, results.rows[0].password).then(match => {
          if(!match) {
            res.status(401).end('invalid password or username');
            return;
          }

          jwtAuth.encodeToken(results.rows[0].id, results.rows[0].username).then(token => {
            res.status(200)
              .json(token);
          }).catch(err => res.status(402).end('invalid password or username'))
        }).catch(err => {
          res.status(401).end('invalid password or username');
        })
      } else {
        res.status(401).end('invalid password or username');
      }
    });
}

module.exports = {
  postLogin: postLogin
}