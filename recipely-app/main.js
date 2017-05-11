import Expo from 'expo';
import React, { Component } from 'react';
import { StyleSheet, ActivityIndicator, View, Text, Button } from 'react-native';
import DrawerNav from './navigation/routes';
import { StackNavigator, NavigationActions } from 'react-navigation';
import jwtDecode from 'jwt-decode';

const MainDrawerNavigator = DrawerNav;

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

class AuthScreen extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View>
        <Text>Auth screen!</Text>
      </View>
    );
  }
}

const StartupStack = StackNavigator(
  {
    SplashScreen: { screen: SplashScreen },
    AuthScreen: { screen: AuthScreen },
    MainDrawerNavigator: { screen: MainDrawerNavigator },
  },
  {
    navigationOptions: {
      header: null
    }
  }
);

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isAppReady: false,
      isLoggedIn: false,
      recipes: [],
      image: null,
      predictions: [],
      searchResults: {},
      ingredients: [
        {name: 'blueberry'},
        {name: 'strawberry'},
        {name: 'blackberry'}
      ],
    };
  }

  // componentDidMount() {
  //   const login = () => this.setState({isLoggedIn: true});
  //   setTimeout(login.bind(this), 2000);
  // }

  componentDidMount() {
    fetch('https://jellyfiish-recipely.herokuapp.com/api/recipes?q=')
      .then(res => res.json())
      .then(results => this.onRecipesChange(results.recipes))
      .then(() => this.setState({isAppReady: true}));
  }

  onRecipesChange = (recipes) => {
    this.setState({recipes});
  };

  onImageChange = (image) => {
    this.setState({image});
  }

  onPredictionsChange = (predictions) => {
    this.setState({predictions});
  }

  onSearchChange = (query, results) => {
    this.setState({
      searchResults: { ...this.state.searchResults, [query]: results }
    });
  };

  onIngredientChange = (ingredients) => {
    this.setState({ingredients});
  };
  // <DrawerNav
  //   screenProps={
  //     {
  //       recipes: this.state.recipes,
  //       image: this.state.image,
  //       predictions: this.state.predictions,
  //       searchResults: this.state.searchResults,
  //       ingredients: this.state.ingredients,
  //       onRecipesChange: this.onRecipesChange,
  //       onImageChange: this.onImageChange,
  //       onPredictionsChange: this.onPredictionsChange,
  //       onSearchChange: this.onSearchChange,
  //       onIngredientChange: this.onIngredientChange,
  //     }
  //   }
  // />

  render() {
    return (
      <StartupStack
        screenProps={
          {
            isAppReady: this.state.isAppReady,
            isLoggedIn: this.state.isLoggedIn,
            recipes: this.state.recipes,
            image: this.state.image,
            predictions: this.state.predictions,
            searchResults: this.state.searchResults,
            ingredients: this.state.ingredients,
            onRecipesChange: this.onRecipesChange,
            onImageChange: this.onImageChange,
            onPredictionsChange: this.onPredictionsChange,
            onSearchChange: this.onSearchChange,
            onIngredientChange: this.onIngredientChange,
          }
        }
      />
    );
  }
}

Expo.registerRootComponent(App);
