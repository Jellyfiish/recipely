import React, { Component } from 'react';
import {
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Text,
  View,
  TextInput,
} from 'react-native';
import Button from '../components/CustomButton';

class EditNoteScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text: this.props.navigation.state.params.note.text,
      isUpdating: false,
      height: 0,
    };
  }

  onUpdatePress = () => {
    this.setState({isUpdating: true});
    const { note, idToken, onGoBack } = this.props.navigation.state.params;

    // Update note client side
    const newNote = { ...note, text: this.state.text };
    const notes = this.props.screenProps.notes;
    const i = this.props.screenProps.notes.indexOf(note);
    // Update notes with new note
    this.props.screenProps.onNotesChange(
      [ ...notes.slice(0, i), newNote, ...notes.slice(i + 1) ],
      // onNotesChange calls setState which is not synchronous. Need to wait
      // for the notes to change before we navigate user back.
      () => {
        // Need to trigger a render in previous component.
        onGoBack(this.props.screenProps.notes.filter(
          otherNote => note.f2f_id === otherNote.f2f_id)
        );
      }
    );
    this.setState({isUpdating: false});

    // Update note in database. Do this in background.
    fetch(`https://jellyfiish-recipely.herokuapp.com/api/notes/${note.id}`, {
      method: 'PUT',
      headers: {
        'x-access-token': `Bearer ${idToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text: this.state.text }),
    });

    // After updating note, go back to previous screen.
    this.props.navigation.goBack()
  };

  render() {
    const { note } = this.props.navigation.state.params;

    return (
      <ScrollView>
        <View style={styles.wrapper}>
          <View style={styles.inputWrap}>
            <TextInput
              style={[styles.input, {height: Math.max(40, this.state.height + 10)}]}
              autoFocus={true}
              multiline={true}
              onChangeText={text => {
                this.setState({text});
              }}
              onChange={event => {
                this.setState({height: event.nativeEvent.contentSize.height});
              }}
            >
              <Text>{this.state.text}</Text>
            </TextInput>
          </View>

          { this.state.isUpdating
            ? <ActivityIndicator size="large" />
            : <Button
                title="Update"
                icon={{name: 'mode-edit'}}
                onPress={this.onUpdatePress}
              />
          }
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wrapper: {
    paddingHorizontal: 15,
  },
  inputWrap: {
    marginVertical: 20,
    backgroundColor: 'transparent',
  },
  input: {
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
});

export default EditNoteScreen;
