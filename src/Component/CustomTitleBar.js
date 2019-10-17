/**
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Dimensions, Image, Platform, StatusBar, StyleSheet, Text, View } from 'react-native';
import { getStatusBarHeight } from "react-native-iphone-x-helper";
import { RkButton } from "react-native-ui-kitten";
import { SafeAreaView } from 'react-navigation';
import ImageButton from 'miot/ui/ImageButton';
const { width } = Dimensions.get('window');
const statusBarHeight = getStatusBarHeight(true);
const titleHeight = 55;
const imgHeight = 28;
const containerHeight = (StatusBar.currentHeight || 0) + titleHeight;
const marginV = (titleHeight - imgHeight) / 2;
const marginH = 14;
const dotSize = 10;
export default class CustomTitleBar extends Component {
    static propTypes = {
        type: PropTypes.oneOf(['dark', 'light']),
    }
    static defaultProps = {
        type: 'light',
    }
    constructor(props) {
        super(props);
    }
    componentWillMount() {
        this.isDarkStyle = this.props.type === 'dark';
        if (Platform.OS == 'android') {
            StatusBar.setTranslucent(true);
        }
    }
    render() {
        this.isDarkStyle = this.props.type === 'dark';
        this.isDarkStyle ? StatusBar.setBarStyle('dark-content') : StatusBar.setBarStyle('light-content');
        const containerStyle = this.isDarkStyle ? styles.blackTitleBarContainer : styles.lightTitleBarContainer;
        let leftWidth = this.props.leftTextStyle ? this.props.leftTextStyle.width : 0;
        let rightWidth = this.props.rightTextStyle ? this.props.rightTextStyle.width : 0;
        let titleTextStyle = this.isDarkStyle ? styles.blackTitleText : styles.whiteTitleText;
        let subtitleTextStyle = this.isDarkStyle ? styles.blackSubtitleText : styles.whiteSubtitleText;
        let leftRightTextStyle = this.isDarkStyle ? styles.blackLeftRightText : styles.whiteLeftRightText;
        const back_n = this.isDarkStyle ? require('../../resources/title/std_tittlebar_main_device_back_normal.png') : require("../../resources/title/std_tittlebar_main_device_back_white_normal.png");
        const back_p = this.isDarkStyle ? require('../../resources/title/std_tittlebar_main_device_back_press.png') : require("../../resources/title/std_tittlebar_main_device_back_white_press.png")
        const set_n = this.isDarkStyle ? require('../../resources/title/std_tittlebar_main_device_back2_normal.png') : require("../../resources/title/std_titlebar_setting_back_normal.png")
        const set_p = this.isDarkStyle ? require('../../resources/title/std_tittlebar_main_device_back2_press.png') : require("../../resources/title/std_titlebar__setting_back_press.png")
        const share_n = this.isDarkStyle ? require('../../resources/assets/sc.png') : require("../../resources/assets/sc.png")
        const share_p = this.isDarkStyle ? require('../../resources/assets/sc.png') : require("../../resources/assets/sc.png")
        const more_n = this.isDarkStyle ? require('../../resources/title/std_tittlebar_main_device_more_normal.png') : require("../../resources/title/std_tittlebar_main_device_more_white_normal.png")
        const more_p = this.isDarkStyle ? require('../../resources/title/std_tittlebar_main_device_more_press.png') : require("../../resources/title/std_tittlebar_main_device_more_white_press.png")
        const message = this.isDarkStyle ? require('../../resources/title/std_tittlebar_main_device_massage_point.png') : require("../../resources/title/std_tittlebar_main_device_massage_point.png")
        // 为了保持两端统一，传参的 height 只定义除 StatusBar 外的部分，即覆盖 titleHeight
        const { height } = this.props.style || {};
        let containerHeight = {};
        let dotTop = {}; // 小红点偏移位置
        if (height !== undefined) {
            containerHeight = { height: (StatusBar.currentHeight || 0) + height };
            offset = height - titleHeight;
            dotTop = { top: statusBarHeight + marginV + offset };
        }
        return (
            <SafeAreaView style={[containerStyle, this.props.style, containerHeight]}>
                {this.props.leftText
                    ? <RkButton onPress={this.props.onPressLeft}
                        contentStyle={[leftRightTextStyle, this.props.leftTextStyle]}
                        style={[leftRightTextStyle, {
                            height: this.props.onPressLeft ? titleHeight : 0,
                            width: leftWidth ? leftWidth : imgHeight + marginH * 2
                        }]}>{this.props.leftText}</RkButton>
                    : <ImageButton onPress={this.props.onPressLeft}
                        style={[styles.img, { height: this.props.onPressLeft ? imgHeight : 0 }]}
                        source={back_n}
                        highlightedSource={back_p} />
                }
                <ImageButton onPress={this.props.onPressLeft2}
                    style={[styles.img, {
                        marginLeft: 0,
                        height: this.props.onPressLeft2 ? imgHeight : 0,
                    }]}
                    source={set_n}
                    highlightedSource={set_p} />
                <View style={[styles.textContainer]}>
                    <Text
                        numberOfLines={1}
                        style={[titleTextStyle]}
                        onPress={this.props.onPressTitle}>
                        {this.props.title}
                    </Text>
                    {this.props.subTitle
                        ? <Text
                            numberOfLines={1}
                            style={[subtitleTextStyle]}
                            onPress={this.props.onPressTitle}
                        >
                            {this.props.subTitle}
                        </Text>
                        : null
                    }
                </View>
                <ImageButton onPress={this.props.onPressRight2}
                    style={[styles.img, {
                        marginRight: 0,
                        height: this.props.onPressRight2 && this.props.hide ? imgHeight : 0,
                    }]}
                    source={share_n}
                    highlightedSource={share_p} />
                {this.props.rightText
                    ? <RkButton onPress={this.props.onPressRight}
                        contentStyle={[leftRightTextStyle, this.props.rightTextStyle]}
                        style={[leftRightTextStyle, {
                            height: this.props.onPressRight ? titleHeight : 0,
                            width: rightWidth ? rightWidth : imgHeight + marginH * 2
                        }]}>{this.props.rightText}</RkButton>
                    : <ImageButton onPress={this.props.onPressRight}
                        style={[styles.img, { height: this.props.onPressRight ? imgHeight : 0 }]}
                        source={more_n}
                        highlightedSource={more_p} />
                }
                {
                    this.props.showDot &&
                    <Image
                        style={[styles.dot, dotTop]}
                        resizeMode='contain'
                        source={message}
                    />
                }
            </SafeAreaView>
        );
    }
}
const styles = StyleSheet.create({
    lightTitleBarContainer: {
        flexDirection: 'row',
        width: width,
        alignItems: 'flex-end',
        height: containerHeight,
        backgroundColor: "black"
    },
    blackTitleBarContainer: {
        flexDirection: 'row',
        width: width,
        alignItems: 'flex-end',
        height: containerHeight,
        backgroundColor: "white"
    },
    textContainer: {
        height: titleHeight,
        flex: 1,
        alignItems: 'stretch',
        justifyContent: 'center',
    },
    blackTitleText: {
        color: '#000000cc',
        fontSize: 15,
        textAlignVertical: 'center',
        textAlign: 'center',
    },
    whiteTitleText: {
        color: "#ffffffcc",
        fontSize: 15,
        textAlignVertical: "center",
        textAlign: "center"
    },
    blackSubtitleText: {
        color: '#00000088',
        marginTop: 5,
        fontSize: 12,
        textAlignVertical: 'center',
        textAlign: 'center',
    },
    whiteSubtitleText: {
        marginTop: 5,
        color: "#ffffff88",
        fontSize: 12,
        textAlignVertical: "center",
        textAlign: "center"
    },
    blackLeftRightText: {
        backgroundColor: '#0000',
        color: '#00000088',
        fontSize: 14,
        alignItems: 'center',
        justifyContent: 'center',
        textAlignVertical: "center",
        textAlign: "center"
    },
    whiteLeftRightText: {
        backgroundColor: '#0000',
        color: '#ffffff88',
        fontSize: 14,
        alignItems: 'center',
        justifyContent: 'center',
        textAlignVertical: "center",
        textAlign: "center"
    },
    img: {
        width: imgHeight,
        height: imgHeight,
        resizeMode: 'contain',
        marginHorizontal: marginH,
        marginVertical: marginV,
    },
    dot: {
        position: 'absolute',
        width: dotSize,
        height: dotSize,
        resizeMode: 'contain',
        right: marginH,
        top: statusBarHeight + marginV,
    },
});**/