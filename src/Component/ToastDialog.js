import {
    View,
    Text,
    StyleSheet,
    Image,
    Modal
} from 'react-native'
import PropTypes from 'prop-types';
import React, { Component } from 'react'

export default class ToastDialog extends Component {
    static propTypes = {
        message: PropTypes.string,
        visible: PropTypes.bool,
    }
    static defaultProps = {
        message: '请输入提示语',
        visible: false,
    }
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
        }
    }
    componentWillMount() {
        this.setState({
            visible: this.props.visible
        })
    }
    render() {
        return (
            <Modal
                style={{ flex: 1 }}
                animationType="fade"
                transparent={true}
                visible={this.props.visible}
            >
                <View style={{ flex: 1, backgroundColor: "transparent", alignItems: 'center', justifyContent: 'center' }}
                    onLayout={() => {
                        setTimeout(() => {

                            // this.setState({
                            //     visible: false
                            // })
                        }, 2000)
                    }}
                >
                    <View style={{ backgroundColor: "rgba(0,0,0,0.2)", alignItems: 'center', justifyContent: "center", padding: 50, borderRadius: 10 }}>
                        <Image source={require('../../resources/assets/child.png')} />
                        <Text>{this.props.message}</Text>
                    </View>
                </View>
            </Modal>
        );

    }
}