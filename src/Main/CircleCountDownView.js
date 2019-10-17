'use strict'

import React from 'react';
import {
    View,
    StyleSheet,
    Dimensions,
    ART,
    Image,
    Text,
    SafeAreaView,
    StatusBar,
    TouchableOpacity,
    DeviceEventEmitter,
    Button,
} from 'react-native';
import NavigationBar from "miot/ui/NavigationBar";
const {
    Surface,
    Group,
    Shape,
    Transform
} = ART;
import {
    Svg,
    Circle,
    Line,
    G,
    Defs,
    Rect,
    Polygon,
    ClipPath,
    Path
} from 'react-native-svg';

import {
    MessageDialog,
} from "miot/ui/Dialog";
// import {getString} from "../../com.philips.light.moonlight/Main/MHLocalizableString";
// import { localStrings } from "../Common/LocalizableString";
// import MytitleBarWhite from "../Common/MyTitleBarWhite";
// import ReportLog from "../../com.philips.light.rn_ceiling_nr/CommonModules/ReportLog";
import {
    Device,
    Package
} from "miot";
import AppStore from '../AllStore/AppStore';
const width = Dimensions.get('screen').width;
var operateWidth = 0;
var operateHeight = 0;
var totalWidth = 0;
var totalHeight = 0;
var outerRadius = 0;
var centerX = 0;
var centerY = 0;
var innerRadius;
var rows = Array.apply(null, Array(180)).map((_, i) => 0 + i);
var circleCount = 0;

var pointerLocationX = 0;
var pointerLocationY = 0;

var sliding = false;
var lastAngle = 0;

var isShowDialog = false;
var lastClickTime = 0;
import { localStrings } from '../Common/LocalizableString'
import CommonJS from '../Common/CommonJS'
import Separator from 'miot/ui/Separator';
export default class CircleCountDownView extends React.Component {

