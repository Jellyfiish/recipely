import Expo from 'expo';
import React, { Component } from 'react';
import DrawerNav from './navigation/routes';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      recipes: [],
      imageURI: null,
    };
  }

  onRecipesChange = (recipes) => {
    this.setState({recipes});
  };

  onImageChange = (imageURI) => {
    this.setState({imageURI});
  }

  render() {
    return (
      <DrawerNav
        screenProps={
          {
            recipes: this.state.recipes,
            imageURI: this.state.imageURI,
            onRecipesChange: this.onRecipesChange,
            onImageChange: this.onImageChange,
          }
        }
      />
    );
  }
}

Expo.registerRootComponent(App);
