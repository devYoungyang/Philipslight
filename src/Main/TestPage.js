
import {
    View,
    Text,
    image,

} from 'react-native'
import React, { Component } from 'react'
import Svg, { Path } from 'react-native-svg';

export default class TestPage extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (<View style={{ flex: 1, alignItems: "center", justifyContent: "center" }} >
            <Svg width="300" height="300" >
                <Path stroke="red" d="M0 0L80 150L300 0" fill="transparent" />
            </Svg>
        </View>)
    }
}
