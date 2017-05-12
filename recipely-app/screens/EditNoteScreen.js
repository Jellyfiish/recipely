import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput
} from 'react-native';

class EditNoteScreen extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { note } = this.props.navigation.state.params;

    return (
      <View>
        <Text>{JSON.stringify(note)}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default EditNoteScreen;
