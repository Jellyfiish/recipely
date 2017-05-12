// TODO: RecipeList.js and ResultList.js share a lot of code. Maybe refactor to
// use higher order components.
import React from 'react';
import {
  StyleSheet,
  Text,
  ScrollView,
  View,
  Button
} from 'react-native';
import { Card } from 'react-native-elements';
import { MaterialIcons } from '@expo/vector-icons';

// Navigation prop needs to be passed down because it does not get passed down
// child components.
const ResultList = ({ navigation, recipes, idToken }) => {
  onLearnMore = (recipe) => {
    // When user presses on "Details" button, navigate them to a detail screen.
    // Pass down props that can be acessed using this.props.navigation.state.params
    navigation.navigate('SearchDetail', { ...recipe });
  }

  handleSaveRecipeButton = async (recipe) => {
    // Pushing the recipe to recipes array in the form its received from f2f api which will trigger re-render as well
    recipes.push(recipe);
    // Making get request to get details of recipe so that it can be added to database
    let recipeObj = await fetch(`https://jellyfiish-recipely.herokuapp.com/api/recipes/${recipe.recipe_id}`);
    recipeObj = JSON.parse(recipeObj._bodyInit).recipe;
    // Adding f2f_id to make it compliant with enpoint for post request
    recipeObj.f2f_id = recipeObj.recipe_id;
    // with request body have required data in it, make the post request to add recipe to database
    fetch('https://jellyfiish-recipely.herokuapp.com/api/recipes/', {
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': `Bearer ${idToken}`,
      },
      method: 'POST',
      body: JSON.stringify(recipeObj),
    });
  }

  return (
    <ScrollView>
      { recipes.map(recipe => {
          return (
            <Card
              key={recipe.recipe_id}
              title={recipe.title}
              image={{ uri: recipe.image_url }}
            >
              <Text style={styles.publisherText}>{recipe.publisher}</Text>
              <View style={styles.buttonContainer}>
                <Button
                  title='Details'
                  onPress={() => this.onLearnMore(recipe)}
                />
                <MaterialIcons name="add" size={28} color="#aaa" onPress={() => this.handleSaveRecipeButton(recipe)} />
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

export default ResultList;
