import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  ScrollView,
  View,
  Button,
  Image
} from 'react-native';

const RecipeList = ({ navigation, recipes }) => {
  onLearnMore = (recipe) => {
    navigation.navigate('Details', { ...recipe });
  }

  return (
    <ScrollView>
      <View>
        { recipes.map(recipe => {
            return (
              <View key={recipe.recipe_id}>
                <Text>{recipe.title}</Text>
                <Image
                  source={{ uri: recipe.image_url }}
                  style={{ width: 100, height: 100 }}
                />
                <Button
                  onPress={() => this.onLearnMore(recipe)}
                  title="More details"
                />
              </View>
            );
          })
        }
      </View>
    </ScrollView>
  );
};

export default RecipeList;
