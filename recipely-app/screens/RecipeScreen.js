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

  render() {
    const { navigation, screenProps } = this.props;

    return (
      <View style={styles.container}>
        { screenProps.recipes.length !== 0
          ? <RecipeList
              navigation={navigation}
              recipes={screenProps.recipes}
              notes={screenProps.notes}
              idToken={screenProps.idToken}
              onRecipesChange={screenProps.onRecipesChange}
            />
          : <View>
              <Text>You have no saved recipes.</Text>
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

export default RecipeScreen;
