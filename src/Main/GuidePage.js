import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  PanResponder,
  Image,
  SafeAreaView,
  Platform,
  runAfterInteractions,
  findNodeHandle,
  InteractionManager
} from 'react-native';
import React, { Component } from 'react';
import { BlurView, VibrancyView } from "@react-native-community/blur";
const { width, height } = Dimensions.get('window')
import { localStrings } from '../Common/LocalizableString'


export default class Modal extends React.Component {
  constructor(props) {
      super(props);
      this.state = { viewRef: null };
  }
  render() {
      return (
          <View style={this.props.style}>
              <View
                  ref="backgroundWrapper"
                  style={[styles.absolute]}
                  onLayout={
                      Platform.select({
                          ios: () => this.setState({ viewRef: findNodeHandle(this.refs.backgroundWrapper) }),
                          android: () => InteractionManager.runAfterInteractions(() => setTimeout(() =>
                              this.setState({ viewRef: findNodeHandle(this.refs.backgroundWrapper) }), 20))
                      })
                  }
              >
                  {this.props.children}
              </View>
              {(this.state.viewRef || Platform.OS === "ios") &&
              <BlurView
                  style={[styles.absolute]}
                  viewRef={this.state.viewRef}
                  blurType="dark"
                  {...Platform.select({
                      ios: {
                          blurAmount: 3,
                          blurType: "dark"
                      },
                      android: {
                          // blurAmount: 31,
                          blurRadius: 9,
                          downsampleFactor: 9,
                      }
                  })}
              />}
              <View><Text>MainContent</Text></View>
          </View>
      );
  }
}

var styles=StyleSheet.create({
  absolute:{
    position:'absolute',
    left:0,
    right:0,
    height:height,
    width:width,
  }
})
// export default class GuidePage extends Component {
//   constructor(props) {
//     super(props);
//   }
//   componentWillMount() {
//     this.panResponser = PanResponder.create({
//       onStartShouldSetPanResponder: (evt, gestureState) => true,//是否愿意成为响应者，响应手势，默认为false不能响应
//       onMoveShouldSetPanResponder: (evt, gestureState) => true,
//       onPanResponderGrant: (evt, gestureState) => {
//         // this.props.onMove();
//       },
//       onPanResponderMove: (evt, gestureState) => {
//         // this.props.onMove();
//         if (Math.abs(gestureState.dy) > 50 || Math.abs(gestureState.dx) > 50) {
//           this.props.onMove();
//         }

//       },
//       onPanResponderRelease: (evt, gestureState) => {

//       },
//       onPanResponderTerminate: (evt, gestureState) => {

//       }
//     })
//   }

//   render() {
//     return (
//       <View style={this.props.style} {...this.panResponser.panHandlers}  >
//         <BlurView
//           style={{ width: this.props.style.width, height: this.props.style.height ,position:'absolute'}}
//           blurType='dark'
//         />
//         <Image
//           style={{ width: 108, height: 231, marginLeft: 145, marginTop: 182 }}
//           source={require('../../resources/assets/控制手势提示.png')}
//         // onStartShouldSetResponder={() => true} onResponderMove={(event) => this.props.onMove()}
//         />
//         <Text style={{ color: '#fff', fontSize: 20, marginTop: 42, marginLeft: 125 }}>{localStrings.guideTip2}</Text>
//       </View>

//     );
//   }
// }
