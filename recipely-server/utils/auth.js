var jwtAuth = require('./jwtAuth');
var db = require('../models/database');

var isAuthenticated = (req, res, next) => {
  if(!req.header('x-access-token')) {
    res.status(400).end('please log in!');
    return;
  }

  const token = req.header('x-access-token').split(' ')[1];
  jwtAuth.decodeToken(token).then(payload => {
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
  }).catch(err => {
    res.status(400).end('Please login/signup')});
}

module.exports = isAuthenticated;