
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    TouchableHighlight,
    Button,
    ScrollView,
    Image,
    StatusBar
} from 'react-native';
import React, { Component } from 'react';
var window = Dimensions.get('window');
var ratio = Math.max(window.width / 375, 1);

import res, { Language } from "miot/resources"
import { localStrings, getString } from '../Common/LocalizableString';
const width = Dimensions.get('screen').width;
import { TitleBar, ImageButton, LocalizedStrings, } from 'miot/ui';
import { CommonSetting, SETTING_KEYS } from "miot/ui/CommonSetting";
import { strings, Styles, Images } from 'miot/resources';
import { NavigationActions } from 'react-navigation';
import AppStore from '../AllStore/AppStore';
import NavigationBar from 'miot/ui/NavigationBar';
import { observer } from 'mobx-react'
class SettingPage extends Component {
    componentDidMount() {
        AppStore.setCurrentPageIdx(2);
    }
    static navigationOptions = (({ navigation }) => {
        return {
            header: <NavigationBar
                backgroundColor='#fff'
                type={AppStore.statusBarType}
                title={localStrings.settings}
                left={[
                    {
                        key: NavigationBar.ICON.BACK,
                        onPress: () => {
                            AppStore.setStatusBarType('light');
                            navigation.goBack();
                        }
                    }
                ]}
            />
        }
    })

    render() {
        let licenseURL;
        let policyURL;
        switch (localStrings.getLanguage()) {
            case "en":
                licenseURL = require("../../resources/web/license.html");
                policyURL = require("../../resources/web/policy.html");
                break;
            case "zh":
                licenseURL = require("../../resources/web/license.html");
                policyURL = require("../../resources/web/policy.html");
                break;
            case "zh-hk":
                licenseURL = require("../../resources/web/license-zh-Hant.html");
                policyURL = require("../../resources/web/policy-zh-Hant.html");
                break;
            case "zh-tw":
                licenseURL = require("../../resources/web/license-zh-Hant.html");
                policyURL = require("../../resources/web/policy-zh-Hant.html");
                break;
            default:
                licenseURL = require("../../resources/web/license.html");
                policyURL = require("../../resources/web/policy.html");
                break;
        }
        const { first_options, second_options } = SETTING_KEYS;
        // 显示部分一级菜单项
        const firstOptions = [
            first_options.SHARE,
            first_options.IFTTT,
            first_options.FIRMWARE_UPGRADE,
        ]
        // 显示部分二级菜单项
        const secondOptions = [
            // second_options.AUTO_UPGRADE,                                         
            // second_options.TIMEZONE,
        ]
        // 显示固件升级二级菜单
        const extraOptions = {
            showUpgrade: true,
            // upgradePageKey: 'FirmwareUpgrade',
            licenseUrl: licenseURL,
            policyUrl: policyURL,
        }
        const showDot = [
            first_options.FIRMWARE_UPGRADE,
        ]
        return (
            <View style={{ flex: 1, backgroundColor: 'white', }} >
                <View style={{ height: 0.5, backgroundColor: "rgba(1,1,1,0.1)" }} />
                <ScrollView style={{ flex: 1, backgroundColor: 'white', }}>
                    <Text style={{ marginLeft: 20, marginTop: 10, height: 20, fontSize: 11, color: 'rgba(0,0,0,0.5)', lineHeight: 14 }} >{localStrings.featureSetting}</Text>
                    <View style={styles.separator} />
                    <TouchableHighlight underlayColor='#f1f1f1' onPress={() => {
                        this.props.navigation.navigate('LampSettings');
                    }}>
                        <View>
                            <View style={styles.rowContainer}>
                                <Text style={styles.title}>{localStrings.stripSetting}</Text>
                                <Image style={styles.subArrow} source={Images.common.right_arrow} />
                            </View>
                            <View style={styles.separator}></View>
                        </View>
                    </TouchableHighlight>
                    <CommonSetting
                        navigation={this.props.navigation}
                        firstOptions={firstOptions}
                        // secondOptions={secondOptions}
                        showDot={showDot}
                        extraOptions={extraOptions}
                    />
                </ScrollView>
            </View>
        );
    }
}
const Setting = observer(SettingPage);
export default Setting;

var styles = StyleSheet.create({
    container: {
        backgroundColor: '#ffffff',
    },

    listContainer: {
        flexDirection: 'row',
        backgroundColor: '#ffffff',
        height: window.height - 65
    },

    rowContainer: {
        alignSelf: 'stretch',
        flexDirection: 'row',
        flex: 1,
        paddingLeft: 20,
        paddingTop: 12,
        paddingBottom: 12,
        paddingRight: 15,
    },
    title: {
        fontSize: 15,
        alignItems: 'center',
        color: '#000000',
        flex: 1,
        // fontFamily: 'D-DIN'
    },
    subArrow: {
        width: 24,
        height: 24,
        backgroundColor: 'transparent',
        marginRight: 10
    },
    separator: {
        height: 0.5,
        backgroundColor: '#dddddd',
        marginLeft: 20,
    },
    navigatorShadow: {
        //marginTop: 64+APPBAR_MARGINTOP,
        height: 1,
        backgroundColor: '#dddddd',
    },
});