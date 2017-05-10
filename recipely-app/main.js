import Expo from 'expo';
import React, { Component } from 'react';
import DrawerNav from './navigation/routes';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      recipes: [],
      image: null,
      predictions: [],
      searchResults: {},
    };
  }

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

  render() {
    return (
      <DrawerNav
        screenProps={
          {
            recipes: this.state.recipes,
            image: this.state.image,
            predictions: this.state.predictions,
            searchResults: this.state.searchResults,
            onRecipesChange: this.onRecipesChange,
            onImageChange: this.onImageChange,
            onPredictionsChange: this.onPredictionsChange,
            onSearchChange: this.onSearchChange,
          }
        }
      />
    );
  }
}

Expo.registerRootComponent(App);
