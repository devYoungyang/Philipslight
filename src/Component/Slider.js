
import {
    View,
    Text,
    Image,
    PanResponder,
} from 'react-native';
import React, { Component } from 'react';

class Slider extends Component {
    constructor(props) {
        super(props);

    }
    componentWillMount() {
        this.panResponder = PanResponder.create({
            onStartShouldSetPanResponder: (e, gestureState) => true,
            onStartShouldSetPanResponderCapture: (e, gestureState) => true,
            onMoveShouldSetPanResponder: (e, gestureState) => true,
            onMoveShouldSetPanResponderCapture: (e, gestureState) => true,
            onPanResponderStart: () => {

            },
            onPanResponderMove: () => {

            },
            onPanResponderRelease: () => {

            },
            onPanResponderTerminate: () => {

            }
        })
    }

    render() {
        return (<View style={this.props.style} >
            <View style={[this.props.style, { backgroundColor: this.props.allColor }]} >

            </View>
            <View></View>
        </View>);
    }
}

export default Slider;