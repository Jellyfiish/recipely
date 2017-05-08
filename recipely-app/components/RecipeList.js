import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  ScrollView,
  View,
  Button,
  Image
} from 'react-native';
import { Card } from 'react-native-elements';

const RecipeList = ({ navigation, recipes }) => {
  onLearnMore = (recipe) => {
    navigation.navigate('Details', { ...recipe });
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
              <Text style={{marginBottom: 10}}>{recipe.publisher}</Text>
              <Button
                title='Details'
                onPress={() => this.onLearnMore(recipe)}
              />
            </Card>
          );
        })
      }
    </ScrollView>
  );
};

export default RecipeList;
