import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';

class SearchResultScreen extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>Results from searching by ingredients</Text>
        <Text>{JSON.stringify(this.props.navigation.state.params.recipes)}</Text>
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

export default SearchResultScreen;
