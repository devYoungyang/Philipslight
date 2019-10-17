
import {
    View,
    Text,
    Image,
    Button,

} from 'react-native'

import React, { Component } from 'react';
import Host from 'miot/Host'
export default class DelayOffLamp extends Component {


    render() {
        return (
            <View style={{ flex: 1, backgroundColor: 'orange' }}>
                <Button title='按钮' onPress={() => {
                    Host.ui.openCountDownPage(true, { onMethod: "power_on", offMethod: 'power_off', onParam: 'on', offParam: 'off' })
                }} ></Button>
            </View>
        )
    }
}