    static navigationOptions = ({ navigation }) => {
        return {
            header: <View>
                < NavigationBar
                    backgroundColor='#fff'
                    type={AppStore.statusBarType}
                    title={localStrings.delayStr}
                    left={
                        [{
                            key: NavigationBar.ICON.BACK,
                            onPress: () => {
                                AppStore.setStatusBarType('light')
                                navigation.goBack();
                            }
                        }]
                    }
                />
                <Separator style={{ height: 0.25, }} />
            </View>
        }
    }
    constructor(props) {
        super(props);
        // this.delayOff = this.props.navigation.state.params.delayOff * 0.1;
        // this.power = this.props.navigation.state.params.power;
        this.delayOff = AppStore.delayTime * 0.1;
        // this.power = AppStore.lampOn;
        // console.log(this.props.navigation.state.params.delayOff + "=====delayOff======" + this.delayOff);
        this.state = {
            // allAngle: props.angle ? props.angle : 0,
            allAngle: this.delayOff,//角度
            action: false,
            power: AppStore.lampOn,//
            alertMessage: '',
            powerOnAlert: false
        }
        circleCount = parseInt(this.delayOff / 360);
        rows.length = 360;
        this._onLayout = this._onLayout.bind(this);
        this._getTimeText = this._getTimeText.bind(this);
        this._doCountDown = this._doCountDown.bind(this);
        this.updatePointerByAngle = this.updatePointerByAngle.bind(this);
        this._powerChange = this._powerChange.bind(this);
        // this.getInfoFromCloud = this.getInfoFromCloud.bind(this);
    }
    _doCountDown() {
        let tempAngle = this.state.allAngle - 0.1,
            circleCount = tempAngle % 360;
        if (tempAngle * 10 < 1) {
            tempAngle = 0,
                clearInterval(this.timer);
            // todo 
            //定时结束
            if (this.props.onCountDownEnd) {
                this.props.onCountDownEnd();
            }
        } else if (tempAngle * 10 > 360 * 10 * 6) {
            tempAngle = 360 * 6;
            circleCount = t;
        }
        this.setState({
            allAngle: tempAngle,
        })
    }
    _powerChange(value) {
        // console.warn("_sceneChange===" + JSON.stringify(value));
        this.setState({
            power: value.power,
        });
    }
    componentDidMount() {
        AppStore.setCurrentPageIdx(2);
        if (this.state.allAngle > 0) {
            this.startTimer();
        }
        this._powerChangeListener = DeviceEventEmitter.addListener('powerChange', this._powerChange);
    }
    componentWillMount() {
        DeviceEventEmitter.addListener('DelayOffTime', (res) => {
            // alert(JSON.stringify(res));
            this.setState({
                allAngle: AppStore.delayTime * 0.1,
                power: AppStore.lampOn
            })
            this.startTimer();
            circleCount = AppStore.lampOn ? parseInt(AppStore.delayTime * 0.1 / 360) : 0;
            // let tempAngle = this.state.allAngle - 0.1,
            //     circleCount = tempAngle % 360;
        })
    }
    componentWillUnmount() {
        if (this.timer) {
            clearInterval(this.timer);
        }
        this._powerChangeListener.remove();
    }
    /**
     * 测量事件
     * @param {Obj} nativeEvent 测量事件
     * 
     * 
     */
    _onLayout(e) {
        if (operateHeight == 0) {
            if (e.nativeEvent.layout.height == 0 || e.nativeEvent.layout.width == 0) {
                operateHeight = width;
                operateWidth = width;
                // 控件总宽高
                totalHeight = width;
                totalWidth = width;

            } else {
                operateHeight = Math.min(e.nativeEvent.layout.width, e.nativeEvent.layout.height);
                operateWidth = operateHeight;
                totalHeight = e.nativeEvent.layout.height;
                totalWidth = e.nativeEvent.layout.width;
            }
            centerX = totalWidth / 2;
            centerY = totalHeight / 2;
            outerRadius = operateHeight * 0.5 * 0.7;
            innerRadius = outerRadius - 28; //28？？？
            this.forceUpdate();
        }
    }
    /**
     * 根据手势求角度
     * @param {number} event 触摸事件
     */
    _getAngleByEvent(event) {
        let tempAngle = Math.atan((totalHeight / 2 - event.nativeEvent.locationY) / (event.nativeEvent.locationX - totalWidth / 2)) * 180 / Math.PI
        if (event.nativeEvent.locationX >= totalWidth / 2 && event.nativeEvent.locationY < totalHeight / 2) { //第一象限
            tempAngle = 90 - tempAngle;
        } else if (event.nativeEvent.locationX > totalWidth / 2 && event.nativeEvent.locationY >= totalHeight / 2) { //第二象限
            tempAngle = 90 - tempAngle;
        } else if (event.nativeEvent.locationX <= totalWidth / 2 && event.nativeEvent.locationY > totalHeight / 2) { //第三象限
            tempAngle = 270 - tempAngle;
        } else { //第四象限
            tempAngle = 270 - tempAngle;
        }
        return tempAngle;
    }
    _updateAllAngle(event) {
        let tempAngle = this._getAngleByEvent(event);
        if (tempAngle > 280 && lastAngle >= 0 && lastAngle < 80) {
            circleCount--;
        } else if (tempAngle >= 0 && tempAngle < 80 && lastAngle > 280) {
            circleCount++;
        }
        if (circleCount <= -1) {
            circleCount = -1;
        }
        if (circleCount > 6) {
            // circleCount = 6;
        }
        let tempAllAngle = circleCount * 360 + tempAngle;
        if (tempAllAngle < 0) {
            tempAllAngle = 0;
        }
        lastAngle = tempAngle;
        this.setState({
            allAngle: tempAllAngle,
        })
    }
    /**
     * 是否在点击范围内
     */
    updatePointerByAngle(event) {
        let x = centerX + outerRadius * Math.sin(this.state.allAngle * Math.PI / 180);
        let y = centerY - outerRadius * Math.cos(this.state.allAngle * Math.PI / 180);
        console.log(Math.abs(event.nativeEvent.locationX + x), '---- updatePointerByAngle  ----', Math.abs(event.nativeEvent.locationY - y));
        // console.log(event.nativeEvent.locationX, '---- updatePointerByAngle  ----', x);
        if (Math.pow(event.nativeEvent.locationX - x, 2) + Math.pow(event.nativeEvent.locationY - y, 2) <= Math.pow(25, 2)) {
            return true;
        } else {
            return false;
        }
    }
    /**
     * 取消定时
     */
    cancleCountDown() {
        // 取消定时 
        this.setState({
            allAngle: 0,
        })
        circleCount = 0;
        if (this.timer) {
            clearInterval(this.timer);
        }
        this.setDelayCMD(0);
        if (this.props.onCountDownCancel) {
            this.props.onCountDownCancel();
        }
    }
    /**
     *  
     * @param {event} event 当手指落下时
     */
    _onTouchDown(event) {

        // DeviceEventEmitter.emit('LoopStop', {});
        AppStore.changedLoopStatus(false);
        //TODO 添加判断？？
        // alert(this.state.allAngle);
        // if (!this.state.power) {
        //     this._alertPowerOn(localStrings.failDelayTipStr);
        //     return;
        // }

        sliding = this.updatePointerByAngle(event);
        if (sliding) {
            lastAngle = this.state.allAngle % 360;
            this.setState({
                action: true,
            })
            if (this.timer) {
                clearInterval(this.timer);
            }
            // alert(this.state.all)
            this._updateAllAngle(event);

        }
        if (Math.pow(event.nativeEvent.locationX - centerX, 2) + Math.pow(event.nativeEvent.locationY - centerY, 2) <= Math.pow(0.5 * innerRadius, 2)) {
            this.cancleCountDown();
        }
    }
    _onTouchMove(event) {
        AppStore.changedLoopStatus(false);
        if (sliding) {
            this._updateAllAngle(event);
        }
    }
    startTimer() {
        if (this.timer) {
            clearInterval(this.timer);
        }
        this.timer = setInterval(() => {
            this._doCountDown();
        }, 1000);
    }
    _onTouchUp(event) {
        // DeviceEventEmitter.emit('LoopStart', {});
        AppStore.changedLoopStatus(true);
        if (!this.state.power && this.state.allAngle != 0) {
            this.setState({
                allAngle: 0,
                action: false
            })
            this._alertPowerOn(localStrings.failDelayTipStr);
            return;
        }

        this._getAngleByEvent(event);
        if (sliding) {
            if (parseInt(this.state.allAngle * 10) <= 0) {
                circleCount = 0;
                this.setState({
                    allAngle: 0,
                    action: false,
                })
            } else {

                this.startTimer();
                this.setState({
                    action: false,
                })
            }
            sliding = false;
            lastAngle = 0;
            // circleCount = this.state.allAngle / 360;
            //TODO 最大6个小时
            if (this.state.allAngle * 10 > 3600 * 6) {

                this._alertPowerOn(localStrings.delayTipStr4);
                this.setState({
                    allAngle: 360 * 6
                })
            }
            this.setDelayCMD(this.state.allAngle * 10);
            AppStore.changedDv(this.state.allAngle * 10);//延时
            // if (this.props.onCountDownSlect) {
            //     this.props.onCountDownSlect(this.state.allAngle);
            // }
        }
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.angle && Math.abs(nextProps.angle - this.state.allAngle) >= 1) {
            this.setState({
                allAngle: nextProps.angle,
            })
        }
    }
    _alertPowerOn(stringvalue) {
        if (isShowDialog) {
            return;
        }
        if (this.state.power) {
            circleCount = 5;
        }
        this.setState({
            alertMessage: stringvalue,
            powerOnAlert: true,
            // allAngle: 360 * 6
        });
    }

    /**
     * 获取圆的路径
     */
    _getCirclePath() {

        var flag = 1;
        if (this.state.allAngle <= 0) {
            flag = 0;
        }

        // console.log("CirclePath<180===lanse=" + "M " + centerX + " " + (centerY - innerRadius) + " A " + innerRadius + " " + innerRadius + " 0 0 1 " + (centerX + innerRadius * Math.sin(Math.PI * this.state.allAngle / 180)) + " " + (centerY - innerRadius * Math.cos(Math.PI * this.state.allAngle / 180)))
        // console.log("CirclePath>180===lanse=" + "M " + centerX + " " + (centerY - innerRadius) + " A " + innerRadius + " " + innerRadius + " 0 0 1 " + centerX + " " + (centerY + innerRadius) + "A " + innerRadius + " " + innerRadius + " 0 0 1 " + (centerX + innerRadius * Math.sin(Math.PI * this.state.allAngle / 180)) + " " + (centerY - innerRadius * Math.cos(Math.PI * this.state.allAngle / 180)))

        // this.state.allAngle = 60;
        // A rx ry x-axis-rotation large-arc-flag sweep-flag x y
        // A 画圆弧 rx x轴的半径 ry y轴的半径  x-axis-rotation 表示弧形旋转的情况   large-arc-flag 角度大小  sweep-flag 大圆还是小圆 x 结束的x坐标 y 结束的y坐标
        if (this.state.allAngle < 180) {
            return "M " + centerX + " " + (centerY - innerRadius) + " A " + (innerRadius) + " " + innerRadius + " 0 0 1 " + (centerX + flag + innerRadius * Math.sin(Math.PI * this.state.allAngle / 180)) + " " + (centerY - innerRadius * Math.cos(Math.PI * this.state.allAngle / 180));
        } else {
            return "M " + centerX + " " + (centerY - innerRadius) + " A " + innerRadius + " " + innerRadius + " 0 0 1 " + centerX + " " + (centerY + innerRadius) + "A " + innerRadius + " " + innerRadius + " 0 0 1 " + (centerX + innerRadius * Math.sin(Math.PI * this.state.allAngle / 180)) + " " + (centerY - innerRadius * Math.cos(Math.PI * this.state.allAngle / 180));
        }
    }
    /**
     * 获取未选中圆的路径
     */
    _getUnCirclePath() {
        // console.log("CirclePath<180===in=" + "M " + centerX + " " + (centerY - innerRadius) + " A " + innerRadius + " " + innerRadius + " 0 0 0 " + centerX + " " + (centerY + innerRadius) + "A " + innerRadius + " " + innerRadius + " 0 0 0 " + (centerX + innerRadius * Math.sin(Math.PI * this.state.allAngle / 180)) + " " + (centerY - innerRadius * Math.cos(Math.PI * this.state.allAngle / 180)))
        // console.log("CirclePath>180===in=" + "M " + centerX + " " + (centerY - innerRadius) + " A " + innerRadius + " " + innerRadius + " 0 0 0 " + (centerX + innerRadius * Math.sin(Math.PI * this.state.allAngle / 180)) + " " + (centerY - innerRadius * Math.cos(Math.PI * this.state.allAngle / 180)))
        var flag = -1;
        if (this.state.allAngle < 180) {
            // flag = 1;
        }
        if (this.state.allAngle == 360) {
            flag = 0;
        }
        if (this.state.allAngle > 180) {
            return "M " + centerX + " " + (centerY - innerRadius) + " A " + innerRadius + " " + innerRadius + " 0 0 0 " + (centerX + flag + innerRadius * Math.sin(Math.PI * this.state.allAngle / 180)) + " " + (centerY - innerRadius * Math.cos(Math.PI * this.state.allAngle / 180));
        } else {
            return "M " + centerX + " " + (centerY - innerRadius) + " A " + innerRadius + " " + innerRadius + " 0 0 0 " + centerX + " " + (centerY + innerRadius) + "A " + innerRadius + " " + innerRadius + " 0 0 0 " + (centerX + innerRadius * Math.sin(Math.PI * this.state.allAngle / 180)) + " " + (centerY - innerRadius * Math.cos(Math.PI * this.state.allAngle / 180));
        }
    }
    /**
     * 获取事件
     */
    _getTimeText() {
        let secondsCounts = parseInt(this.state.allAngle * 10);
        let hour = parseInt(secondsCounts / 3600);
        if (hour < 10) {
            hour = '0' + hour;
        }
        let mins = parseInt(secondsCounts % 3600 / 60);
        if (mins < 10) {
            mins = '0' + mins;
        }
        let seconds = parseInt(secondsCounts % 3600 % 60);
        if (seconds < 10) {
            seconds = '0' + seconds;
        }
        return hour + ":" + mins + ":" + seconds;
    }

    _getSubText() {
        if (this.state.action) {
            return localStrings.delayTipStr3;
        } else if (this.state.allAngle * 10 >= 1) {
            return localStrings.delayTipStr2;
        } else {
            return localStrings.delayTipStr1;
        }
    }

    setDelayCMD(second) {

        var tempValue = 0;
        if (second == 0) {
            tempValue = 0;
        } else if (second > 0 && second <= 10) {
            tempValue = 1;
        } else if (second > 10 && second <= 30) {
            tempValue = 2;
        } else if (second > 30 && second <= 60) {
            tempValue = 3;
        } else if (second > 60 && second <= 120) {
            tempValue = 4;
        } else if (second > 120 && second <= 180) {
            tempValue = 5;
        } else if (second > 180 && second <= 240) {
            tempValue = 6;
        } else if (second > 240 && second <= 360) {
            tempValue = 7;
        }

        // if (tempValue == 0) {
        //     ReportLog.addRecord(Device.deviceID, [{"com.philips.light.zyceiling.button.delayoff.ios":"prop.off"}]);
        // }else{
        //     ReportLog.addRecord(Device.deviceID, [{"com.philips.light.zyceiling.button.doLevel.ios":tempValue}]);
        // }
        // alert(second);

        second = second > 3600 * 6 ? 3600 * 6 : second;
        AppStore.setDelayTime(second);
        Device.getDeviceWifi().callMethod("delay_off", [second]).then((json) => {
            if (json.code == 0) {
                // alert("Delay successfully!");
            } else {

            }
        }).catch((err) => {
            // alert(JSON.stringify(err));
        });
    }
    render() {
        let circle;
        if (this.state.allAngle > 360) {
            circle = (<
                Circle cy={
                    centerY
                }
                cx={
                    centerX
                }
                r={
                    innerRadius
                }
                originX={
                    centerX
                }
                originY={
                    centerY
                }
                stroke={
                    '#0099FF'
                }
                strokeDasharray={
                    [1, (2 * Math.PI * innerRadius - 180) / 180]
                }
                strokeWidth='20'
                fill='transparent' />
            )
        } else {
            circle = (<
                Path
                stroke='#0099FF'
                strokeDasharray={
                    [1, (2 * Math.PI * innerRadius - 180) / 180]
                }
                strokeWidth='18'
                fill='transparent'
                d={
                    this._getCirclePath()
                }
            />
            )
        }
        return (<SafeAreaView style={{ flex: 1, backgroundColor: "#F7F7F7" }}>
            <View onLayout={e => { this._onLayout(e) }} >
                {operateHeight != 0 &&
                    < View style={[styles.container, { width: operateWidth, height: operateHeight, marginTop: 80 * CommonJS.unitHeight }]}
                    >
                        <Svg height={totalHeight} width={totalWidth} style={{ position: 'absolute', }}>
                            {/* 外面的蓝色大圆 */}
                            <Circle
                                r={outerRadius}
                                cx={centerX}
                                cy={centerY}
                                stroke='#0099FF'
                                strokeWidth={1}
                                fill='none'
                            />
                            {/* 角度小于360，灰色的内部线 */}
                            {this.state.allAngle < 360 &&
                                <Path
                                    stroke='#C2C2C2'
                                    strokeDasharray={[1, (2 * Math.PI * innerRadius - 180) / 180]}
                                    strokeWidth='18'
                                    fill='transparent'
                                    d={this._getUnCirclePath()}
                                />
                            }
                            {circle}
                        </Svg>
                        {/* 指示点位置 */}
                        <View style={{ width: operateWidth, height: operateHeight, position: 'absolute', transform: [{ rotate: this.state.allAngle % 360 + 'deg' }] }}>
                            <Image style={[styles.pointer, { top: operateHeight / 2 - outerRadius - 15, tintColor: "#0099FF" }]} source={require('../../resources/assets/thumb_on.png')} />
                        </View>
                        {/* 字体 */}
                        <View style={{ position: 'absolute' }} onStartShouldSetResponder={() => true} onResponderGrant={() => { this.cancleCountDown() }}>
                            <Text style={[styles.timeStr, this.state.allAngle == 0 ? { color: '#C2C2C2' } : { color: '#0099FF', }]}>{this._getTimeText()}</Text>
                            <Text style={[styles.timeDesStr, this.state.allAngle == 0 ? { color: '#C2C2C2' } : { color: '#0099FF', }]} >{this._getSubText()}</Text>
                        </View>
                        {/* 手势响应事件 */}
                        <View style={{ width: totalWidth, height: totalHeight, backgroundColor: 'transparent', position: 'absolute' }}
                            onStartShouldSetResponder={() => true}
                            onResponderGrant={event => { this._onTouchDown(event); }}
                            onResponderMove={event => { this._onTouchMove(event) }}
                            onResponderRelease={event => this._onTouchUp(event)} >
                        </View>
                    </View>
                }
            </View>
            {/* <MessageDialog
                title={localStrings.warStr}
                message={this.state.alertMessage}
                cancelable={false}
                // cancel={localStrings.cancel}
                confirm={localStrings.conformStr}
                onCancel={(e) => {
                    lastClickTime = new Date().getTime();
                    this.setState({ powerOnAlert: false });
                }}
                onConfirm={(e) => {
                    lastClickTime = new Date().getTime();
                    this.setState({ powerOnAlert: false });
                }}
                onDismiss={() => {
                    lastClickTime = new Date().getTime();
                    isShowDialog = false;
                    this.setState({ powerOnAlert: false });
                }}
                visible={this.state.powerOnAlert}
            /> */}
            <MessageDialog
                title={localStrings.warStr}
                message={this.state.alertMessage}
                visible={this.state.powerOnAlert}
                onDismiss={() => {
                    lastClickTime = new Date().getTime();
                    isShowDialog = false;
                    this.setState({ powerOnAlert: false });
                }}
                buttons={[
                    {
                        text: '确定',
                        style: { color: "#32BAC0" },
                        callback: () => {
                            lastClickTime = new Date().getTime();
                            this.setState({ powerOnAlert: false });
                        }
                    }
                ]}
            />
        </SafeAreaView>
        )
    }
}
var styles = StyleSheet.create({
    container: {
        // backgroundColor: '#2E1F4A',
        // marginTop:100,
        alignItems: 'center',
        justifyContent: 'center',

    },
    pointer: {
        height: 30,
        width: 40,
        alignSelf: 'center',
        resizeMode: 'contain',
        // backgroundColor: '#2E1F4A',
        padding: 10,
    },
    timeStr: {
        fontSize: 36,
        textAlign: 'center',
        fontFamily: 'D-DIN'
    },
    timeDesStr: {
        fontSize: 16,
        textAlign: 'center',
        width: width * 0.42,
        fontFamily: 'D-DIN'
    }
});