
import {
    StyleSheet,
    Dimensions,
    Platform,
    StatusBar,
} from 'react-native'
import { Host } from 'miot'
//UI设计图的宽度
const designWidth = 750;
//UI设计图的高度
const designHeight = 1334;
const { width, height } = Host.systemInfo.mobileModel == 'GM1910' ? Dimensions.get('window') : Dimensions.get('screen')

const unitWidth = width / designWidth;
const unitHeight = height / designHeight;

var array = ['red', 'yellow', 'blue', 'green', 'orange', 'cyan'];
import { localStrings } from './LocalizableString'


var CommonJS = {
    width: width,
    height: height,
    unitWidth: unitWidth * 2,
    unitHeight: unitHeight * 2,
    ratio: Math.max(Dimensions.get('window').width / 375, 1),
    radomColor() {//十六进制颜色随机
        var r = Math.floor(Math.random() * 256);
        var g = Math.floor(Math.random() * 256);
        var b = Math.floor(Math.random() * 256);
        var color = '#' + (Array(6).join(0) + (r.toString(16) + g.toString(16) + b.toString(16))).slice(-6);
        return color;
    },
    secondTransformTime(second) {
        var h = 0, m = 0, s = 0;
        h = '0' + parseInt(second / 3600);
        m = parseInt((second % 3600) / 60) < 10 ? '0' + parseInt((second % 3600) / 60) : parseInt((second % 3600) / 60);
        s = (second % 3600) % 60 < 10 ? '0' + parseInt((second % 3600) % 60) : parseInt((second % 3600) % 60);
        return h + ':' + m + ':' + s;
    },
    changingRadius() {

    },
    radomColorOfArray() {
        var color = array.splice(parseInt(Math.random() * array.length), 1);
        return color;
    },
    colorDependonBright(bri) {
        if (bri <= 20) {
            return '#4a3f2e'
        } else if (bri > 20 && bri <= 40) {
            return '#2d655d'
        } else if (bri > 40 && bri <= 60) {
            return '#3691ff'
        } else if (bri > 60 && bri <= 80) {
            return '#ff9a8c'
        } else {
            return '#ffb14c'
        }
    },
    getSceneDatas() {
        return [
            { name: localStrings.brightness, color: '#3899FF', img: require('../../resources/assets/child.png'), content: { bright: '50' }, snm: 3 },
            { name: localStrings.tv, color: '#5874FF', img: require('../../resources/assets/reading.png'), content: { bright: '20' }, snm: 4 },
            { name: localStrings.warm, color: '#624DFF', img: require('../../resources/assets/work.png'), content: { bright: '80' }, snm: 2 },
            { name: localStrings.midNight, color: '#8016FB', img: require('../../resources/assets/learning.png'), content: { bright: '100' }, snm: 1 }]
    },
    shadowStyle: Platform.OS == 'ios' ? {
        shadowColor: 'red',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.15,
        shadowRadius: 2
    } : {
            elevation: 4
        },
    log(content) {
        if (__DEV__) {
            console.log(content);
        }
    },
    alert(content) {
        if (__DEV__) {
            alert(content);
        }
    },


}

module.exports = CommonJS;
