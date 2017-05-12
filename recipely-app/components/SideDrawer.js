import { Constants } from 'expo';
import React from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';
import { DrawerItems } from 'react-navigation';

const SideDrawer = (props) => (
  <View>
    <View style={styles.drawerHeader}>
      <Text style={styles.appName}>recipely</Text>
    </View>
    <DrawerItems {...props} />
  </View>
)

const styles = StyleSheet.create({
  drawerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingTop: Constants.statusBarHeight + 10,
    backgroundColor: '#03a9f4',
  },
  appName: {
    fontSize: 30,
    fontWeight: 'bold',
    paddingLeft: 10,
    paddingBottom: 5,
    color: 'white',
  },
});

export default SideDrawer;
