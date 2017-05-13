import React, { Component } from 'react';
import {
  AsyncStorage,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import { Button, List, ListItem } from 'react-native-elements';

class ProfileScreen extends Component {
  constructor(props) {
    super(props);
  }

  onLogoutPress = () => {
    // Remove token from storage
    AsyncStorage.removeItem('id_token', () => {
      // Remove user related information from state
      this.props.screenProps.setIdToken(null);
      this.props.screenProps.onRecipesChange([]);
      this.props.screenProps.onImageChange(null);
      this.props.screenProps.onPredictionsChange([]);
      this.props.screenProps.onIngredientChange([]);
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
    const numNotes = this.props.screenProps.notes.length;
    const numRecipes = this.props.screenProps.recipes.length;

    return (
      <View style={styles.container}>

        <List containerStyle={styles.listContainer}>
          <ListItem
            title="Notes"
            badge={{value: numNotes}}
            hideChevron
          />
          <ListItem
            title="Recipes"
            badge={{value: numRecipes}}
            hideChevron
          />
        </List>

        <Button
          title="Logout"
          icon={{name: 'exit-to-app'}}
          backgroundColor="#397af8"
          raised
          onPress={this.onLogoutPress}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    marginBottom: 20,
  },
});

export default ProfileScreen;
