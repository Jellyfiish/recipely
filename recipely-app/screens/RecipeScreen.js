import React, { Component } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import RecipeList from '../components/RecipeList';

class RecipeScreen extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    fetch('https://jellyfiish-recipely.herokuapp.com/api/recipes?q=')
      .then(res => res.json())
      .then(results => this.props.screenProps.onRecipesChange(results.recipes));
  }

  render() {
    const { navigation, screenProps } = this.props;

    return (
      <View style={styles.container}>
        { screenProps.recipes.length !== 0
          ? <RecipeList
              navigation={navigation}
              recipes={screenProps.recipes}
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

export default RecipeScreen;
