import React, { Component } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View
} from 'react-native';
import ResultList from '../components/ResultList';

class PopularScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      recipes: [],
    };
  }

  componentDidMount() {
    fetch('https://jellyfiish-recipely.herokuapp.com/api/recipes')
      .then(res => res.json())
      .then(result => {
          this.setState({recipes: result.recipes}, () => console.log('fetched popular recipes!'));
        }
      );
  }

  onSearchChange = (query, recipes) => {
    this.setState({recipes});
  };

  render() {
    const {
      idToken,
      onRecipesChange,
      recipes: savedRecipes,
    } = this.props.screenProps;
    const { navigation } = this.props;

    return (
      <View>

        { this.state.recipes.length !== 0
          ? <ResultList
              navigation={navigation}
              recipes={this.state.recipes}
              savedRecipes={savedRecipes}
              idToken={idToken}
              onRecipesChange={onRecipesChange}
              onSearchChange={this.onSearchChange}
            />
          : <View>
              <Text>Loading recipes</Text>
              <ActivityIndicator size="large" />
            </View>
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default PopularScreen;
