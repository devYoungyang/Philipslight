
import {
    View,
    Text,
    Dimensions,
    StyleSheet,
    Image
} from 'react-native'
import React, { Component } from 'react'

export default class ProgressView extends Component {

    render() {
        return (
            <View style={[{ justifyContent: 'space-between', alignItems: 'center' }, this.props.style]}>
                {/* <Image source={require('../../resources/assets/灯泡亮.png')} />
                <Image source={require('../../resources/assets/小灯暗.png')} /> */}
                {this.props.children}
            </View>
        );
    }
}