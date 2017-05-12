import Expo, { WebBrowser } from 'expo';
import React, { Component } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  ScrollView,
  View,
  Button,
  Image
} from 'react-native';
import { Card } from 'react-native-elements';
import IngredientList from '../components/IngredientList';

class RecipeDetailScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ingredients: this.props.navigation.state.params.ingredients,
    };
  }

  componentDidMount() {
    const { recipe_id } = this.props.navigation.state.params;
    // Fetch ingredients if no ingredients were passed down
    if (!this.state.ingredients) {
      fetch(`https://jellyfiish-recipely.herokuapp.com/api/recipes/${recipe_id}`)
        .then(res => res.json())
        .then(result => this.setState({ ingredients: result.recipe.ingredients }));
    }
  }

  // Open web browser with directions to recipe
  handlePressButtonAsync = async () => {
    const { source_url } = this.props.navigation.state.params;
    let result = await WebBrowser.openBrowserAsync(source_url);
  };

  render() {
    const { title, thumbnail_url, image_url } = this.props.navigation.state.params;

    return (
      <ScrollView>
        <Card
          title={title}
          titleStyle={styles.titleStyle}
          image={{ uri: thumbnail_url || image_url }}
        >
          <View>
            <Text style={styles.ingredientText}>Ingredients</Text>
            { this.state.ingredients
              ? <View>
                  <IngredientList ingredients={this.state.ingredients}
                  />
                </View>
              : <View>
                  <Text>Loading ingredients</Text>
                  <ActivityIndicator size="large" />
                </View>
            }
          </View>

          <Button
            title='Directions'
            onPress={this.handlePressButtonAsync}
          />
        </Card>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  titleStyle: {
    fontSize: 16,
  },
  publisherText: {
    fontSize: 16,
    marginBottom: 10
  },
  ingredientText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RecipeDetailScreen;
