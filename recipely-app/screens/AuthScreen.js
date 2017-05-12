import React, { Component } from 'react';
import { AsyncStorage, StyleSheet, ActivityIndicator, View, Text, TextInput, Button } from 'react-native';
import { NavigationActions } from 'react-navigation';
import dismissKeyboard from 'dismissKeyboard';

class AuthScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
      error: null,
      isLoggingIn: false,
    };
  }

  onLoginPress = () => {
    this.handleLoginSignupPress('login');
  };

  onSignupPress = () => {
    this.handleLoginSignupPress('signup');
  };

  handleLoginSignupPress = (type) => {
    this.setState({isLoggingIn: true});
    dismissKeyboard();
    const { username, password } = this.state;

    fetch(`https://jellyfiish-recipely.herokuapp.com/api/${type}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({username, password}),
    }).then(res => this.handleResponse(res));
  };

  handleResponse = (res) => {
    if (res.status === 401) {
      // Show error if invalid username or password.
      res.text().then(error => this.setState({error}));
      this.setState({isLoggingIn: false});
    } else if (res.status === 200) {
      res.json()
        .then(token => {
          // Remove error message if there was one.
          this.setState({error: null});
          // Put the token in our state so we do not need to repeatedly get it from storage
          this.props.screenProps.setIdToken(token);
          // Store our access token so we can use it to authenticate api endpoints
          AsyncStorage.setItem('id_token', token, () => {
            // Toggle isLoggedIn state
            this.props.screenProps.onLoginChange();

            const fetchRecipes = fetch('https://jellyfiish-recipely.herokuapp.com/api/users/recipes', {
              headers: { 'x-access-token': `Bearer ${token}` }
            }).then(res => {
                if (res.status === 200) {
                  res.json()
                    .then(recipes => this.props.screenProps.onRecipesChange(recipes));
                }
            });

            // Fetch user's notes
            const fetchNotes = fetch('https://jellyfiish-recipely.herokuapp.com/api/users/notes', {
              headers: { 'x-access-token': `Bearer ${token}` }
            }).then(res => {
                if (res.status === 200) {
                  res.json()
                    .then(notes => this.props.screenProps.onNotesChange(notes));
                }
            });

            // App is ready when the user's recipes and notes have been fetched.
            Promise.all([fetchRecipes, fetchNotes])
              .then(() => {
                // Toggle activity indicator off
                this.setState({isLoggingIn: false});
                // Navigate to main app.
                const action = NavigationActions.reset({
                  index: 0,
                  actions: [
                    NavigationActions.navigate({ routeName: 'MainDrawerNavigator' })
                  ]
                });
                this.props.navigation.dispatch(action);
              });

          });
        });
    }
  };

  // Completing an input field will trigger the cursor to go to the next field
  focusNextField = (nextField) => {
    this.refs[nextField].focus();
  };

  render() {
    return (
      <View style={styles.container}>

        <View style={styles.logoContainer}>
          <Text style={styles.logo}>recipely</Text>
          <Text>Shazam for food</Text>
        </View>

        <View style={styles.wrapper}>
          <View style={styles.inputWrap}>
            <TextInput
              ref="1"
              style={styles.input}
              underlineColorAndroid="transparent"
              placeholder="Username"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
              value={this.state.username}
              onChangeText={(username) => this.setState({username})}
              onSubmitEditing={() => this.focusNextField('2')}
            />
          </View>

          <View style={styles.inputWrap}>
            <TextInput
              ref="2"
              style={styles.input}
              underlineColorAndroid="transparent"
              placeholder="Password"
              returnKeyType="done"
              secureTextEntry={true}
              value={this.state.password}
              onChangeText={(password) => this.setState({password})}
            />
          </View>

          { this.state.error &&
            <Text style={styles.error}>{this.state.error}</Text>
          }

          { this.state.isLoggingIn
            ? <ActivityIndicator size="large" />
            : <View>
                <View style={styles.button}>
                  <Button
                    title="Login"
                    onPress={this.onLoginPress}
                  />
                </View>

                <View style={styles.button}>
                  <Button
                    title="Signup"
                    onPress={this.onSignupPress}
                  />
                </View>
              </View>
          }
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
  logoContainer: {
    flex: 2,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 15,
  },
  logo: {
    fontWeight: 'bold',
    fontSize: 40,
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
  error: {
    color: 'red'
  },
});

export default AuthScreen;
