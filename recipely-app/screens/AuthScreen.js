import React, { Component } from 'react';
import { StyleSheet, View, Text, TextInput, Button } from 'react-native';
import { FormLabel, FormInput } from 'react-native-elements';

class AuthScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
    };
  }

  render() {
    return (
      <View style={styles.container}>

        <View style={styles.nameContainer}>
          <Text>recipely</Text>
        </View>

        <View style={styles.wrapper}>
          <View style={styles.inputWrap}>
            <TextInput
              style={styles.input}
              underlineColorAndroid="transparent"
              placeholder="Username"
              value={this.state.username}
              onChangeText={(username) => this.setState({username})}
            />
          </View>

          <View style={styles.inputWrap}>
            <TextInput
              style={styles.input}
              underlineColorAndroid="transparent"
              placeholder="Password"
              secureTextEntry={true}
              value={this.state.password}
              onChangeText={(password) => this.setState({password})}
            />
          </View>

          <View style={styles.button}>
            <Button
              title="Login"
              onPress={() => {}}
            />
          </View>

          <View style={styles.button}>
            <Button
              title="Signup"
              onPress={() => {}}
            />
          </View>
        </View>

        <View style={{flex: 3}} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  nameContainer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wrapper: {
    paddingHorizontal: 15,
  },
  inputWrap: {
    flexDirection: 'row',
    marginVertical: 10,
    height: 40,
    backgroundColor: 'transparent',
  },
  input: {
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  button: {
    marginVertical: 5,
  },
});

export default AuthScreen;
