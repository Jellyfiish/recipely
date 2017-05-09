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
      ingredients: [
        {name: 'blueberry'},
        {name: 'strawberry'},
        {name: 'blackberry'}
      ],
      input: '',
    };
  }

  addIngredients = (event) => {
    this.setState({
      ingredients: [ {name: event.nativeEvent.text}, ...this.state.ingredients],
      input: '',
    });
  };

  onInputChange = (event) => {
    this.setState({input: event.nativeEvent.text});
  };

  onRemovePress = (i) => {
    const ingredients = this.state.ingredients;
    this.setState({
      ingredients: [ ...ingredients.slice(0, i), ...ingredients.slice(i + 1)]
    });
  };

  onFindRecipesPress = () => {
    this.props.navigation.navigate('SearchResults');
  };

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.textInput}
          placeholder="Add an ingredient"
          value={this.state.input}
          onChange={this.onInputChange}
          onSubmitEditing={this.addIngredients}
        />

        <Text>Ingredients:</Text>

        <ScrollView>
          { this.state.ingredients.map((item, i) => {
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
          onPress={() => this.onFindRecipesPress}
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
});

export default SearchScreen;
