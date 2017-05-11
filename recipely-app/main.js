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
        }
      ]
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

  onIngredientChange = (ingredients) => {
    this.setState({ingredients});
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
            ingredients: this.state.ingredients,
            notes: this.state.notes,
            onRecipesChange: this.onRecipesChange,
            onImageChange: this.onImageChange,
            onPredictionsChange: this.onPredictionsChange,
            onSearchChange: this.onSearchChange,
            onIngredientChange: this.onIngredientChange,
          }
        }
      />
    );
  }
}

Expo.registerRootComponent(App);
