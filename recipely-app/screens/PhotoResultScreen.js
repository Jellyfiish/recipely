import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';

class PhotoResultScreen extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { predictions } = this.props.navigation.state.params;

    return (
      <View style={styles.container}>
        <Text>Result from searching ingredients by photo</Text>
        <Text>{JSON.stringify(predictions)}</Text>
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

export default PhotoResultScreen;
