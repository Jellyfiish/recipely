import Expo, { Constants } from 'expo';
import React from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';
import {
  DrawerItems
} from 'react-navigation';

const SideDrawer = (props) => (
  <View>
    <View style={styles.drawerHeader}>
      <Text>recipely</Text>
      <Text>Login/Logout</Text>
    </View>
    <DrawerItems {...props} />
  </View>
)

const styles = StyleSheet.create({
  drawerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ccc',
  },
});

export default SideDrawer;
