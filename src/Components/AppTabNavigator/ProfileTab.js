/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

import { Icon } from 'native-base';
import { SafeAreaView } from 'react-navigation';

class ProfileTab extends Component {

  static navigationOptions ={
    tabBarIcon: ({tintColor}) => (
      <Icon type="Entypo" name="user" style={{color: tintColor}} />
      )
  }

  render() {
    return (
      <SafeAreaView>
        <View style={styles.container}>
          <Text>I'm the ProfileTab component</Text>
        </View>
      </SafeAreaView>

    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export {ProfileTab};
