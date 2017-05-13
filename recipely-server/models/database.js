var pg = require('pg');
var Promise = require('bluebird');
var path = require('path');

var pgp = require('pg-promise')({
  promiseLib: Promise
});

var dbURL = process.env.DATABASE_URL || require('../config/config').DATABASE_URL;
var tableSql = path.join(__dirname,'../tables.sql');

var db = pgp(dbURL);

var qf = new pgp.QueryFile(tableSql);

db.query(qf)
.then(results => {
  console.log('Table creation successful.');
})
.catch(e => {
  console.error('Failed to create tables!\n', e);
});


module.exports = {
  queryAsync: db.result
};
