

import {
    View,
    TouchableWithoutFeedback,

} from 'react-native'
import React, { Component } from 'react'
import Modal from 'react-native-modal'
import PropTypes from 'prop-types';
export default class MessageDialog extends Component {

    static propTypes = {
        visible: PropTypes.bool,

    }
    static defaultProps = {

    }
    constructor(props) {
        super(props);
        this.state = {
            visible: this.props.visible
        }
    }
    componentWillReceiveProps(newProps) {
        if (newProps.visible !== this.state.visible) {
            this.setState({ visible: newProps.visible });
        }
    }
    render() {
        return (
            <Modal
                isVisible={this.state.visible}
                style={{ margin: 0 }}
                animationIn={'fadeIn'}
                animationOut={'fadeOut'}
                animationOutTiming={500}
                backdropColor={'rgba(0,0,0,0.5)'}
            >
                <TouchableWithoutFeedback style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}
                    onPress={() => {
                        this.setState({
                            visible: false
                        })
                    }}
                >
                    <View style={{ flex: 1, }} >

                    </View>
                </TouchableWithoutFeedback>

            </Modal>)
    }
}