import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';

class PopularScreen extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>Popular recipes</Text>
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

export default PopularScreen;
