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
      this.props.screenProps.onImageChange(result.uri);
    }
  };

  pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
    });

    console.log(result);

    if (!result.cancelled) {
      this.props.screenProps.onImageChange(result.uri);
    }
  };

  render() {
    let { imageURI } = this.props.screenProps;

    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Button
          title="Take a picture with your camera"
          onPress={this.takeImage}
        />
        <Button
          title="Pick an image from camera roll"
          onPress={this.pickImage}
        />
        { imageURI &&
          <Image source={{ uri: imageURI }} style={{ width: 200, height: 200 }} />}
      </View>
    );
  }
}

export default PhotoScreen;
