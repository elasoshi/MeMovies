import React, { Component } from 'react';
import { View, Text, Platform } from 'react-native';
import { Icon } from 'native-base';
import { TabNavigator } from 'react-navigation';
import { HomeTab, SearchTab, ProfileTab } from './AppTabNavigator/Index';

class Home extends Component {

  static navigationOptions = {
    header: null,
    statusBarStyle: 'black'
  }

  render(){
    return(

    <AppTabNavigator />

  );
  }
}

export { Home };

const AppTabNavigator = TabNavigator({

  HomeTab: {
    screen: HomeTab
  },
  SearchTab: {
    screen: SearchTab
  },
  ProfileTab: {
    screen: ProfileTab
  }

},{
  animationEnabled:true,
  swipeEnapled:true,
  tabBarPosition:"bottom",
  tabBarOptions: {
    style:{
      backgroundColor: 'black',
      ...Platform.select({
        android:{
          backgroundColor:'black'
        }
      })
    },
    activeTintColor: 'red',
    inactiveTintColor: 'grey',
    showLabel: false,
    showIcon: true
  }
});
