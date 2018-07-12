/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
  FlatList,
  TouchableOpacity,
  Animated,
  TouchableWithoutFeedback
} from 'react-native';

import { Icon, Header, Item, Input, Button } from 'native-base';
import {SafeAreaView} from 'react-navigation'
import axios from 'axios';

const SCREEN_HEIGHT = Dimensions.get('window').height
const SCREEN_WIDTH = Dimensions.get('window').width
const url = ''

console.disableYellowBox = true;


class SearchTab extends Component {
  state = { results: [], activeImage: null, data: false };



  componentWillMount() {



    this.fectchData("far");
    this.allImages = {}
    this.oldPosition = {}
    this.position = new Animated.ValueXY()
    this.dimensions = new Animated.ValueXY()
    this.animation = new Animated.Value(0)
    this.activeImageStyle = null


  }



  static navigationOptions = ({ navigation }) => {
    return {
      tabBarVisible: navigation.state.params ? navigation.state.params.isHeaderShow : true,
      tabBarIcon: ({tintColor}) => (
        <Icon  name="search" style={{color: tintColor}} />
        ),


    };
  };

  fectchData(searchTerm){

    axios.get('https://api.themoviedb.org/3/search/movie?api_key=d15f8590727891072d55cec97e08aba7&query='+ searchTerm)
    .then(response => this.setState({ results: response.data.results }));
  }

  openImage = (index) =>{

    this.props.navigation.setParams({isHeaderShow: false})
    this.allImages[index].measure((x, y, width, height, pageX, pageY) => {
      this.oldPosition.x = pageX
      this.oldPosition.y = pageY
      this.oldPosition.width = width
      this.oldPosition.height = height


    this.position.setValue({
      x: pageX,
      y: pageY
    })

    this.dimensions.setValue({
      x: width,
      y: height
    })



    this.setState({
      activeImage: this.state.results[index],

    },()=>{
      this.viewImage.measure((dx,dy,dWidth,dHeight,dPageX,dPageY)=>{
        Animated.parallel([
          Animated.timing(this.position.x,{
            toValue:dPageX,
            duration:300
          }),
          Animated.timing(this.position.y,{
            toValue:dPageY,
            duration:300
          }),
          Animated.timing(this.dimensions.x,{
            toValue:dWidth,
            duration:300
          }),
          Animated.timing(this.dimensions.y,{
            toValue:dHeight,
            duration:300
          }),
          Animated.timing(this.animation,{
            toValue:1,
            duration:300
          })
        ]).start()
      })
    })



  })
  }

  renderResults(item, index) {
      const uri = "https://image.tmdb.org/t/p/w185" + item.poster_path;
      console.log(item);

      return(
        <TouchableOpacity
          onPress={()=>this.openImage(index)}
          key={item.id}>
          <View style={{height: SCREEN_HEIGHT / 6, width: SCREEN_WIDTH / 4, padding: 10, shadowOpacity: 0.2,  shadowColor:'#000'}}>
            <Image ref={(image) => (this.allImages[index] = image )} style={{ flex:1, height: null, width: null, resizeMode: 'cover',}} source={{uri}} />
          </View>
        </TouchableOpacity>


      )
    }

    searchHandler(text){
      this.fectchData(text)
    }

      renderContent() {
        return(
          <ScrollView>
              <FlatList
                data={this.state.results}
                keyExtractor={(x, i) => i}
                numColumns={4}
                renderItem={({item, index}) =>this.renderResults(item, index)}
                />
          </ScrollView>
        )

      }


      closeImage = () => {
        this.props.navigation.setParams({isHeaderShow: true})
    Animated.parallel([
      Animated.timing(this.position.x, {
        toValue: this.oldPosition.x,
        duration: 300
      }),
      Animated.timing(this.position.y, {
        toValue: this.oldPosition.y,
        duration: 250
      }),
      Animated.timing(this.dimensions.x, {
        toValue: this.oldPosition.width,
        duration: 250
      }),
      Animated.timing(this.dimensions.y, {
        toValue: this.oldPosition.height,
        duration: 250
      }),
      Animated.timing(this.animation, {
        toValue: 0,
        duration: 250
      })
    ]).start(() => {
      this.setState({
        activeImage: null
      })
    })
  }





  render() {

    const activeImageStyle = {
      width: this.dimensions.x,
      height: this.dimensions.y,
      left: this.position.x,
      top: this.position.y
    }

    const animatedContentY = this.animation.interpolate({
    inputRange: [0, 1],
    outputRange: [-150, 0]
  })

  const animatedContentOpacity = this.animation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 1, 1]
  })

  const animatedContentStyle = {
    opacity: animatedContentOpacity,
    transform: [{
      translateY: animatedContentY
    }]
  }

  const animatedCrossOpacity = {
    opacity: this.animation
  }

    return (

      <View style={{ flex: 1 }}>
        <Header searchBar rounded>
      <Item>
        <Icon name="ios-search" />
        <Input
          autoCorrect={false}
          placeholder="Search"
          onChangeText={text => {
            this.setState({ text })
            this.searchHandler(text)
          }}
           />
      </Item>
    </Header>
    {this.renderContent()}
      <View style={StyleSheet.absoluteFill}
        pointerEvents={this.state.activeImage ? "auto" : "none"} >
        <View style={{ flex: 2, zIndex: 1002 }} ref={(view) =>
          (this.viewImage = view)}>
          <TouchableWithoutFeedback onPress={() => this.closeImage()}>
          <Animated.Image
            source={this.state.activeImage ? {uri: "https://image.tmdb.org/t/p/w185" + this.state.activeImage.poster_path } : null }
            style={[{ height: null, width: null, top: 0, left: 0, resizeMode: 'cover'}, activeImageStyle]}
            >

          </Animated.Image>
          </TouchableWithoutFeedback>
        </View>
        <Animated.View style={[{flex:1, zIndex: 1000, backgroundColor: 'white', padding:20, paddingTop: 50 }, animatedContentStyle]}>
          <ScrollView>
            <Text style={{ fontSize: 24, paddingBottom: 10}}>{this.state.activeImage ?this.state.activeImage.title : null}</Text>
            <Text>{this.state.activeImage ?this.state.activeImage.overview : null}</Text>
          </ScrollView>

    </Animated.View>
      </View>
      </View>



    );
  }
}



export {SearchTab};
