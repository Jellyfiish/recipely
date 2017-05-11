var jwtAuth = require('./jwtAuth');
var db = require('./database');

var isAuthenticated = (req, res, next) => {
  if(!req.header('x-access-token')) {
    res.status(422).end('please log in!')
  }

  const token = req.header('x-access-token').split(' ')[1];
  jwtAuth.decodeToken(token, (err, payload) => {
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

module.exports = isAuthenticated;