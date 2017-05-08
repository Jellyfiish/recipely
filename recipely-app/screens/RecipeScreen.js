import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';
import RecipeList from '../components/RecipeList';

class RecipeScreen extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    fetch('http://food2fork.com/api/search?key=295ed39bbf2754f3f2fb1cf50295878d')
      .then(res => res.json())
      .then(results => this.props.screenProps.onRecipesChange(results.recipes));
  }

  render() {
    const { navigation, screenProps } = this.props;

    return (
      <View style={styles.container}>
        <Text>Saved recipes</Text>
        { screenProps.recipes.length !== 0
          ? <RecipeList
              navigation={navigation}
              recipes={screenProps.recipes}
            />
          : <Text>Loading recipes...</Text>
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default RecipeScreen;
