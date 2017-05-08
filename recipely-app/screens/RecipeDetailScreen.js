import Expo, { WebBrowser } from 'expo';
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  ScrollView,
  View,
  Button,
  Image
} from 'react-native';
import IngredientList from '../components/IngredientList';

class RecipeDetailScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ingredients: null,
    };
  }

  componentDidMount() {
    const { recipe_id } = this.props.navigation.state.params;
    fetch(`http://food2fork.com/api/get?key=295ed39bbf2754f3f2fb1cf50295878d&rId=${recipe_id}`)
      .then(res => res.json())
      .then(result => this.setState({ ingredients: result.recipe.ingredients }));
  }

  handlePressButtonAsync = async () => {
    const { source_url } = this.props.navigation.state.params;
    let result = await WebBrowser.openBrowserAsync(source_url);
    this.setState({ result });
  };

  render() {
    const { title, image_url} = this.props.navigation.state.params;

    return (
      <ScrollView>
        <Text>{title}</Text>
        <Image
          source={{ uri: image_url }}
          style={{ width: 100, height: 100 }}
        />
        { this.state.ingredients
          ? <IngredientList ingredients={this.state.ingredients} />
          : <Text>Loading ingredients...</Text>
        }
        <Button
          title="Directions"
          onPress={this.handlePressButtonAsync}
        />
      </ScrollView>
    );
  }
}

export default RecipeDetailScreen;
