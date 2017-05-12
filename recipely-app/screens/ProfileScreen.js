import React, { Component } from 'react';
import {
  AsyncStorage,
  StyleSheet,
  Text,
  View,
  Button
} from 'react-native';
import { NavigationActions } from 'react-navigation';

class ProfileScreen extends Component {
  constructor(props) {
    super(props);
  }

  onLogoutPress = () => {
    // Remove token from storage
    AsyncStorage.removeItem('id_token', () => {
      // Remove token, recipes, and notes from state
      this.props.screenProps.setIdToken(null);
      this.props.screenProps.onRecipesChange([]);
      this.props.screenProps.onNotesChange([]);
      // Redirect user to login/signup screen
      this.navigateTo('AuthScreen');
    });
  };

  navigateTo = (routeName) => {
    const actionToDispatch = NavigationActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName })]
    });
    this.props.screenProps.rootNavigation.dispatch(actionToDispatch);
  };

  render() {
    return (
      <View style={styles.container}>
        <Text>You have</Text>
        <Text>{this.props.screenProps.notes.length} notes</Text>
        <Text>{this.props.screenProps.recipes.length} saved recipes</Text>
        <Button
          title="Logout"
          onPress={this.onLogoutPress}
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

export default ProfileScreen;
