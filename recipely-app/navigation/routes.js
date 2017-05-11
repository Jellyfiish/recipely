import { Constants } from 'expo';
import React, { Component } from 'react';
import { View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import {
  DrawerNavigator,
  DrawerItems,
  StackNavigator,
  TabNavigator
} from 'react-navigation';
import SplashScreen from '../screens/SplashScreen';
import AuthScreen from '../screens/AuthScreen';
import PhotoScreen from '../screens/PhotoScreen';
import PhotoResultScreen from '../screens/PhotoResultScreen';
import RecipeScreen from '../screens/RecipeScreen';
import RecipeDetailScreen from '../screens/RecipeDetailScreen';
import PopularScreen from '../screens/PopularScreen';
import SearchScreen from '../screens/SearchScreen';
import SearchResultScreen from '../screens/SearchResultScreen';
import NoteScreen from '../screens/NoteScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SideDrawer from '../components/SideDrawer.js';

const MenuIcon = (navigation) => (
  <MaterialIcons
    name="menu"
    size={30}
    style={{paddingLeft: 12, color: '#777'}}
    onPress={() => navigation.navigate('DrawerOpen')}
  />
);

const DrawerIcon = (name) => ({ tintColor }) => (
  <MaterialIcons name={name} size={24} color={tintColor} />
);

const TabBarIcon = (name) => ({ tintColor }) => (
  <MaterialIcons name={name} size={24} color={tintColor} />
);

const PhotoStack = StackNavigator({
  Photos: {
    screen: PhotoScreen,
    // Can set the navigationOptions here or in the screen itself.
    // Options here override navigationOptions in the screen.
    navigationOptions: ({ navigation }) => ({
      title: 'Take photo',
      headerLeft: MenuIcon(navigation),
    }),
  },
  PhotoResult: {
    screen: PhotoResultScreen,
    navigationOptions: ({ navigation }) => ({
      title: 'Photo Result',
    }),
  },
}, {
  cardStyle: {
    // Push card down so that the status bar does not overlap content.
    paddingTop: Constants.statusBarHeight,
  }
});

const RecipeStack = StackNavigator({
  Recipes: {
    screen: RecipeScreen,
    navigationOptions: ({ navigation }) => ({
      title: 'Saved Recipes',
      headerLeft: MenuIcon(navigation),
    }),
  },
  Details: {
    screen: RecipeDetailScreen,
    navigationOptions: ({ navigation }) => ({
      title: `${navigation.state.params.title}`,
    }),
  },
}, {
  cardStyle: {
    paddingTop: Constants.statusBarHeight,
  }
});

const NoteStack = StackNavigator({
  Notes: {
    screen: NoteScreen,
    navigationOptions: ({navigation}) => ({
      title: 'All Notes',
      headerLeft: MenuIcon(navigation),
    }),
  },
}, {
  cardStyle: {
    paddingTop: Constants.statusBarHeight,
  }
});

const NoteStack = StackNavigator({
  Notes: {
    screen: NoteScreen,
    navigationOptions: ({navigation}) => ({
      title: 'All Notes'
    }),
  },
}, {
  cardStyle: {
    paddingTop: Constants.statusBarHeight,
  }
});

// NoteStack.navigationOptions = ({ navigation }) => {
//   return {
//     title: 'All notes',
//   }
// };

const SearchTab = TabNavigator({
  Popular: {
    screen: PopularScreen,
    navigationOptions: ({ navigation }) => ({
      tabBarIcon: TabBarIcon('whatshot'),
    }),
  },
  Search: {
    screen: SearchScreen,
    navigationOptions: ({ navigation }) => ({
      tabBarIcon: TabBarIcon('search'),
    }),
  },
});

// Create a title for tab navigator.
SearchTab.navigationOptions = ({ navigation }) => {
  return {
    title: 'Find recipes',
    headerLeft: MenuIcon(navigation),
  }
};

const SearchStack = StackNavigator({
  SearchHome: {
    screen: SearchTab,
  },
  SearchResult: {
    screen: SearchResultScreen,
    navigationOptions: ({ navigation }) => ({
      title: 'Search results',
    }),
  },
  SearchDetail: {
    screen: RecipeDetailScreen,
    navigationOptions: ({ navigation }) => ({
      title: `${navigation.state.params.title}`,
    }),
  },
}, {
  cardStyle: {
    paddingTop: Constants.statusBarHeight,
  }
});

const ProfileStack = StackNavigator({
  ProfileHome: {
    screen: ProfileScreen,
    navigationOptions: ({ screenProps, navigation }) => ({
      title: `${screenProps.user.username}'s profile`,
      headerLeft: MenuIcon(navigation),
    }),
  }
}, {
  cardStyle: {
    paddingTop: Constants.statusBarHeight,
  }
});

const MainDrawerNavigator = DrawerNavigator({
  Photo: {
    screen: PhotoStack,
    navigationOptions: ({navigation}) => ({
      // Label and icons for the side menu.
      drawerLabel: 'Take photo',
      drawerIcon: DrawerIcon('photo-camera'),
    }),
  },
  RecipeStack: {
    screen: RecipeStack,
    navigationOptions: ({navigation}) => ({
      drawerLabel: 'View saved recipes',
      drawerIcon: DrawerIcon('list'),
    }),
  },
  Find: {
    screen: SearchStack,
    navigationOptions: ({navigation}) => ({
      drawerLabel: 'Find recipes',
      drawerIcon: DrawerIcon('search'),
    }),
  },
  Notes: {
    screen: NoteStack,
    navigationOptions: ({navigation}) => ({
      drawerLabel: 'View notes',
      drawerIcon: DrawerIcon('note'),
    }),
  },
  Profile: {
    screen: ProfileStack,
    navigationOptions: ({navigation}) => ({
      drawerLabel: 'Profile',
      drawerIcon: DrawerIcon('account-circle'),
    }),
  },
}, {
  // Custom side menu. See '../components/SideDrawer.js'.
  contentComponent: props => SideDrawer(props),
});

const StartupStack = StackNavigator(
  {
    SplashScreen: { screen: SplashScreen },
    AuthScreen: { screen: AuthScreen },
    MainDrawerNavigator: {
      screen: ({ screenProps, navigation }) => (
        <MainDrawerNavigator screenProps={{ ...screenProps, rootNavigation: navigation }} />
      )
    },
  },
  {
    navigationOptions: {
      header: null
    }
  }
);

export default StartupStack;
