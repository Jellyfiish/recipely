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
import EditNoteScreen from '../screens/EditNoteScreen';
import AddNoteScreen from '../screens/AddNoteScreen';
import PopularScreen from '../screens/PopularScreen';
import SearchScreen from '../screens/SearchScreen';
import SearchResultScreen from '../screens/SearchResultScreen';
import SearchDetailScreen from '../screens/SearchDetailScreen';
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
  EditNote: {
    screen: EditNoteScreen,
    navigationOptions: ({ navigation }) => ({
      title: 'Edit Note',
    }),
  },
  AddNote: {
    screen: AddNoteScreen,
    navigationOptions: ({navigation }) => ({
      title: `Add Note: ${navigation.state.params.title}`
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
  Photo: {
    screen: PhotoScreen,
    navigationOptions: ({ navigation }) => ({
      tabBarLabel: 'Photo',
      tabBarIcon: TabBarIcon('photo-camera'),
    }),
  },
  Search: {
    screen: SearchScreen,
    navigationOptions: ({ navigation }) => ({
      tabBarLabel: 'Ingredients',
      tabBarIcon: TabBarIcon('search'),
    }),
  },
  Popular: {
    screen: PopularScreen,
    navigationOptions: ({ navigation }) => ({
      tabBarLabel: 'Popular',
      tabBarIcon: TabBarIcon('whatshot'),
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
    screen: SearchDetailScreen,
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
  Find: {
    screen: SearchStack,
    navigationOptions: ({navigation}) => ({
      drawerLabel: 'Find recipes',
      drawerIcon: DrawerIcon('search'),
    }),
  },
  RecipeStack: {
    screen: RecipeStack,
    navigationOptions: ({navigation}) => ({
      drawerLabel: 'View saved recipes',
      drawerIcon: DrawerIcon('list'),
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
