import React from 'react';
import { StyleSheet, Text, View, Dimensions, Animated, PanResponder, ScrollView, Image, Slider } from 'react-native';
import { Ionicons } from '@expo/vector-icons'

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

export default class App extends React.Component {
  constructor(props) {
    super(props)
    
    this.state = {
      scrollEnabled: false,
    }
  }
  
  componentWillMount = () => {
    this.scrollOffset = 0

    this.animation = new Animated.ValueXY({x: 0, y: SCREEN_HEIGHT - 80});

    this.panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: (e, gestureState) => {
        if((this.state.scrollEnabled && this.scrollOffset <= 0 && gestureState.dy > 0) || !this.state.scrollEnabled && gestureState.dy < 0) {
          return true
        }
        else {
          return false
        }
      },
      onPanResponderGrant: (e, gestureState) => {
        this.animation.extractOffset()
      },
      onPanResponderMove: (e, gestureState) => {
        this.animation.setValue({x: 0, y: gestureState.dy})
      },
      onPanResponderRelease: (e, gestureState) => {
        if (gestureState.moveY > SCREEN_HEIGHT - 120) {
          Animated.spring(this.animation.y, {
            toValue: 0,
            tension: 1
          }).start()
        }
        else if (gestureState.moveY < 120) {
          Animated.spring(this.animation.y, {
            toValue: 0,
            tension: 1
          }).start()
        }
        else if (gestureState.dy < (-SCREEN_HEIGHT/5)) {
          this.setState({scrollEnabled: true})
          Animated.spring(this.animation.y, {
            toValue: -SCREEN_HEIGHT + 120,
            tension: 1
          }).start()
        }
        else if (gestureState.dy > (-SCREEN_HEIGHT / 5 ) && gestureState.dy < 0) {
          this.setState({ scrollEnabled: false })
          Animated.spring(this.animation.y, {
            toValue: 0,
            tension: 1
          }).start()
        }
        else if(gestureState.dy > 0) {
          this.setState({scrollEnabled: false})
          Animated.spring(this.animation.y, {
            toValue: SCREEN_HEIGHT - 120,
            tension: 1
          }).start()
        }
      }
    })
  }
  
  render() {
    const animatedHeight = {
      transform: this.animation.getTranslateTransform()
    }
    let animatedImageHeight = this.animation.y.interpolate({
      inputRange: [0, SCREEN_HEIGHT-80],
      outputRange: [230, 50],
      extrapolate: 'clamp'
    })
    let animatedSongTitleOpacity = this.animation.y.interpolate({
      inputRange: [0, SCREEN_HEIGHT - 500, SCREEN_HEIGHT - 80],
      outputRange: [0, 0, 1],
      extrapolate: 'clamp'
    })
    let animatedSongDetailsOpacity = this.animation.y.interpolate({
      inputRange: [SCREEN_HEIGHT - 500, SCREEN_HEIGHT - 80],
      outputRange: [1, 0],
      extrapolate: 'clamp'
    })
    let animatedImageMarginLeft = this.animation.y.interpolate({
      inputRange: [80, SCREEN_HEIGHT - 80],
      outputRange: [SCREEN_WIDTH/2 - 115, 10],
      extrapolate: 'clamp'
    })
    let animatedHeaderHeight = this.animation.y.interpolate({
      inputRange: [0, SCREEN_HEIGHT - 80],
      outputRange: [SCREEN_HEIGHT / 2, 80],
      extrapolate: 'clamp'
    })
    let animatedBackgroundColor = this.animation.y.interpolate({
      inputRange: [0, SCREEN_HEIGHT - 80],
      outputRange: ['rgba(100,100,100,0.5)', '#fff'],
      extrapolate: 'clamp'
    })

    return (
      <Animated.View style={{flex:1, backgroundColor: animatedBackgroundColor,}}> 
        <Animated.View
        {... this.panResponder.panHandlers}
        style={[{position: 'absolute', left: 0, right: 0, zIndex: 10, backgroundColor: '#fbfbfb', height: SCREEN_HEIGHT}, animatedHeight]}
        >
          <ScrollView 
          scrollEnabled={this.state.scrollEnabled}
          scrollEventThrottle={16}
          onScroll={e => {
            this.scrollOffset = e.nativeEvent.contentOffset.y
          }}
          >
            <Animated.View
            style={{height: animatedHeaderHeight, borderTopWidth: 1, borderTopColor: '#ebe5e5',
            flexDirection: 'row', alignItems: 'center',
            }}
            >
              <View style={{flex: 4, flexDirection: 'row', alignItems: 'center',}}>
                <Animated.View style={{height: animatedImageHeight, width: animatedImageHeight, marginLeft: animatedImageMarginLeft,}}>
                  <Image style={{ flex: 1, width: null, height: null, borderRadius: 5}} source={require('./assets/oba.jpg')} />
                </Animated.View>
                <Animated.Text style={{opacity:animatedSongTitleOpacity, fontSize: 18, paddingLeft: 10,}}>Oba Lewis</Animated.Text>
              </View>

              <Animated.View style={{flexDirection: 'row', flex: 1, opacity: animatedSongTitleOpacity, justifyContent: 'space-around', marginRight: 10,}}>
                <Ionicons name="ios-play" size={32} />
                <Ionicons name="ios-fastforward" size={32} />
              </Animated.View>
            </Animated.View>
            <Animated.View style={{height: animatedHeaderHeight, opacity: animatedSongDetailsOpacity}}>
              <View style={{flex: 1, alignItems: 'center', justifyContent: 'flex-end',}}>
                <Text style={{fontWeight: 'bold', fontSize: 22,}}>Oba Lewis</Text>
                <Text style={{ fontSize: 18, color:'#fa0000' }}>Moore - Slay Slavery</Text>
              </View>
              <View style={{flex: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around',}}>
                <Ionicons name="ios-rewind" size={40} />
                <Ionicons name="ios-pause" size={50} />
                <Ionicons name="ios-fastforward" size={40} />
              </View>
              <View style={{height: 40, width: SCREEN_WIDTH, alignItems: 'center', flexDirection: 'row', justifyContent: 'space-around',}}>
                <Ionicons name="ios-volume-mute" size={25} style={{color: '#777'}} />
                <Slider 
                minimumTrackTintColor='#777'
                maximumTrackTintColor='#ccc'
                style={{width: 270}}
                step={1}
                minimumValue={18}
                maximumValue={71}
                value={18}
                />
                <Ionicons name="ios-volume-up" size={25} style={{ color: '#777' }} />
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingBottom: 20, }}>
                <Ionicons name="ios-add" size={32} style={{color: '#fa0000'}} />
                <Ionicons name="ios-more" size={32} style={{ color: '#fa0000', fontWeight: 'bold', }} />
              </View>
            </Animated.View>
            <View style={{height: 1000}}>
            
            </View>
          </ScrollView>
        </Animated.View>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
