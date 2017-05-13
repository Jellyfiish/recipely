import Expo, { WebBrowser } from 'expo';
import React, { Component } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  ScrollView,
  View,
  Image,
  KeyboardAvoidingView
} from 'react-native';
import { Button, Card } from 'react-native-elements';
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
    const { idToken, title, f2f_id, thumbnail_url } = this.props.navigation.state.params;
    this.props.navigation.navigate('AddNote', {
      idToken,
      title,
      f2f_id,
      thumbnail_url,
      onGoBack: (notes) => this.updateNotes(notes),
    });
  }

  // Delete note
  onDeletePress = (note) => {
    // Remove note from user's list of notes
    this.props.screenProps.onNotesChange(
      this.props.screenProps.notes.filter(otherNote => otherNote.id !== note.id)
    );
    // Show notes that are associated with this recipe except for the deleted one
    this.setState({
      notes: this.state.notes.filter(otherNote => otherNote.id !== note.id)
    });
    // Remove note from database
    const { idToken } = this.props.navigation.state.params;
    fetch(`https://jellyfiish-recipely.herokuapp.com/api/notes/${note.id}`, {
      method: 'DELETE',
      headers: {
        'x-access-token': `Bearer ${idToken}`,
      },
    });
  };

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
            color='white'
            fontWeight='bold'
            backgroundColor='#397af8'
            raised
            onPress={this.handlePressButtonAsync}
          />
        </Card>

        <View>
          <Text>Notes</Text>

          { this.state.notes.map(note => {
              return (
                <Card key={note.id}>
                  <Text>{note.text}</Text>
                  <View style={styles.buttonContainer}>
                    <Button
                      title='Edit'
                      color='white'
                      fontWeight='bold'
                      backgroundColor='#397af8'
                      raised
                      icon={{name: 'mode-edit'}}
                      onPress={() => this.onEditPress(note)}
                    />

                    <Button
                      title='Delete'
                      color='white'
                      fontWeight='bold'
                      backgroundColor='#397af8'
                      raised
                      icon={{name: 'delete'}}
                      onPress={() => this.onDeletePress(note)}
                    />
                  </View>
                </Card>
              );
            })
          }
          <View style={styles.buttonMargins}>
            <Button
              title='Add'
              color='white'
              fontWeight='bold'
              backgroundColor='#397af8'
              raised
              icon={{name: 'note-add'}}
              onPress={() => this.onAddPress()}
            />
          </View>
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
  buttonMargins: {
    marginTop: 5,
    marginBottom: 5,
  }
});

export default RecipeDetailScreen;
