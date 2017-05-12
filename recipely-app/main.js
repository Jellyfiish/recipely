import Expo from 'expo';
import React, { Component } from 'react';
import { AsyncStorage, StyleSheet, ActivityIndicator, View, Text, Button } from 'react-native';
import StartupStack from './navigation/routes';
import jwtDecode from 'jwt-decode';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isAppReady: false,
      isLoggedIn: false,
      idToken: null,
      user: { username: null, userId: null },
      recipes: [],
      image: null,
      predictions: [],
      searchResults: {},
      ingredients: [
        {name: 'blueberry'},
        {name: 'strawberry'},
        {name: 'blackberry'}
      ],
      notes: [
        {
          text: 'sample test note for Iced Coffee',
          recipe_title: 'Iced Coffee',
          id: 1
        },
        {
          text: 'sample test note for Jalapeno Popper Grilled Cheese Sandwich',
          recipe_title: 'Jalapeno Popper Grilled Cheese Sandwich',
          id: 2
        },
        {
          text: 'sample test note for Crash Hot Potatoes',
          recipe_title: 'Crash Hot Potatoes',
          id: 3
        },
        {
          text: 'sample test note for Stovetop Avocado Mac and Cheese',
          recipe_title: 'Stovetop Avocado Mac and Cheese',
          id: 4
        },
        {
          text: 'sample test note for Cinnamon Rolls',
          recipe_title: 'Cinnamon Rolls',
          id: 5
        },
        {
          text: 'sample test note for Parmesan Roasted Potatoes',
          recipe_title: 'Parmesan Roasted Potatoes',
          id: 6
        },
        {
          text: 'sample test note for Chocolate Cake',
          recipe_title: 'Chocolate Cake',
          id: 7
        },
      ]
    };
  }

  componentDidMount() {
    AsyncStorage.getItem('id_token', (error, idToken) => {
      // Check if the user is still logged in
      if (idToken !== null) {
        this.setState({isLoggedIn: true});
        this.setIdToken(idToken);
        // Fetch user's recipes
        const fetchRecipes = fetch('https://jellyfiish-recipely.herokuapp.com/api/users/recipes', {
          headers: { 'x-access-token': `Bearer ${this.state.idToken}` }
        }).then(res => {
            if (res.status === 200) {
              res.json()
                .then(recipes => this.onRecipesChange(recipes));
            }
        });

        // Fetch user's notes
        const fetchNotes = fetch('https://jellyfiish-recipely.herokuapp.com/api/users/notes', {
          headers: { 'x-access-token': `Bearer ${this.state.idToken}` }
        }).then(res => {
            if (res.status === 200) {
              res.json()
                .then(notes => this.onNotesChange(notes));
            }
        });

        // App is ready when the user's recipes and notes have been fetched.
        Promise.all([fetchRecipes, fetchNotes])
          .then(() => this.setState({isAppReady: true}));
      } else {
        this.setState({isAppReady: true});
      }
    });
  }

  setIdToken = (idToken) => {
    if (idToken === null) {
      this.setState({
        idToken: null,
        user: { username: null, userId: null }
      });
    } else {
      // Set token and user information
      const decoded = jwtDecode(idToken);
      this.setState({
        idToken,
        user: {
          username: decoded.user,
          userId: decoded.sub
        }
      });
    }
  };

  onRecipesChange = (recipes) => {
    this.setState({recipes});
  };

  onImageChange = (image) => {
    this.setState({image});
  }

  onPredictionsChange = (predictions) => {
    this.setState({predictions});
  }

  onSearchChange = (query, results) => {
    this.setState({
      searchResults: { ...this.state.searchResults, [query]: results }
    });
  };

  onIngredientChange = (ingredients) => {
    this.setState({ingredients});
  };

  onLoginChange = () => {
    this.setState({isLoggedIn: !this.state.isLoggedIn});
  }

  onNotesChange = (notes) => {
    this.setState({notes});
  };

  render() {
    return (
      <StartupStack
        screenProps={
          {
            isAppReady: this.state.isAppReady,
            isLoggedIn: this.state.isLoggedIn,
            user: this.state.user,
            recipes: this.state.recipes,
            image: this.state.image,
            predictions: this.state.predictions,
            searchResults: this.state.searchResults,
            ingredients: this.state.ingredients,
            notes: this.state.notes,
            setIdToken: this.setIdToken,
            onRecipesChange: this.onRecipesChange,
            onImageChange: this.onImageChange,
            onPredictionsChange: this.onPredictionsChange,
            onSearchChange: this.onSearchChange,
            onIngredientChange: this.onIngredientChange,
            onLoginChange: this.onLoginChange,
            onNotesChange: this.onNotesChange,
          }
        }
      />
    );
  }
}

Expo.registerRootComponent(App);
