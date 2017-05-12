import React, { Component } from 'react';
import {
  StyleSheet,
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
      text: this.props.navigation.state.params.note.text
    };
  }

  onUpdatePress = () => {
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
        const otherNotes = this.props.screenProps.notes.filter(
          otherNote => otherNote.id !== note.id
        );
        const recipeNotes = this.props.screenProps.notes.filter(
          otherNote => otherNote.f2f_id === note.f2f_id && otherNote.id !== note.id
        );
        this.props.screenProps.onNotesChange(
          [ newNote, ...otherNotes ]
        );
        // Need to trigger a render in previous component.
        onGoBack([ newNote, ...recipeNotes ]);
      })
      .then(() => this.props.navigation.goBack());
  };

  render() {
    const { note } = this.props.navigation.state.params;

    return (
      <ScrollView>
        <TextInput
          multiline={true}
          onChangeText={text => {
            this.setState({text});
          }}
        >
          <Text>{this.state.text}</Text>
        </TextInput>

        <Button
          title="Update"
          onPress={this.onUpdatePress}
        />
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
