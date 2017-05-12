import Expo, { WebBrowser } from 'expo';
import React, { Component } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  ScrollView,
  View,
  Button,
  Image,
  KeyboardAvoidingView
} from 'react-native';
import { Card } from 'react-native-elements';
import IngredientList from '../components/IngredientList';
import { MaterialIcons } from '@expo/vector-icons';

class RecipeDetailScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ingredients: this.props.navigation.state.params.ingredients,
      notes: this.props.navigation.state.params.notes,
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

  // Navigate to edit screen
  onEditPress = (note) => {
    const idToken = this.props.navigation.state.params.idToken;
    this.props.navigation.navigate('EditNote', {
      note,
      idToken,
      // navigation.goBack() does not trigger a render in previous component.
      // This function will trigger a render when called.
      onGoBack: (notes) => this.updateNotes(notes),
    });
  };

  // Navigate to add note screen
  onAddPress = () => {
    const { idToken, title } = this.props.navigation.state.params;
    this.props.navigation.navigate('AddNote', {idToken, title});
  }

  updateNotes = (notes) => {
    this.setState({notes});
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

        <View>
          <Text>Notes</Text>
          <Button
            title="Add"
            onPress={() => this.onAddPress()}
          />

          { this.state.notes.map(note => {
              return (
                <Card key={note.id}>
                  <Text>{note.text}</Text>
                  <View style={styles.buttonContainer}>
                    <Button
                      title='Edit'
                      onPress={() => this.onEditPress(note)}
                      />
                    <MaterialIcons name="close" size={28} color="#aaa" />
                  </View>
                </Card>
              );
            })
          }
        </View>
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
});

export default RecipeDetailScreen;
