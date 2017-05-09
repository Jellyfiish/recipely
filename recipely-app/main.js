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

  render() {
    return (
      <DrawerNav
        screenProps={
          {
            recipes: this.state.recipes,
            image: this.state.image,
            predictions: this.state.predictions,
            onRecipesChange: this.onRecipesChange,
            onImageChange: this.onImageChange,
            onPredictionsChange: this.onPredictionsChange,
          }
        }
      />
    );
  }
}

Expo.registerRootComponent(App);
