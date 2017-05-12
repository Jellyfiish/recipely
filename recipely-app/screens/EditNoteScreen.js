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

class EditNoteScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text: this.props.navigation.state.params.note.text,
      isUpdating: false,
    };
  }

  onUpdatePress = () => {
    this.setState({isUpdating: true});
    const { note, idToken, onGoBack } = this.props.navigation.state.params;

    fetch(`https://jellyfiish-recipely.herokuapp.com/api/notes/${note.id}`, {
      method: 'PUT',
      headers: {
        'x-access-token': `Bearer ${idToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text: this.state.text }),
    }).then(res => res.text())
      .then(text => {
        const newNote = {...note, text};
        return newNote;
      })
      .then(newNote => {
        const notes = this.props.screenProps.notes;
        const i = this.props.screenProps.notes.indexOf(note);
        // Update notes with new note
        this.props.screenProps.onNotesChange(
          [ ...notes.slice(0, i), newNote, ...notes.slice(i + 1) ]
        );
        // Need to trigger a render in previous component.
        onGoBack(this.props.screenProps.notes.filter(
          otherNote => note.f2f_id === otherNote.f2f_id)
        );
        this.setState({isUpdating: false});
      })
      .then(() => this.props.navigation.goBack());
  };

  render() {
    const { note } = this.props.navigation.state.params;

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

        { this.state.isUpdating
          ? <ActivityIndicator size="large" />
          : <Button
              title="Update"
              onPress={this.onUpdatePress}
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

export default EditNoteScreen;
