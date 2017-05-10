var pg = require('pg');
var Promise = require('bluebird');
var url = require('url');

// promisify pg functions
Object.keys(pg).forEach(function(key) {
  var Class = pg[key];
  if (typeof Class === "function") {
    Promise.promisifyAll(Class.prototype);
    Promise.promisifyAll(Class);
  }
});
Promise.promisifyAll(pg);

var dbURL = process.env.DATABASE_URL || require('../config/config').DATABASE_URL;
var dbParams = url.parse(dbURL);
var dbAuth = dbParams.auth.split(':');

var config = {
  user: dbAuth[0],
  password: dbAuth[1],
  host: dbParams.hostname,
  port: dbParams.port,
  database: dbParams.pathname.split('/')[1],
  max: 20,
  idleTimeoutMillis: 5000
};

var client = new pg.Pool(config);

// table creation SQL queries
var tableQueries = [
  'CREATE TABLE users(ID SERIAL PRIMARY KEY, username VARCHAR(40) not null, password VARCHAR(64) not null)',
  'CREATE TABLE recipes(f2f_id varchar(40) PRIMARY KEY, title VARCHAR(40) not null, ingredients VARCHAR(255) not null, source_url VARCHAR(255) not null, thumbnail_url VARCHAR(255) not null, saved_count INTEGER not null)',
  'CREATE TABLE recipes_users(ID SERIAL PRIMARY KEY, user_id INTEGER REFERENCES users (id), f2f_id VARCHAR(40) REFERENCES recipes (f2f_id))',
  'CREATE TABLE notes(ID SERIAL PRIMARY KEY, text VARCHAR(255) not null, user_id INTEGER REFERENCES users (id) not null, f2f_id VARCHAR(40) REFERENCES recipes (f2f_id) not null)'
];

tableQueries.forEach(function(query) {
  client.queryAsync(query).then(res => {
    console.log(`Successful table creation query!\n  Results: ${res}`);
  }).catch(e => {
    console.error(`Failed to query database!\nError: ${e}`);
  });
});


module.exports = client;
