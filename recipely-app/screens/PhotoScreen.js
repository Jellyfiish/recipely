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
  ImageStore
} from 'react-native';
import { Icon } from 'react-native-elements';
// Used to get access token from Clarifai
import auth from '../config/config';

class PhotoScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isGettingPrediction: false
    };
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

  getPredictions = () => {
    this.setState({ isGettingPrediction: !this.state.isGettingPrediction });
    const { image } = this.props.screenProps;
    ImageStore.getBase64ForTag(image.uri, (encoded) => {
      fetch('https://api.clarifai.com/v2/token', {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + auth
        }
      }).then(res => res.json())
        .then(res => {
          return fetch('https://api.clarifai.com/v2/models/bd367be194cf45149e75f01d59f77ba7/outputs', {
            method: 'POST',
            headers: {
              'Authorization': 'Bearer ' + res.access_token,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              inputs: [
                {
                  data: {
                    image: {
                      base64: encoded
                    }
                  }
                }
              ]
            })
          });
        })
        .then(res => res.json())
        .then(res => {
          this.setState({ isGettingPrediction: !this.state.isGettingPrediction });
          console.log(res)
        });
    }, (err) => {
      console.log(err);
    });
  }

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
