import React, { Component } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View
} from 'react-native';
import ResultList from '../components/ResultList';

class SearchResultScreen extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { searchResults, onSearchChange } = this.props.screenProps;
    const { query } = this.props.navigation.state.params;
    if (!searchResults.hasOwnProperty(query)) {
      fetch(`https://jellyfiish-recipely.herokuapp.com/api/recipes?q=${query}`)
        .then(res => res.json())
        .then(results => onSearchChange(query, results.recipes));
    }
  }

  render() {
    const {
      searchResults,
      idToken,
      onRecipesChange,
      recipes: savedRecipes,
      onSearchChange
    } = this.props.screenProps;
    const { query } = this.props.navigation.state.params;
    const { navigation } = this.props;

    let recipes = [];
    if (searchResults.hasOwnProperty(query)) {
      recipes = searchResults[query];
    }

    return (
      <View style={styles.container}>
        { recipes.length !== 0
          ? <ResultList
              navigation={navigation}
              recipes={recipes}
              savedRecipes={savedRecipes}
              idToken={idToken}
              query={query}
              onRecipesChange={onRecipesChange}
              onSearchChange={onSearchChange}
            />
          : <View style={styles.loadingContainer}>
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
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SearchResultScreen;
