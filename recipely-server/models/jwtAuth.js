const moment = require('moment');
const jwt = require('jwt-simple');
const config = require('../config/config');

const secretKey = process.env.TOKEN_SECRET || config.TOKEN_SECRET

function encodeToken(userId, callback) {
  const payload = {
    exp: moment().add(7, 'days').unix(),
    iat: moment().unix(),
    sub: userId
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
