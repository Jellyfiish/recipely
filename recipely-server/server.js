var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var morgan = require('morgan');
var handlers = require('./models/handlers');
var isAuthenticated = require('./utils/auth');

app.use(morgan('dev'));
app.use(bodyParser.json());

// the following line is needed because heroku assigns a port dynamically
// default to 8080 for development
var port = process.env.PORT || 8080;

// recipes endpoints
app.get('/api/recipes', handlers.getRecipes);

app.get('/api/recipes/:id', handlers.getRecipe);

app.post('/api/users/recipes', isAuthenticated, handlers.postUserRecipes);

app.get('/api/users/recipes', isAuthenticated, handlers.getUsersRecipes);

app.delete('/api/users/recipes/:recipeId', isAuthenticated, handlers.deleteUsersRecipe);

// auth endpoints
app.post('/api/login', handlers.postLogin);

app.post('/api/signup', handlers.postSignup);

// users endpoints
app.get('/api/users', isAuthenticated, handlers.getUsers);

app.put('/api/users', isAuthenticated, handlers.putUsers);

app.delete('/api/users', isAuthenticated, handlers.deleteUsers);

// notes endpoints
app.get('/api/users/notes', isAuthenticated, handlers.getNotes);

app.get('/api/users/recipes/:id/notes', isAuthenticated, handlers.getRecipeNotes);

app.post('/api/users/recipes/notes', isAuthenticated, handlers.postRecipeNote);

app.put('/api/notes/:id_note', isAuthenticated, handlers.putNote);

app.delete('/api/notes/:id_note', isAuthenticated, handlers.deleteNote);


app.listen(port, function() {
  console.log('Server is now listening on port', port);
});