
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
} from 'react-native'
import { Package, Device } from 'miot'
import React, { Component } from 'react'
import NavigationBar from "miot/ui/NavigationBar";
import AppStore from '../AllStore/AppStore';
import { observer } from 'mobx-react';
import { localStrings } from '../Common/LocalizableString';
import Separator from 'miot/ui/Separator';
import CommonJS from '../Common/CommonJS'
import Switch from 'miot/ui/Switch';
import Button from 'teaset/components/Button/Button';
import Svg, { Path, Circle } from 'react-native-svg';

class LampSettingPage extends Component {

    static navigationOptions = (({ navigation }) => {
        return {
            header: <NavigationBar
                backgroundColor='white'
                type={AppStore.statusBarType}
                title={localStrings.stripSetting}
                left={[
                    {
                        key: NavigationBar.ICON.BACK,
                        onPress: () => {
                            navigation.goBack();
                        }
                    }
                ]}
            />,
        }
    })
    render() {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: '#fff', alignItems: 'center' }}  >
                <Separator style={{ width: CommonJS.width }} />
                <ScrollView style={{ height: 50 * CommonJS.ratio, width: CommonJS.width - 40 * CommonJS.ratio, }} >
                    <View style={{ height: 50 * CommonJS.ratio, width: CommonJS.width - 40 * CommonJS.ratio, flexDirection: 'row', alignItems: "center", justifyContent: 'space-between', }} >
                        <Text style={{ fontSize: 14, fontFamily: 'D-DIN', color: '#333333' }}  >{'提醒开关'}</Text>
                        <Switch style={{ height: 30 * CommonJS.ratio, width: CommonJS.ratio * 50 }}
                            onTintColor='#76d472'
                            tintColor='#fff'
                            value={AppStore.warnSwitch}
                            onValueChange={(isOn) => {
                                Device.getDeviceWifi().callMethod('set_notifyuser', [AppStore.warnSwitch]).then(res => {

                                })
                            }}
                        />
                    </View>
                    <Separator style={{ width: CommonJS.width }} />
                </ScrollView>
            </SafeAreaView>
        );

       
    }
}

const LampSetting = observer(LampSettingPage);
export default LampSetting;