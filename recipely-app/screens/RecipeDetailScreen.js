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
    const { title, image_url, publisher} = this.props.navigation.state.params;

    return (
      <ScrollView>
        <Card
          title={title}
          titleStyle={{fontSize: 16}}
          image={{ uri: image_url }}
        >
          <Text style={{fontSize: 16, marginBottom: 10}}>{publisher}</Text>
          { this.state.ingredients
            ? <View>
                <Text style={{fontSize: 16, fontWeight: 'bold'}}>Ingredients</Text>
                <IngredientList ingredients={this.state.ingredients}
                />
              </View>
            : <View>
                <Text>Loading ingredients</Text>
                <ActivityIndicator size="large" />
              </View>
          }
          <Button
            title='Directions'
            onPress={this.handlePressButtonAsync}
          />
        </Card>
      </ScrollView>
    );
  }
}

export default RecipeDetailScreen;
