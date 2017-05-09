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
import RecipeScreen from '../screens/RecipeScreen';
import RecipeDetailScreen from '../screens/RecipeDetailScreen';
import SearchScreen from '../screens/SearchScreen';
import NoteScreen from '../screens/NoteScreen';
import SideDrawer from '../components/SideDrawer.js';

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

const DrawerNav = DrawerNavigator({
  Photo: {
    screen: PhotoScreen,
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
  Search: {
    screen: SearchScreen,
    navigationOptions: ({navigation}) => ({
      drawerLabel: 'Search recipes',
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
