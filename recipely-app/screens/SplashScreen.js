import React, { Component } from 'react';
import { StyleSheet, ActivityIndicator, View, Text, Button } from 'react-native';
import { NavigationActions } from 'react-navigation';
import loadingMessages from '../lib/loadingMessages';

class SplashScreen extends Component {
  constructor(props) {
    super(props);

    this.state = { loadingMessage: loadingMessages.random() };
  }

  componentDidUpdate() {
    if (this.props.screenProps.isAppReady) {
      if (this.props.screenProps.isLoggedIn) {
        this.navigateTo('MainDrawerNavigator');
      } else {
        this.navigateTo('AuthScreen');
      }
    }
  }

  navigateTo = (routeName) => {
    const actionToDispatch = NavigationActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName })]
    });
    this.props.navigation.dispatch(actionToDispatch);
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>recipely</Text>
        </View>

        <Text style={styles.loadingMessage}>
          {this.state.loadingMessage}
        </Text>
        <ActivityIndicator size="large" />
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
  logoContainer: {
    marginBottom: 30,
  },
  logo: {
    fontWeight: 'bold',
    fontSize: 40,
  },
  loadingMessage: {
    marginBottom: 15,
  },
});

export default SplashScreen;
