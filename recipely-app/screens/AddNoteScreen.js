import React, { Component } from 'react';
import {
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Text,
  View,
  TextInput,
  Button
} from 'react-native';

class AddNoteScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text: '',
      isAdding: false,
    };
  }

  onAddPress = () => {
    this.setState({isAdding: true});
    const { idToken } = this.props.navigation.state.params;
  };

  render() {

    return (
      <ScrollView>
        <TextInput
          autoFocus={true}
          multiline={true}
          onChangeText={text => {
            this.setState({text});
          }}
        >
          <Text>{this.state.text}</Text>
        </TextInput>

        { this.state.isAdding
          ? <ActivityIndicator size="large" />
          : <Button
              title="Add"
              onPress={this.onAddPress}
            />
        }
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default AddNoteScreen;
