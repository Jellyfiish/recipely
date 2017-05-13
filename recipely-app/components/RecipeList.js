// TODO: RecipeList.js and ResultList.js share a lot of code. Maybe refactor to
// use higher order components.
import React from 'react';
import {
  StyleSheet,
  Text,
  ScrollView,
  View
} from 'react-native';
import { Card } from 'react-native-elements';
import { MaterialIcons } from '@expo/vector-icons';
import Button from '../components/CustomButton';

// Navigation prop needs to be passed down because it does not get passed down
// child components.
const RecipeList = ({ navigation, recipes, notes, idToken, onRecipesChange }) => {
  onLearnMore = (recipe) => {
    // When user presses on "Details" button, navigate them to a detail screen.
    // Pass down props that can be acessed using this.props.navigation.state.params
    const recipeNotes = notes.filter(note => note.f2f_id === recipe.f2f_id);
    navigation.navigate('Details', { ...recipe, notes: recipeNotes, idToken });
  }

  // Delete recipe
  onDeletePress = (recipe) => {
    // Remove recipe from user's list of recipes
    onRecipesChange(
      recipes.filter(otherRecipe => otherRecipe.f2f_id !== recipe.f2f_id)
    );
    // Remove user's saved recipe from database
    fetch(`https://jellyfiish-recipely.herokuapp.com/api/users/recipes/${recipe.f2f_id}`, {
      method: 'DELETE',
      headers: {
        'x-access-token': `Bearer ${idToken}`,
      },
    });
  };

  return (
    <ScrollView>
      { recipes.map(recipe => {
          return (
            <Card
              key={recipe.f2f_id}
              title={recipe.title}
              image={{ uri: recipe.thumbnail_url }}
            >
              <View style={styles.buttonContainer}>
                <Button
                  title='Details'
                  icon={{name: 'explore'}}
                  buttonStyle={{marginLeft: 0}}
                  onPress={() => this.onLearnMore(recipe)}
                />

                <Button
                  title='Delete'
                  icon={{name: 'delete'}}
                  buttonStyle={{marginRight: 0}}
                  onPress={() => this.onDeletePress(recipe)}
                />
              </View>
            </Card>
          );
        })
      }
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  publisherText: {
    marginBottom: 10,
  },
});

export default RecipeList;
