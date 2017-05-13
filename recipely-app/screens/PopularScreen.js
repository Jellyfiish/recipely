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
  }

  componentDidMount() {
    if (this.props.screenProps.popularRecipes === null) {
      fetch('https://jellyfiish-recipely.herokuapp.com/api/recipes')
        .then(res => res.json())
        .then(result => {
          this.props.screenProps.onPopularRecipesChange(result.recipes);
        }
      );
    }
  }

  render() {
    const {
      idToken,
      popularRecipes,
      recipes: savedRecipes,
      onRecipesChange,
      onPopularRecipesChange,
    } = this.props.screenProps;
    const { navigation } = this.props;


    return (
      <View style={styles.container}>

        { popularRecipes
          ? <ResultList
              navigation={navigation}
              recipes={popularRecipes}
              savedRecipes={savedRecipes}
              idToken={idToken}
              onRecipesChange={onRecipesChange}
              onSearchChange={(query, result) => onPopularRecipesChange(result)}
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
  },
});

export default PopularScreen;
