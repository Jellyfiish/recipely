import React, { Component } from 'react';
import { StyleSheet, ActivityIndicator, View, Text, Button } from 'react-native';
import { NavigationActions } from 'react-navigation';

class SplashScreen extends Component {
  constructor(props) {
    super(props);
  }

  componentDidUpdate() {
    if (this.props.screenProps.isAppReady) {
      this.navigateTo('MainDrawerNavigator');
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
        <Text>Splash screen!</Text>
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
