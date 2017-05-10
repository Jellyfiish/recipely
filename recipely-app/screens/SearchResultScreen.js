import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';
import ResultList from '../components/ResultList';

class SearchResultScreen extends Component {
  render() {
    const { recipes } = this.props.navigation.state.params;
    const { navigation } = this.props;

    return (
      <View style={styles.container}>
        { recipes.length !== 0
          ? <ResultList
              navigation={navigation}
              recipes={recipes}
            />
          : <View>
              <Text>Loading recipes</Text>
              <ActivityIndicator size="large" />
            </View>
        }
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

export default SearchResultScreen;
