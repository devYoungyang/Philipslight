
import {
    View,
    Text,
    Image,
    TouchableWithoutFeedback
} from 'react-native'
import React, { Component } from 'react'

export default class Card extends Component {

    customView() {
        return (
            <View style={[this.props.cardStyle, { flexDirection: "row", alignItems: 'center' }]} >
                <Image style={this.props.iconStyle} source={this.props.icon} />
                <Text style={this.props.textStyle} >{this.props.text}</Text>
            </View>
        );
    }
    render() {
        return (
            <TouchableWithoutFeedback onPress={() => { this.props.onPress() }} >
                <View style={this.props.cardStyle} >
                    <View style={{ width: this.props.cardStyle.width, height: this.props.cardStyle.height }}>
                        {this.props.innerView ? this.props.innerView : this.customView()}
                    </View>
                    {/* {
                        this.props.cover ? <View style={{ backgroundColor: 'rgba(0,0,0,0.2)', position: 'absolute', width: this.props.cardStyle.width, height: this.props.cardStyle.height, borderRadius: this.props.cardStyle.borderRadius }} >
                        </View> : null
                    } */}
                </View>
            </TouchableWithoutFeedback>
        );
    }
}

