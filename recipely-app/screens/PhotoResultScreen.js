import React, { Component } from 'react';
import {
  StyleSheet,
  ScrollView,
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
        <ScrollView>
          { predictions.map(prediction => {
              return (
                <View key={prediction.id}>
                  <Text>{prediction.name}</Text>
                  <Text>{String(prediction.value)}</Text>
                </View>
              );
            })
          }
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
});

export default PhotoResultScreen;
