import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';
import NoteList from '../components/NoteList';

class NoteScreen extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { navigation, screenProps } = this.props;

    return (
      <View style={styles.container}>
        <NoteList
          navigation={navigation}
          notes={this.props.screenProps.notes}
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

export default NoteScreen;
