import Expo from 'expo';
import React, { Component } from 'react';
import DrawerNav from './navigation/routes';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      recipes: [],
      image: null,
    };
  }

  onRecipesChange = (recipes) => {
    this.setState({recipes});
  };

  onImageChange = (image) => {
    this.setState({image});
  }

  render() {
    return (
      <DrawerNav
        screenProps={
          {
            recipes: this.state.recipes,
            image: this.state.image,
            onRecipesChange: this.onRecipesChange,
            onImageChange: this.onImageChange,
          }
        }
      />
    );
  }
}

Expo.registerRootComponent(App);
