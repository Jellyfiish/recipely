var pg = require('pg');
var Promise = require('bluebird');
var pgp = require('pg-promise')({
  promiseLib: Promise
});
var url = require('url');

var dbURL = process.env.DATABASE_URL || require('../config/config').DATABASE_URL;
var tableSql = './tables.sql';

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
