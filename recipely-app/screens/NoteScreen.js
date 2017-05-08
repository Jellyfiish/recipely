import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';

class NoteScreen extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>Show notes</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default NoteScreen;
