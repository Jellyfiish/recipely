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
    const { idToken, f2f_id, title, thumbnail_url, onGoBack } = this.props.navigation.state.params;

    fetch('https://jellyfiish-recipely.herokuapp.com/api/users/recipes/notes', {
      method: 'POST',
      headers: {
        'x-access-token': `Bearer ${idToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: this.state.text,
        f2f_id
      }),
    }).then(res => res.json())
      .then(noteArray => {
        // API returns a note inside an rray
        const note = noteArray[0];
        const newNote = {...note, title, thumbnail_url};
        return newNote;
      })
      .then(newNote => {
        const notes = this.props.screenProps.notes;
        this.props.screenProps.onNotesChange(
          [ ...notes, newNote ],
          // onNotesChange calls setState which is not synchronous. Need to wait
          // for the new note to be added before we navigate user back.
          () => {
            // // Need to trigger a render in previous component.
            onGoBack(this.props.screenProps.notes.filter(
              otherNote => newNote.f2f_id === otherNote.f2f_id)
            );
          }
        );
        this.setState({isAdding: false});
      })
      .then(() => this.props.navigation.goBack());
  };

  render() {

    return (
      <ScrollView>
        <View style={styles.wrapper}>
          <View style={styles.inputWrap}>
            <TextInput
              style={styles.input}
              autoFocus={true}
              multiline={true}
              onChangeText={text => {
                this.setState({text});
              }}
            >
              <Text>{this.state.text}</Text>
            </TextInput>
          </View>

          { this.state.isAdding
            ? <ActivityIndicator size="large" />
              : <Button
                  title="Add"
                  icon={{name: 'note-add'}}
                  onPress={this.onAddPress}
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
    flexDirection: 'row',
    marginVertical: 20,
    height: 40,
    backgroundColor: 'transparent',
  },
  input: {
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
});

export default AddNoteScreen;
