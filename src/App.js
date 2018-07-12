import React, { Component } from 'react';
import { SafeAreaView, StatusBar, View } from 'react-native';
import { StackNavigator } from 'react-navigation';
import { Home } from './Components/Home';

class App extends Component {
  render(){
    return (
        <AppStackNavigator />
      



    )
  }
}

const AppStackNavigator = StackNavigator({

  Main: {
    screen: Home
  }
})

export default App;
