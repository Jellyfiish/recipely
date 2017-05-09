import React, { Component } from 'react';
import Expo, { ImagePicker } from 'expo';
import {
  StyleSheet,
  Text,
  ScrollView,
  View,
  Button,
  Image
} from 'react-native';

class PhotoScreen extends Component {
  constructor(props) {
    super(props);
  }

  takeImage = async() => {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
    });

    console.log(result);

    if (!result.cancelled) {
      this.props.screenProps.onImageChange(result);
    }
  };

  pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
    });

    console.log(result);

    if (!result.cancelled) {
      this.props.screenProps.onImageChange(result);
    }
  };

  render() {
    let { image } = this.props.screenProps;

    return (
      <View style={styles.container}>
        <Button
          title="Take a picture with your camera"
          onPress={this.takeImage}
        />
        <Button
          title="Pick an image from camera roll"
          onPress={this.pickImage}
        />
      { image &&
          <Image source={{ uri: image.uri }} style={styles.image} />}
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
  image: {
    width: 300,
    height: 300,
    resizeMode: 'contain'
  },
});

export default PhotoScreen;
