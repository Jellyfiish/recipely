import Expo from 'expo';
import React, { Component } from 'react';
import DrawerNav from './navigation/routes';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      recipes: [],
    };
  }

  onRecipesChange = (recipes) => {
    this.setState({recipes});
  };

  render() {
    return (
      <DrawerNav
        screenProps={
          {
            recipes: this.state.recipes,
            onRecipesChange: this.onRecipesChange,
          }
        }
      />
    );
  }
}

Expo.registerRootComponent(App);
