# Recipely

Find recipes based on a list of ingredients or photo. Think Shazam for food!

## Team

  - __Product Owner__: [Ilke Akcay](https://github.com/akcays)
  - __Scrum Master__: [Mark Schleske](https://github.com/mschlesk)
  - __Development Team Members__: [John Cheng](https://github.com/gzeegz), [Obay Mardini](https://github.com/obay-mardini)

## Table of Contents

1. [Requirements](#requirements)
1. [Technologies Used](#technologies-used)
1. [API Usage](#api-usage)
    1. [Login & Signup](#login-signup)
    1. [Clarifai Authentication](#clarifai-authentication)
    1. [Recipes From The Web](#recipes-from-the-web)
    1. [Saved Recipes](#saved-recipes)
    1. [Notes](#notes)
    1. [Users](#users)
1. [Development](#development)
    1. [Installing Dependencies](#installing-dependencies)
    1. [Installing Postgres](#installing-postgres)
    1. [Seed Database](#seed-database)
    1. [Configuring Environment Variables](#configuring-environment-variables)
    1. [Tests](#tests)
1. [Contributing](#contributing)
    1. [Roadmap](#roadmap)

## Requirements

- Node 6.x
- Postgresql 9.5.x
- Expo 16.0.0


## Technologies Used

* Server Side
  * Express - server framework
  * JWT - validation tokens
  * Postgres/pg - data persistance
* Client Side
  * Expo - mobile app bundling/development
  * React-native - frontend framework
  * React-navigation - mobile screen navigation
* External APIs
  * Clarifai API - image analysis
  * Food2Fork API - recipe database

## API Usage


### Login & Signup
* ### `POST /api/signup`

 Add and authenticate a new user. Pass the user's name and password in the body of the request:
```JSON
{
  "username": "Robin Kim",
  "password": "secretsecretsecret"
}
```
 Will return a valid JSON web token (JWT) string for use in other requests. Token payload contains the user's ID and username (under the `sub` and `user` keys, respectively). See [JWT.io](https://jwt.io/) for more information.

 To make requests to protected endpoints using a token, prepend the word "Bearer" to the token string and pass under the `x-access-token` header.

 e.g. `x-access-token:Bearer your.token.string`

 **Note: tokens will expire after 7 days.**

* ### `POST /api/login`

 Login an existing user. Pass the username and password in the body of the request, exactly as above. Will return a fresh token string if successful.


### Clarifai Authentication
This is a protected endpoint requiring a valid JSON web token. See the [Signup & Login](#login-signup) section above for how to obtain and pass tokens.

* ### `POST /api/clarifai`

 Request a Clarifai access token from the server for use in making requests directly to the Clarifai API. Returns the response object directly from the Clarifai API:

 ```JSON
 {
    "status": {
      "code": 10000,
      "description": "Ok"
    },
    "access_token": "clarifai_token_string",
    "expires_in": some_time,
    "scope": "api_access_write api_access api_access_read"
 }
 ```


### Recipes From The Web
* ### `GET /api/recipes`

 Fetch a list of recipes from the [Food2Fork](http://food2fork.com/) database. Optionally, you may search by ingredients by adding them as a comma separated string in the query string.

 e.q. `https://jellyfiish-recipely.herokuapp.com/api/recipes?q=rice,chicken`

 Will return an object containing an array of recipe objects. If no ingredients are given, will return the most popular recipes. This endpoint is meant to emulate the Food2Fork API as much as possible, while using the recipely server's Food2Fork API key.

 **Note: recipe objects do not contain the recipe ingredients. Please use the following endpoint to retrieve ingredients. Refer to the [Food2Fork documentation](http://food2fork.com/about/api) for more information.**

* ### `GET /api/recipes/:id`

 Fetch the details (including the ingredients) of a single recipe from the Food2Fork database. The recipe id can be obtained from the results of the above endpoint or from the Food2Fork website, and must be passed in the request url:

 e.g. `https://jellyfiish-recipely.herokuapp.com/api/recipes/54384`


### Saved Recipes
These are protected endpoints requiring a valid JSON web token. See the [Signup & Login](#login-signup) section for how to obtain and pass tokens.

* ### `GET /api/users/recipes`

 Fetch the user's saved/favorited recipes. No data must be passed other than the JSON web token. Returns an array of all recipes that the user has saved. Recipe objects contain the recipe id (under the `f2f_id` key), title, ingredients, source url, thumbnail url, and the number of recipely users who have saved that recipe.

 For example:
 ```JSON
  [
    {
      "f2f_id": "367438",
      "title": "How to Make Peepshi = Peeps Sushi",
      "ingredients": [
        "6 Peeps per roll, 1 Peep per handroll, 1 Peep per nigiri",
        "1 box of Rice Krispies Treats",
        "1 box of Fruit by the Foot"
      ],
      "source_url": "http://www.seriouseats.com/recipes/2010/03/peeps-recipes-how-to-make-peepshi-sushi-rice-krispies-treats-easter.html",
      "thumbnail_url": "http://static.food2fork.com/22100331peepshiprimarydb4a.jpg",
      "saved_count": 1
    },
    {
      "f2f_id": "48364",
      "title": "Vietnamese Pho: Beef Noodle Soup Recipe",
      "ingredients": [
        "2 onions, halved",
        "4\" nub of ginger, halved lengthwise",
        "5-6 lbs of good beef bones, preferably leg and knuckle",
        "etc..."
      ],
      "source_url": "http://www.steamykitchen.com/271-vietnamese-beef-noodle-soup-pho.html",
      "thumbnail_url": "http://static.food2fork.com/vietnamesephorecipe2200x150b8fd.jpg",
      "saved_count": 1
    }
  ]
 ```

* ### `POST /api/users/recipes`

 Add a new recipe to the user's list of saved recipes. Recipe details must be passed in the body of the request.

 **Note: the value of f2f_id is the recipe id.**

 For example:
 ```JSON
  {
    "f2f_id": "35169",
    "title": "Buffalo Chicken Chowder",
    "ingredients": [
      "2 tablespoons butter",
      "1 pound chicken cut into bite sized pieces",
      "1 onion diced",
      "2 carrots diced"
    ],
    "source_url": "http://www.closetcooking.com/2011/11/buffalo-chicken-chowder.html",
    "image_url": "http://static.food2fork.com/Buffalo2BChicken2BChowder2B5002B0075c131caa8.jpg",
  }
 ```

* ### `DELETE /api/users/recipes/:id`

 Remove a recipe from the user's list of saved recipes. The recipe/Food2Fork id must be passed in the request url.

 e.g. `https://jellyfiish-recipely.herokuapp.com/api/users/recipes/54384`

 Returns the deleted recipe object, if a match is found.


### Notes
These are protected endpoints requiring a valid JSON web token. See the [Signup & Login](#login-signup) section for how to obtain and pass tokens.

* ### `GET /api/users/notes`

 Fetch all notes for all recipes in the user's list of saved recipes. No data other than the JSON web token header is required. Returns an array of note objects. Each note object contains the note text, user id, recipe/Food2Fork id, note id, recipe title, and a thumbnail url.

 For example:
 ```JSON
  [
    {
      "text": "It's aight.",
      "user_id": 3,
      "f2f_id": "35169",
      "id": 4,
      "title": "Buffalo Chicken Chowder",
      "thumbnail_url": "http://static.food2fork.com/Buffalo2BChicken2BChowder2B5002B0075c131caa8.jpg"
    },
    {
      "text": "Add sardines next time.",
      "user_id": 3,
      "f2f_id": "48136",
      "id": 7,
      "title": "Sesame Almond Brown Rice Balls",
      "thumbnail_url": "http://static.food2fork.com/brown_rice_ballscf4e.jpg"
    }
  ]
 ```

* ### `GET /api/users/recipes/:id/notes`

 Fetch all notes for a specific recipe in the user's list of saved recipes. The recipe id must be passed in the request url.

 e.g. `https://jellyfiish-recipely.herokuapp.com/api/users/recipes/54384/notes`

 Returns an array of note objects similar to the above endpoint.

* ### `POST /api/users/recipes/notes`

 Add a new note to a specific recipe in the user's list of saved recipes. The recipe/Food2Fork id and note text must be passed in the body of the request.

 For example:
 ```JSON
  {
    "f2f_id": "35169",
    "text": "My first note."
  }
 ```

 Returns the added note object.

* ### `PUT /api/notes/:id`

 Modify an existing note. The note id must be passed in the request url, and the note text must be passed in the body of the request.

 For example:

 `https://jellyfiish-recipely.herokuapp.com/api/notes/21`
 ```JSON
  {
    "text": "My modified note."
  }
 ```

 Returns the modified text.

* ### `DELETE /api/notes/:id`

 Remove a specific note. The note id must be passed in the request url, as in the above endpoint. Returns the deleted note object.


### Users
These are protected endpoints requiring a valid JSON web token. See the [Signup & Login](#login-signup) section for how to obtain and pass tokens.

* ### `GET /api/users`

 Fetch a list of all usernames in the database. Returns an array of strings containing every username.

* ### `PUT /api/users`

 Modify the current user's username and/or password. Must pass the new username and/or the new password in the request body. You may choose to pass only the password, only the username, or both.

 For example:
 ```JSON
  {
    "username": "Jason Kim",
    "password": "whisperwhisperwhisper"
  }
 ```

 Returns an object containing all updated properties.

* ### `DELETE /api/users`

 Remove an existing user. No data other than the JSON web token header is required.


## Development

### Installing Dependencies

From within the recipely/recipely-server directory:

```sh
npm install
```

Repeat from inside the recipely/recipely-app directory.

### Installing Postgres

1. Install the appropriate postgres server software for your system:

 * Linux: `sudo apt-get install` or download and install the [binary from Enterprise DB](https://www.enterprisedb.com/downloads/postgres-postgresql-downloads).
 * Mac: Download [Postgres.app](http://postgresapp.com/) and follow the instructions on their site.
 * Windows: Download and install the [binary from Enterprise DB](https://www.enterprisedb.com/downloads/postgres-postgresql-downloads).

1. Create a user/role (unnecessary on Postgres.app):
 1. Follow the [first steps guide](https://wiki.postgresql.org/wiki/First_steps) to login as the default user `postgres`.
 1. Run the `CREATE USER new_username WITH PASSWORD 'new_password' CREATEDB;` query from within the psql shell to make a new user role with the ability to create databases.

1. Create a new database by running the `CREATE DATABASE database_name;` query from within the psql shell.

1. Use the above variables when forming your DATABASE_URL environment variable (see the [Configuring Environment Variables](#configuring-environment-variables) section).


### Seed Database

Some dummy data has been provided for testing. To seed your local postgres database, run `psql your_database_url -f sampleData.sql` in your terminal from within the recipely/recipely-server directory.

**CAUTION: this command will overwrite any pre-existing data in your database.**


### Configuring Environment Variables

* Server side

 1. Make a new file `config.js` in the `/recipely/recipely-server/config` directory using the existing `config.example.js` file as a template.

 1. Replace the `F2F_API_KEY` variable with your own [Food2Fork API](http://food2fork.com/about/api) key.

 1. Replace the `DATABASE_URL` variable with the path to your local Postgres server (e.g. `postgres://user:password@localhost:5432/mydatabasefile`).

 1. Replace the `TOKEN_SECRET` variable with your own secret phrase. This will be used to encode JSON web tokens.

 1. Replace the `CLIENT_ID` and `CLIENT_SECRET` variables with the id and secret associated with your own Clarifai account.

### Tests

The provided tests utilize the Mocha, Chai, and Sinon testing libraries, and may be run with the `npm test` command from within the `recipely/recipely-server` directory. This command will also generate and display a coverage report, provided by the Istanbul/nyc utility.

If you would prefer to generate an html coverage view, you may run the `npm run test:html` command. After the script has executed, navigate to the `recipely/recipely-server/coverage` directory and open the `index.html` file in your browser.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.

### Roadmap

View the project roadmap [here](https://github.com/Jellyfiish/recipely/issues)
