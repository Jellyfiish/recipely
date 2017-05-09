import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button
} from 'react-native';

class SearchScreen extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>Search recipes</Text>
        <Button
          title="Find recipes"
          onPress={() => this.props.navigation.navigate('SearchResults')}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default SearchScreen;
