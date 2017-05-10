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
import PhotoScreen from '../screens/PhotoScreen';
import PhotoResultScreen from '../screens/PhotoResultScreen';
import RecipeScreen from '../screens/RecipeScreen';
import RecipeDetailScreen from '../screens/RecipeDetailScreen';
import PopularScreen from '../screens/PopularScreen';
import SearchScreen from '../screens/SearchScreen';
import SearchResultScreen from '../screens/SearchResultScreen';
import NoteScreen from '../screens/NoteScreen';
import SideDrawer from '../components/SideDrawer.js';

const PhotoStack = StackNavigator({
  Photos: {
    screen: PhotoScreen,
    // Can set the navigationOptions here or in the screen itself.
    // Options here override navigationOptions in the screen.
    navigationOptions: ({ navigation }) => ({
      title: 'Take photo'
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

const SearchTab = TabNavigator({
  Popular: {
    screen: PopularScreen,
    navigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ tintColor }) => (
        <MaterialIcons name="whatshot" size={24} color={tintColor} />
      ),
    }),
  },
  Search: {
    screen: SearchScreen,
  },
});

// Create a title for tab navigator.
SearchTab.navigationOptions = ({ navigation }) => {
  return {
    title: 'Find recipes',
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

const DrawerNav = DrawerNavigator({
  Photo: {
    screen: PhotoStack,
    navigationOptions: ({navigation}) => ({
      // Label and icons for the side menu.
      drawerLabel: 'Take photo',
      drawerIcon: () => (
        <MaterialIcons name="photo-camera" size={24} />
      ),
    }),
  },
  RecipeStack: {
    screen: RecipeStack,
    navigationOptions: ({navigation}) => ({
      drawerLabel: 'View saved recipes',
      drawerIcon: () => (
        <MaterialIcons name="list" size={24} />
      ),
    }),
  },
  Find: {
    screen: SearchStack,
    navigationOptions: ({navigation}) => ({
      drawerLabel: 'Find recipes',
      drawerIcon: () => (
        <MaterialIcons name="search" size={24} />
      ),
    }),
  },
  Notes: {
    screen: NoteScreen,
    navigationOptions: ({navigation}) => ({
      drawerLabel: 'View notes',
      drawerIcon: () => (
        <MaterialIcons name="note" size={24} />
      ),
    }),
  },
}, {
  // Custom side menu. See '../components/SideDrawer.js'.
  contentComponent: props => SideDrawer(props),
});

export default DrawerNav;
