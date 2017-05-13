CREATE TABLE IF NOT EXISTS users(
  ID SERIAL PRIMARY KEY,
  username VARCHAR(40) not null,
  password VARCHAR(64) not null
);

CREATE TABLE IF NOT EXISTS recipes(
  f2f_id varchar(40) PRIMARY KEY,
  title VARCHAR(40) not null,
  ingredients TEXT not null,
  source_url VARCHAR(255) not null,
  thumbnail_url VARCHAR(255) not null,
  saved_count INTEGER not null
);

CREATE TABLE IF NOT EXISTS recipes_users(
  ID SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users (id),
  f2f_id VARCHAR(40) REFERENCES recipes (f2f_id)
);

CREATE TABLE IF NOT EXISTS notes(
  ID SERIAL PRIMARY KEY,
  text VARCHAR(255) not null,
  user_id INTEGER REFERENCES users (id) not null,
  f2f_id VARCHAR(40) REFERENCES recipes (f2f_id) not null
);

