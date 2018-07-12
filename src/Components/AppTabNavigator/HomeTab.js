/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar
} from 'react-native';


import { Container, Content, Icon, } from 'native-base';
import { CardComponent } from '../Index';



class HomeTab extends Component {
  componentDidMount() {
    this._navListener = this.props.navigation.addListener('didFocus', () => {
      StatusBar.setBarStyle('light-content');
    });
  }

  componentWillUnmount() {
    this._navListener.remove();
  }

  static navigationOptions ={
    tabBarIcon: ({tintColor}) => (
      <Icon type="Foundation" name="home" style={{color: tintColor}} />
      )
  }


  render() {
    return (


      <Container style={styles.containerStyle}>


        <Content>
          <CardComponent />
        </Content>

      </Container>

    );
  }
}

const styles = {
  containerStyle: {
    backgroundColor: 'black',
  }
}

export {HomeTab};
