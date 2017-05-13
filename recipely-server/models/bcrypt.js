var bcrypt = require('bcrypt');
var Promise = require('bluebird');

function hashPassword(password, callback) {
  bcrypt.hash(password, 10, function(err, hash) {
    if(err) callback(err);
    if(hash) callback(null, hash)
  });
}

function comparePassword(password, hashedPassword, callback) {
  bcrypt.compare(password, hashedPassword, function(err, match) {
      if(err) callback(err);
      callback(null, match);
  });
}

module.exports.hashPassword = Promise.promisify(hashPassword);
module.exports.comparePassword = Promise.promisify(comparePassword);

