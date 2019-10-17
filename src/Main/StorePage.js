import { observer, renderReporter } from 'mobx-react';
import AppStore from '../AllStore/AppStore';
import { TitleBar, InputDialog } from 'miot/ui';
('use strict');
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Button,
  StatusBar,
  Image,
} from 'react-native';

import {
  Svg,
  Defs,
  Stop,
  LinearGradient,
  Ellipse,
  Rect,
  Circle,
  Path,
} from 'react-native-svg';
const { width, height } = Dimensions.get('window');
import React, { Component } from 'react';
import ProgressView from '../Component/ProgressView';
class StorePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShow: false,
    };
  }
  static navigationOptions = ({ navigation }) => {
    return {
      header: (
        <TitleBar
          title="Store"
          type="light"
          style={{ backgroundColor: 'black' }}
          onPressLeft={() => {
            navigation.goBack();
          }}
          onPressRight={() => {
            navigation.push('SceneModel');
          }}
          onPressRight2={() => { }}
        />
      ),
    };
  };
  // render() {
  //     return (
  //         <View style={{ flex: 1, backgroundColor: 'red' }} >
  //             <View style={{ backgroundColor: 'transparent', marginTop: 100, flexDirection: 'row', justifyContent: 'space-around' }} >
  //                 <Button title='Add' onPress={() => {
  //                     AppStore.plus();
  //                 }} />
  //                 <Text>{AppStore.counter}</Text>
  //                 <Button title='Minus' onPress={() => {
  //                     AppStore.minus();
  //                 }} />
  //             </View>
  //         </View>
  //     );
  // }

  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Svg height={height} width={width}>
          <Defs>
            <LinearGradient id="grad" x1="0" y1="0" x2="0" y2={height} >
              <Stop offset="0" stopColor="#A3E1F8" stopOpacity="1" />
              <Stop offset="1" stopColor="#4891F8" stopOpacity="1" />
            </LinearGradient>
          </Defs>
          <Circle cx={width / 2} cy={height / 2} r='100' fill="url(#grad)" />
        </Svg>
      </View>
    );
  }
}
const Store = observer(StorePage);
export default Store;
