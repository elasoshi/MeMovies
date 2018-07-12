/* @flow */

import React, { Component } from 'react';
import pic from '../Images/pic.jpg'
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  Animated,
  PanResponder,
} from 'react-native';
import {SafeAreaView} from 'react-navigation'
import { Card, CardItem } from 'native-base';
import axios from 'axios';

const SCREEN_HEIGHT = Dimensions.get('window').height
const SCREEN_WIDTH = Dimensions.get('window').width

class CardComponent extends Component {

  //state = { movies: [] };

  constructor(){
    super()

    this.position = new Animated.ValueXY()
    this.state = {
      currentIndex: 0, movies: []
    }

    this.page = 0

    this.rotate = this.position.x.interpolate({
      inputRange:[-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange:['-10deg','0deg','10deg'],
      extrapolate: 'clamp'
    })

    this.rotateAndTranslate = {
      transform:[{rotate: this.rotate
    },
    ...this.position.getTranslateTransform()
  ]
}
this.nextCardOpacity = this.position.x.interpolate({
  inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
  outputRange: [1, 0, 1],
  extrapolate: 'clamp'
})
this.nextCardScale = this.position.x.interpolate({
  inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
  outputRange: [1, 0.8, 1],
  extrapolate: 'clamp'
})



  }

  componentWillMount() {



    this.page = this.page + 1;

      axios.get('https://api.themoviedb.org/3/movie/popular?api_key=d15f8590727891072d55cec97e08aba7&language=en-US&page='+ this.page)
      .then(response => this.setState({ movies: response.data.results }));

      console.log(this.state.movies);

      this.PanResponder = PanResponder.create({

        onStartShouldSetPanResponder:(evt,gestureState) =>true,
        onPanResponderMove: (evt,gestureState) => {
          this.position.setValue({ x: gestureState.dx, y: gestureState.dy })
        },
        onPanResponderRelease:(evt,gestureState) => {

          if (gestureState.dx > 120) {
            Animated.spring(this.position, {
              toValue: { x: SCREEN_WIDTH + 100, y: gestureState.dy }
            }).start(() => {
              this.setState({ currentIndex: this.state.currentIndex + 1 }, ()  => {
              this.position.setValue({ x:0, y: 0 })
            })
            })
          }else if (gestureState.dx < -120) {
            Animated.spring(this.position, {
              toValue: { x: -SCREEN_WIDTH - 100, y: gestureState.dy }
            }).start(() => {
              this.setState({ currentIndex: this.state.currentIndex + 1 }, ()  => {
              this.position.setValue({ x:0, y: 0 })
            })
            })
          }else {
            Animated.spring(this.position,{
              toValue: { x: 0, y:0 },
              friction: 4
            }).start()
          }
        }
      })
  }

  renderMovies() {
    return this.state.movies.map((item,i) =>{

      if( i < this.state.currentIndex){
          return null
      }else if (i == this.state.currentIndex) {
        const uri = "https://image.tmdb.org/t/p/w185" + item.poster_path;

        return(
            <Animated.View
              {...this.PanResponder.panHandlers}
               key={item.id} style={[this.rotateAndTranslate,
              { height: SCREEN_HEIGHT - 150, width: SCREEN_WIDTH, padding: 10, position: 'absolute'}]}>

              <Image style={{ flex:1, height: null, width: null, resizeMode: 'cover', borderRadius: 20 }} source={{uri}} />
          </Animated.View>


        )
      }else {
        const uri = "https://image.tmdb.org/t/p/w185" + item.poster_path;

        return(

            <Animated.View

               key={item.id} style={[{opacity: this.nextCardOpacity, transform: [{ scale: this.nextCardScale }],
                height: SCREEN_HEIGHT - 150, width: SCREEN_WIDTH, padding: 10, position: 'absolute'}]}>

              <Image style={{ flex:1, height: null, width: null, resizeMode: 'cover', borderRadius: 20 }} source={{uri}} />

          </Animated.View>


        )
      }


      this.page = this.page + 1;

        axios.get('https://api.themoviedb.org/3/movie/popular?api_key=d15f8590727891072d55cec97e08aba7&language=en-US&page='+ this.page)
        .then(response => this.setState({ movies: response.data.results }));


    }).reverse()


  }

  render() {

    return (
      <SafeAreaView style={{ flex: 1}}>
        <View style={{ flex: 1 }}>

          <View style={{ flex: 1 }}>
            {this.renderMovies()}
          </View>
          <View style={{ height: 60}}>

          </View>

        </View>
      </SafeAreaView>



    );
  }
}


export { CardComponent };
