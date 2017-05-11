-- DROP TABLE IF EXISTS notes CASCADE;
-- DROP TABLE IF EXISTS recipes_users CASCADE;
-- DROP TABLE IF EXISTS recipes CASCADE;
-- DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE IF NOT EXISTS users(
  ID SERIAL PRIMARY KEY,
  username VARCHAR(40) NOT NULL,
  password VARCHAR(64) NOT NULL
);

CREATE TABLE IF NOT EXISTS recipes(
  f2f_id varchar(40) PRIMARY KEY,
  title VARCHAR(40) NOT NULL,
  ingredients VARCHAR(255) NOT NULL,
  source_url VARCHAR(255) NOT NULL,
  thumbnail_url VARCHAR(255) NOT NULL,
  saved_count INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS recipes_users(
  ID SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users (id),
  f2f_id VARCHAR(40) REFERENCES recipes (f2f_id)
);

CREATE TABLE IF NOT EXISTS notes(
  ID SERIAL PRIMARY KEY,
  text VARCHAR(255) NOT NULL,
  user_id INTEGER REFERENCES users (id) NOT NULL,
  f2f_id VARCHAR(40) REFERENCES recipes (f2f_id) NOT NULL
);

TRUNCATE TABLE users, recipes_users, notes, recipes;

-- users
-- All user passwords are '1234'
INSERT INTO users (username, password) VALUES
  ('John Cheng', '$2a$10$Eg8Bvm54S/idFEGZICqxaOOJebIbQPf3caQ10lDpS6KRZdWENVe56'),
  ('Obay Mardini', '$2a$10$Hzb7J3i3Al5bcAAMsBIYBOPN34tXLI9sLRnWleNcrxWpMKD8xH17C'),
  ('Ilke Akcay', '$2a$10$4U4KEJPxmA7gPoITt88L5OkJmMdkSwdDHrlCGUsevgzG8.f/.1kRW'),
  ('Mark Schleske', '$2a$10$pXdcNYWS0w/7OqUUEyAimOd4gHOpk1gbZggh6w54QaeYx2VA06yam');

-- recipes
INSERT INTO recipes (f2f_id, title, ingredients, source_url, thumbnail_url, saved_count) VALUES
  ('35169', 'Buffalo Chicken Chowder', '2 tablespoons butter,1 pound chicken cut into bite sized pieces,1 onion diced,2 carrots diced,2 stalks celery diced
', 'http://www.closetcooking.com/2011/11/buffalo-chicken-chowder.html', 'http://static.food2fork.com/Buffalo2BChicken2BChowder2B5002B0075c131caa8.jpg', 3),
  ('367438', 'How to Make Peepshi = Peeps Sushi', '6 Peeps per roll,1 Peep per handroll,1 Peep per nigiri,1 box of Rice Krispies Treats,1 box of Fruit by the Foot', 'http://www.seriouseats.com/recipes/2010/03/peeps-recipes-how-to-make-peepshi-sushi-rice-krispies-treats-easter.html', 'http://static.food2fork.com/22100331peepshiprimarydb4a.jpg', 1),
  ('48136', 'Sesame Almond Brown Rice Balls', '2 cups / 14 oz / 400 g brown sushi rice (stubby, short grains),3 cups / 710 ml water,1/2 teaspoon fine grain sea salt,1/4 cup / 1.5 oz / 45 g sesame seeds (white/black mix)', 'http://www.101cookbooks.com/archives/sesame-almond-brown-rice-balls-recipe.html', 'http://static.food2fork.com/brown_rice_ballscf4e.jpg', 2),
  ('48364', 'Vietnamese Pho: Beef Noodle Soup Recipe', '2 onions, halved,4" nub of ginger, halved lengthwise,5-6 lbs of good beef bones, preferably leg and knuckle,1 lb of beef meat - chuck, brisket, rump, cut into large slices [optional],6 quarts of water', 'http://www.steamykitchen.com/271-vietnamese-beef-noodle-soup-pho.html', 'http://static.food2fork.com/vietnamesephorecipe2200x150b8fd.jpg', 1);

-- recipes_users
INSERT INTO recipes_users (user_id, f2f_id) VALUES
  ((SELECT id FROM users WHERE username = 'Ilke Akcay'), '35169'),
  ((SELECT id FROM users WHERE username = 'Mark Schleske'), '35169'),
  ((SELECT id FROM users WHERE username = 'John Cheng'), '35169'),
  ((SELECT id FROM users WHERE username = 'Obay Mardini'), '367438'),
  ((SELECT id FROM users WHERE username = 'Ilke Akcay'), '48136'),
  ((SELECT id FROM users WHERE username = 'John Cheng'), '48136'),
  ((SELECT id FROM users WHERE username = 'Obay Mardini'), '48364');

-- notes
INSERT INTO notes (text, user_id, f2f_id) VALUES
  (E'I\'m a bigly fan of this recipe.', (SELECT id FROM users WHERE username = 'Mark Schleske'), '35169'),
  ('Needs hot sauce tho.', (SELECT id FROM users WHERE username = 'Mark Schleske'), '35169'),
  ('The shazam of buffalo chicken chowder.', (SELECT id FROM users WHERE username = 'John Cheng'), '35169'),
  (E'It\'s aight.', (SELECT id FROM users WHERE username = 'Ilke Akcay'), '35169'),
  ('This honestly sounds awful.', (SELECT id FROM users WHERE username = 'Obay Mardini'), '367438'),
  ('I have weird tastes.', (SELECT id FROM users WHERE username = 'Obay Mardini'), '367438'),
  ('Add sardines next time.', (SELECT id FROM users WHERE username = 'Ilke Akcay'), '48136'),
  ('Dope.', (SELECT id FROM users WHERE username = 'John Cheng'), '48136'),
  ('Das pho.', (SELECT id FROM users WHERE username = 'Obay Mardini'), '48364'),
  ('Hallo danke.', (SELECT id FROM users WHERE username = 'Obay Mardini'), '48364');

-- Strings that begin with E are escape strings.
-- see https://www.postgresql.org/docs/9.5/static/sql-syntax-lexical.html
