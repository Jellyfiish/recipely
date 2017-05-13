import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  FlatList,
  TextInput,
  KeyboardAvoidingView
} from 'react-native';
import { List, ListItem } from 'react-native-elements';
import Button from '../components/CustomButton';

class SearchScreen extends Component {
  constructor(props) {
    super(props);

    this.state = { input: '' };
  }

  // Add ingredient to list
  addIngredients = (event) => {
    this.setState({ input: '' });
    this.props.screenProps.onIngredientChange(
      [
        {name: event.nativeEvent.text},
        ...this.props.screenProps.ingredients
      ]
    );
  };

  onInputChange = (event) => {
    this.setState({input: event.nativeEvent.text});
  };

  // Remove ingredient from list
  onRemovePress = (i) => {
    const ingredients = this.props.screenProps.ingredients;
    this.props.screenProps.onIngredientChange(
      [
        ...ingredients.slice(0, i),
        ...ingredients.slice(i + 1)
      ]
    );
  };

  // Find recipes based on list of ingredients
  onFindRecipesPress = () => {
    // Create a comma separated string of ingredients to pass to our API call
    const query = this.props.screenProps.ingredients.map(item => item.name).join(',');
    // Change screen only if there is some ingredient being searched
    if (query.length !== 0) {
      this.props.navigation.navigate('SearchResult', {query});
    }
  };

  render() {
    const { ingredients } = this.props.screenProps;

    return (
      <View style={styles.container}>
        <View style={styles.wrapper}>
          <View style={styles.inputWrap}>
            <TextInput
              style={styles.input}
              placeholder="Add an ingredient"
              value={this.state.input}
              onChange={this.onInputChange}
              onSubmitEditing={this.addIngredients}
            />
          </View>

          <Text style={styles.ingredientHeading}>Ingredients:</Text>

          <ScrollView>
            { ingredients.map((item, i) => {
                return (
                  <View
                    key={i}
                    style={styles.rowContainer}
                  >
                    <Text>{item.name}</Text>
                    { item.value &&
                      <Text>{item.value}</Text>
                    }
                    <Button
                      title="Remove"
                      icon={{name: 'remove-circle-outline'}}
                      buttonStyle={{marginRight: 0}}
                      onPress={() => this.onRemovePress(i)}
                    />
                  </View>
                );
              })
            }
          </ScrollView>
        </View>

        <View style={styles.findWrap}>
          <Button
            title="Find recipes"
            icon={{name: 'search'}}
            onPress={() => this.onFindRecipesPress()}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  wrapper: {
    paddingHorizontal: 15,
  },
  inputWrap: {
    marginVertical: 10,
    backgroundColor: 'transparent',
  },
  input: {
    height: 40,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  ingredientHeading: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  findWrap: {
    marginTop: 10,
    marginBottom: 15,
  },
});

export default SearchScreen;
