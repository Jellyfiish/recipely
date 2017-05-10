import { Constants } from 'expo';
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  ScrollView,
  View,
  Button,
  Image
} from 'react-native';
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
  },
  Search: {
    screen: SearchScreen,
  },
});

SearchTab.navigationOptions = ({ navigation }) => {
  return {
    title: 'Find recipes',
  }
};

const SearchStack = StackNavigator({
  Home: {
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
  contentComponent: props => SideDrawer(props),
});

export default DrawerNav;
