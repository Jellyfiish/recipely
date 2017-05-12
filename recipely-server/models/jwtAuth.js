const moment = require('moment');
const jwt = require('jwt-simple');

// only require config file if env variable doesn't exist (e.g. not running on heroku)
const secretKey = process.env.TOKEN_SECRET || require('../config/config').TOKEN_SECRET;

function encodeToken(userId, username, callback) {
  const payload = {
    exp: moment().add(7, 'days').unix(),
    iat: moment().unix(),
    sub: userId,
    user: username
  };
  
  callback(null, jwt.encode(payload, secretKey));
}

function decodeToken(token, callback) {
  try {
    const payload = jwt.decode(token, secretKey);
    callback(null, payload);
  } catch(e) {
    callback('Token has been expired');
  }

}

module.exports = {
  encodeToken,
  decodeToken
};
