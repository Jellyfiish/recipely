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
import { Card, List, ListItem } from 'react-native-elements';
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
              underlineColorAndroid="transparent"
              placeholder="Add an ingredient"
              value={this.state.input}
              onChange={this.onInputChange}
              onSubmitEditing={this.addIngredients}
            />
          </View>
        </View>

        <ScrollView>
          <Card title="Ingredients">
            { ingredients.map((item, i) => {
                return (
                  <View
                    key={i}
                    style={styles.rowContainer}
                  >
                    <View style={styles.ingredientEntry}>
                      <Text>{item.name}</Text>
                      { item.value &&
                        <Text style={styles.probability}>
                          {String(item.value)}
                        </Text>
                      }
                    </View>

                    <Button
                      title="Remove"
                      icon={{name: 'remove-circle-outline'}}
                      buttonStyle={{marginRight: 0, height: 36, paddingHorizontal: 8}}
                      onPress={() => this.onRemovePress(i)}
                    />
                  </View>
                );
              })
            }
          </Card>
        </ScrollView>

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
  ingredientEntry: {
    flexDirection: 'column',
  },
  probability: {
    fontSize: 12,
  },
});

export default SearchScreen;
