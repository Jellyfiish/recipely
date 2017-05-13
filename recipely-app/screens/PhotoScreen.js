import React, { Component } from 'react';
import Expo, { ImagePicker } from 'expo';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  ScrollView,
  View,
  Button,
  Image,
  ImageStore,
  ImageEditor,
  Platform
} from 'react-native';
import { Icon } from 'react-native-elements';
// Used to get access token from Clarifai
import auth from '../config/config';

class PhotoScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isGettingPrediction: false,
    };
  }

  // Function to handle user taking a photo with their camera.
  takeImage = async () => {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
    });

    console.log(result);
    // Only set image if user takes a photo. These functions do not get called
    // until the user takes a photo. See async/await above.
    if (!result.cancelled) {
      // Set new image.
      this.props.screenProps.onImageChange(result);
      // Reset predictions because we have a new image.
      this.props.screenProps.onPredictionsChange([]);
    }
  };

  // Function to handler user choosing a photo form their library.
  pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
    });

    console.log(result);

    if (!result.cancelled) {
      this.props.screenProps.onImageChange(result);
      this.props.screenProps.onPredictionsChange([]);
    }
  };

  // Function that handles requests to our image prediction API.
  getPredictions = () => {
    const { predictions } = this.props.screenProps;
    // Check if we have any existing predictions for our current photo.
    // If so, redirect them to search screen with predictions prepopulated.
    if (predictions.length !== 0) {
      // this.props.navigation.navigate('PhotoResult', {predictions});
      this.props.navigation.navigate('Search');
      return;
    }
    // Toggle activity indicator so user knows that the photo is being sent to
    // our image prediction API.
    this.setState({ isGettingPrediction: !this.state.isGettingPrediction });
    const { image } = this.props.screenProps;
    // On iOS, the image will not be stored in the ImageStore. In order to put
    // it into the ImageStore so that we can base64 encode it, we make a copy of
    // the image by cropping with its existing dimensions. When we crop it, iOS
    // will put the image in the ImageStore.
    if (Platform.OS === 'ios') {
      Image.getSize(image.uri, (width, height) => {
        const imageSize = {
          size: { width, height},
          offset: { x: 0, y: 0 },
        }
        ImageEditor.cropImage(image.uri, imageSize, (imageStoreURI) => {
          this.getPredictionHelp(imageStoreURI, () => {
            ImageStore.removeImageForTag(imageStoreURI);
          }, (err) => console.log(err))
        }, (err) => console.log(err))
      }, (err) => console.log(err));
    } else if (Platform.OS === 'android') {
      this.getPredictionHelp(image.uri);
    }
  }

  getPredictionHelp = (uri, callback = () => {}) => {
    // Encode image as base64 to send to image prediction API.
    ImageStore.getBase64ForTag(uri, (encoded) => {
      // Image prediction API requires an authorization token.
      fetch('https://api.clarifai.com/v2/token', {
        method: 'POST',
        headers: {
          // auth is a base64 encoded string containing our client ID and client secret.
          // See '../config/config.example.js'.
          'Authorization': 'Basic ' + auth
        }
      }).then(res => res.json())
        .then(res => this.onAuthSuccess(res.access_token, encoded))
        .then(res => res.json())
        .then(res => this.onPredictionSuccess(res));
    }, (err) => {
      console.log(err);
    });
  };

  onAuthSuccess = (token, encoded) => {
    // bd367be194cf45149e75f01d59f77ba7 is the food model. The food model
    // will give better predictions when images of food are used.
    return fetch('https://api.clarifai.com/v2/models/bd367be194cf45149e75f01d59f77ba7/outputs', {
      method: 'POST',
      headers: {
        // Send our authorization token that we received.
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inputs: [
          {
            data: {
              image: {
                // Send our base64 encoded to image prediction API.
                base64: encoded
              }
            }
          }
        ]
      })
    });
  };

  onPredictionSuccess = (res) => {
    const { ingredients, onPredictionsChange, onIngredientChange } = this.props.screenProps;
    // Toggle activity indicator off
    this.setState({ isGettingPrediction: !this.state.isGettingPrediction });
    // Filter only good predictions. We will consider a prediction to be
    // good if it has a value >= 0.75.
    const predictions = res.outputs[0].data.concepts.filter(item => {
      return item.value >= 0.75;
    });
    // Set the state of our predictions on our root component.
    onPredictionsChange(predictions);
    // this.props.navigation.navigate('PhotoResult', {predictions: res.outputs[0].data.concepts});
    // Set the state of our ingredients on our root component
    onIngredientChange([ ...predictions, ...ingredients]);
    // Change our screen to the search screen. The search screen should
    // have our predictions prepopulated.
    this.props.navigation.navigate('Search');
  };

  render() {
    let { image } = this.props.screenProps;

    return (
      <View style={{flex: 1}}>
        <View style={styles.headingContainer}>
          <Text style={styles.heading}>Find recipes by taking a photo!</Text>
        </View>

        <View style={styles.imageContainer}>
          { image &&
            <Image source={{ uri: image.uri }} style={styles.image} />
          }
        </View>

        <View style={styles.buttonContainer}>
          <View style={styles.buttonLabel}>
            <Icon
              name="photo-album"
              size={30}
              raised
              color="#397af8"
              onPress={this.pickImage}
            />
            <Text>Use album</Text>
          </View>

          { image && !this.state.isGettingPrediction &&
            <View style={styles.buttonLabel}>
              <Icon
                name="done"
                size={30}
                raised
                color="#397af8"
                onPress={this.getPredictions}
              />
              <Text>Done</Text>
            </View>
          }

          { this.state.isGettingPrediction &&
            <View style={[styles.buttonLabel, {marginBottom: 36}]}>
              <ActivityIndicator size="large" />
            </View>
          }

          <View style={styles.buttonLabel}>
            <Icon
              name="photo-camera"
              size={30}
              raised
              color="#397af8"
              onPress={this.takeImage}
            />
            <Text>Use camera</Text>
          </View>
        </View>
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
  headingContainer: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  imageContainer: {
    flex: 4,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: 20,
    marginLeft: 20,
    marginRight: 20,
  },
  buttonLabel: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
  },
});

export default PhotoScreen;
