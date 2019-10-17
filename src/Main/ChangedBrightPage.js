
import {
    View,
    Button,
    Text,
    Dimensions,
    PanResponder,
    TouchableOpacity,
    Image,
    SafeAreaView,
    findNodeHandle,
    Platform,
    BackHandler,
    ImageBackground,
    StatusBar,
    DeviceEventEmitter,
    LayoutAnimation,
    TouchableWithoutFeedback,
    Animated,
} from 'react-native';
var ratio = Math.max(Dimensions.get('window').width / 375, 1);
const { width, height } = Dimensions.get('window');
import { localStrings } from '../Common/LocalizableString'
import { Device, Host, Package } from 'miot'
import React, { Component } from 'react'
import { comparer, observe } from 'mobx';
import TitleBar from 'miot/ui/TitleBar';
import AppStore from '../AllStore/AppStore';
import { Blur } from "gl-react-blur";
import ProgressView from '../Component/ProgressView';
import { BlurView, VibrancyView } from "@react-native-community/blur";
import { observer } from 'mobx-react';
import CommonJS from '../Common/CommonJS'
var navigation_current;
import NavigationBar from "miot/ui/NavigationBar";
import Slider from '../Component/ColumnSlider'
import { getStatusBarHeight } from 'react-native-iphone-x-helper'
import Svg, { Path, Circle } from 'react-native-svg';

class ChangedBrightPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            progressHeight: AppStore.bright == 1 ? width : width * (1 - AppStore.bright / 100),
            viewRef: null,
            lastProgressHeight: AppStore.bright == 1 ? width : width * (1 - AppStore.bright / 100),
            // lightImg: AppStore.bright > 50 ? require('../../resources/assets/level5.png') : require('../../resources/assets/level1.png'),
            // springValue: new Animated.Value(1),
        }
        this.springAnimated = Animated.spring(
            this.state.springValue,
            {
                toValue: 1,
                friction: 2,    //弹跳系数
                tension: 10,   // 控制速度
            }
        );
    }
    // static navigationOptions = (({ navigation }) => {
    //     navigation_current = navigation;
    //     return { header: null }
    // })
    _startAnimated() {
        this.state.springValue.setValue(0.1);
        this.springAnimated.start();
    }
    componentWillMount() {
        this.panResponser = PanResponder.create({
            onStartShouldSetPanResponder: (evt, gestureState) => true,//是否愿意成为响应者，响应手势，默认为false不能响应
            onMoveShouldSetPanResponder: (evt, gestureState) => true,
            onPanResponderGrant: (evt, gestureState) => {
                AppStore.changedLoopStatus(false);
                // console.log(`~~~onPanResponderGrant~~~最近一次移动时的屏幕纵坐标=${gestureState.moveY}~~~~累计纵向路程=${gestureState.dy}~~~~响应器产生时的屏幕坐标+${gestureState.y0}~~~~`)
            },
            onPanResponderMove: (evt, gestureState) => {
                // LayoutAnimation.spring();
                if (gestureState.dy == 0) {
                    this.setState({

                    })
                } else {
                    this.setState({
                        // progressHeight: Math.min(gestureState.dy - (height - width) / 2 + gestureState.dy, width) < 0 ? 0 : Math.min(gestureState.dy - (height - width) / 2 + gestureState.dy, width)
                        progressHeight: Math.min(this.state.lastProgressHeight + gestureState.dy, width) < 0 ? 0 : Math.min(this.state.lastProgressHeight + gestureState.dy, width)
                    })
                }
                AppStore.adjustBright((1 - this.state.progressHeight / width) * 100);
                if (AppStore.bright == 70) {
                    // this._startAnimated();
                }
                AppStore.changedLoopStatus(false);
                // console.log(`===onPanResponderMove==最近一次移动时的屏幕纵坐标=${gestureState.moveY}===累计纵向路程=${gestureState.dy}===响应器产生时的屏幕坐标+${gestureState.y0}===`)
            },
            onPanResponderRelease: (evt, gestureState) => {
                // this.props.setBright();
                AppStore.changedLoopStatus(true);
                // DeviceEventEmitter.emit('LoopStart', { isStartLoop: '1' })
                // AppStore.adjustBright((100 - parseInt(this.state.progressHeight / 4)));
                AppStore.adjustBright((1 - this.state.progressHeight / width) * 100);
                this.setCurrentBright()
                this.setState({
                    lastProgressHeight: this.state.progressHeight
                })
                // console.log(`+++onPanResponderRelease===${gestureState.moveY}+++${gestureState.dy}+++${gestureState.y0}+++`)
            },
            onPanResponderTerminate: (evt, gestureState) => {
                // console.log(`+++onPanResponderTerminate===${gestureState.moveY}+++${gestureState.dy}+++${gestureState.y0}+++`)
            }
        })
        this.addListener = DeviceEventEmitter.addListener('ChangedBright', () => {
            this.setState({
                progressHeight: AppStore.bright == 1 ? width : width * (1 - AppStore.bright / 100),
            })
        })


    }
    onMove(evt) {
        // <Blur factor={0.5} passes={2}></Blur>
        // console.log(`=====${evt.nativeEvent.pageY}~~~~${evt.nativeEvent.locationY}=====`);
    }
    setCurrentBright() {
        AppStore.changeSnm(0);
        AppStore.lampOn ? '' : AppStore.changedLampStatus(true);
        switch (AppStore.bright) {
            case 50:
                AppStore.changeSnm(3);
                break;
            case 20:
                AppStore.changeSnm(4);
                break;
            case 80:
                AppStore.changeSnm(2);
                break;
            case 100:
                AppStore.changeSnm(1)
                break;

            default:
                break;
        }
        Device.getDeviceWifi().callMethod('set_bright', [AppStore.bright]).then(res => {
            //   console.log ('~~~' + JSON.stringify (res) + '~~~~');
        });
    }
    componentDidMount() {
        AppStore.setCurrentPageIdx(2);
        // if (Platform.OS === 'android') {
        //     BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid.bind(this));
        // }
    }
    componentWillUnmount() {
        this.addListener.remove();
        // if (Platform.OS === 'android') {
        //     BackHandler.removeEventListener('hardwareBackPress', this.onBackAndroid.bind(this));
        // }
    }
    onBackAndroid() {
        AppStore.changedLoopStatus(true);
        AppStore.changedBrightPageStatus(false);
        // this.saveCacheInfo();
        // Package.exit();
    }
    loadCompleted() {
        this.setState({
            viewRef: findNodeHandle(this.blur)
        })
    }
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: Platform.OS == 'android' ? 'rgba(0,0,0,0.5)' : 'transparent' }}  >
                <TouchableWithoutFeedback style={{ flex: 1 }} onPress={() => {
                    AppStore.changedBrightPageStatus(false);
                }} >
                    <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }} >
                        <View style={{ position: 'absolute', top: getStatusBarHeight() + 20 * ratio, width: width, height: 40, alignItems: 'center' }} >
                            <Text style={{ color: '#fff', fontSize: 16, fontFamily: 'D-DIN' }} >{localStrings.lumStr + localStrings.adjust} </Text>
                            <Text style={{ color: '#fff', fontSize: 12, fontFamily: 'D-DIN' }} >{localStrings.lumStr + ' ' + AppStore.bright + '%'} </Text>
                        </View>
                        <View style={{ alignItems: 'center', marginTop: 70 * CommonJS.ratio, justifyContent: 'center', width: 0.5 * CommonJS.width, height: height * 0.6, }} {...this.panResponser.panHandlers} >
                            <View style={{ backgroundColor: 'rgba(235,235,235,0.68)', width: 0.33 * width, height: width, borderRadius: 30 * CommonJS.ratio, alignItems: 'center', overflow: 'hidden', }}  >
                                <View style={{ backgroundColor: '#fff', marginTop: this.state.progressHeight, width: 0.33 * CommonJS.width, height: (width - this.state.progressHeight), justifyContent: 'center', }} >
                                </View>
                            </View>
                            <Svg width={width * 0.3} height={width * 0.3} style={{ position: 'absolute', bottom: (height * 0.6 - width) / 2, }} >
                                <Circle cx={width * 0.15} cy={width * 0.15} r={AppStore.bright * 0.1 < 8 ? 8 : AppStore.bright * 0.1} strokeWidth="1" fill="rgba(0,0,0,0.3)" />
                                <Circle cx={width * 0.15} cy={width * 0.15} r={20 * ratio} stroke="rgba(0,0,0,0.3)" strokeWidth={AppStore.bright * 0.1 < 1 ? 1 : AppStore.bright * 0.1} strokeDasharray={[1, (2 * Math.PI * 20 * ratio - 8) / 8]} fill="transparent" />
                            </Svg>
                            {/* <Animated.Image source={this.state.lightImg} style={{ position: 'absolute', bottom: (height * 0.6 - width) / 2 + 30 * ratio, transform: [{ scale: this.state.springValue }] }} /> */}
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </View>

        );
    }
}
const ChangedBright = observer(ChangedBrightPage)
export default ChangedBright