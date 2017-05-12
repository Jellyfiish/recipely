import React from 'react';
import {
  StyleSheet,
  Text,
  ScrollView,
  View,
  Button
} from 'react-native';
import { Card } from 'react-native-elements';
import { MaterialIcons } from '@expo/vector-icons';

const NoteList = ({ navigation, notes }) => {

  return (
    <ScrollView>
      { notes.map(note => {
          return (
            <Card
              key={note.id}
              title={note.title}
              image={{uri: note.thumbnail_url}}
            >
              <Text style={styles.publisherText}>{note.text}</Text>
            </Card>
          );
        })
      }
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  noteTitle: {
    marginTop: 10,
  },
  noteText: {
    marginBottom: 10,
  },
});

export default NoteList;
