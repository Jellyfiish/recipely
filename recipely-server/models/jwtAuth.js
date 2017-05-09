const moment = require('moment');
const jwt = require('jwt-simple');
const config = require('../config/config');

const secretKey = process.env.TOKEN_SECRET || config.TOKEN_SECRET

function encodeToken(user, callback) {
  const playload = {
    exp: moment().add(7, 'days').unix(),
    iat: moment().unix(),
    sub: user
  };
  callback(null, jwt.encode(playload, secretKey));
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

