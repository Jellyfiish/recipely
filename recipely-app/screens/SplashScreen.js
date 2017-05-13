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
        <Text>{this.state.loadingMessage}</Text>
        <ActivityIndicator size="large" />
        <Button
          title="Go to main app"
          onPress={() => this.navigateTo('MainDrawerNavigator')}
        />
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
});

export default SplashScreen;
