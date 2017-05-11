const moment = require('moment');
const jwt = require('jwt-simple');

// only require config file if env variable doesn't exist (e.g. not running on heroku)
const secretKey = process.env.TOKEN_SECRET || require('../config/config').TOKEN_SECRET;

function encodeToken(userId, username, callback) {
  const payload = {
    exp: moment().add(7, 'days').unix(),
    iat: moment().unix(),
    sub: userId,
    iss: username
  };

  callback(null, jwt.encode(payload, secretKey));
}

function decodeToken(token, callback) {
  const payload = jwt.decode(token, secretKey);
  const now = moment.unix();
  if(now > payload.exp) {
    callback('Token has been expired');
  } else {
    callback(null, payload);
  }
}

module.exports = {
  encodeToken,
  decodeToken
};
