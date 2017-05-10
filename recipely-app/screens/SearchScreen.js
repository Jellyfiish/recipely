import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  FlatList,
  Button,
  TextInput,
  KeyboardAvoidingView
} from 'react-native';
import { List, ListItem } from 'react-native-elements';

class SearchScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      input: '',
    };
  }

  addIngredients = (event) => {
    this.setState({
      input: '',
    });
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

  onRemovePress = (i) => {
    const ingredients = this.props.screenProps.ingredients;
    this.props.screenProps.onIngredientChange(
      [
        ...ingredients.slice(0, i),
        ...ingredients.slice(i + 1)
      ]
    );
  };

  onFindRecipesPress = () => {
    const query = this.props.screenProps.ingredients.map(item => item.name).join(',');
    if (query.length !== 0) {
      this.props.navigation.navigate('SearchResult', {query});
    }
  };

  render() {
    const { ingredients } = this.props.screenProps;

    return (
      <View style={styles.container}>
        <TextInput
          style={styles.textInput}
          placeholder="Add an ingredient"
          value={this.state.input}
          onChange={this.onInputChange}
          onSubmitEditing={this.addIngredients}
        />

      <Text style={styles.ingredientHeading}>Ingredients:</Text>

        <ScrollView>
          { ingredients.map((item, i) => {
              return (
                <View key={i}>
                  <Text>{item.name}</Text>
                  <Button
                    title="Remove"
                    onPress={() => this.onRemovePress(i)}
                  />
                </View>
              );
            })
          }
        </ScrollView>

        <Button
          title="Find recipes"
          onPress={() => this.onFindRecipesPress()}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textInput: {
    height: 50,
    padding: 15,
  },
  ingredientHeading: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  }
});

export default SearchScreen;
