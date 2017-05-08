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
import { MaterialIcons } from '@expo/vector-icons';

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
              <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Button
                  title='Details'
                  onPress={() => this.onLearnMore(recipe)}
                />
                <MaterialIcons name="close" size={28} color="#aaa" />
              </View>
            </Card>
          );
        })
      }
    </ScrollView>
  );
};

export default RecipeList;
