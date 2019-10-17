
'use strict';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    Button,
    Image,
    ImageBackground,
    TouchableOpacity,
    SafeAreaView,
    DeviceEventEmitter,
    Platform,
    BackHandler,
    LayoutAnimation,
    findNodeHandle,
    AsyncStorage,
} from 'react-native';
import Utils from '../Common/Utils'
import CommonJS from '../Common/CommonJS'
import { localStrings } from '../Common/LocalizableString'
import ChangedBrightPage from './ChangedBrightPage'
import Card from '../Component/Card';
// import Card from 'miot/ui/Card'
import { observer } from 'mobx-react'
import AppStore from '../AllStore/AppStore'
// import { InputDialog } from 'miot/ui/Dialog'
import { InputDialog } from 'miot/ui'
import Modal from "react-native-modal";
import { Package, Device, Host, Service, DeviceEvent } from 'miot'
import React, { Component } from 'react'
import NavigationBar from "miot/ui/NavigationBar";
// import MessageDialog from 'miot/ui/MessageDialog';
import { MessageDialog } from 'miot/ui/Dialog';
// import GuidePage from './GuidePage';
const { width, height } = Dimensions.get('screen');
var navigation_current;
var onBgImg = require('../../resources/assets/brig.jpg');
var offBgImg = require('../../resources/assets/bgoff.jpg');
const { storage } = Utils;
// import MessageAlert from '../Component/MessageDialog'
import { Toast, Theme } from 'teaset';
import { BlurView, VibrancyView } from "@react-native-community/blur";
// import { formatString } from 'miot/resources/Strings';
class HomePage extends Component {
    constructor(props) {
        super(props);
        this._didFocusSubscription = props.navigation.addListener('willFocus', payload =>
            AppStore.setStatusBarType('light')
        );
        // this.isFirst = false, //是否第一次打开
        this.delayTime = 0,      //延时时间
            this.dalayIsOn = false,     //延时开关
            this.isLoop = true;     //是否6s轮询一次
        this.loop = true;
        this.state = {
            height: 1,
            lampOn: false, //灯是否开启
            message: '',
            tipsTitle: '',
            isShowChangedBright: false,//是否显示调节亮度
            isShow: false,
            scenesIsExist: false,//场景是否存在
            collectedSuccess: false,//是否收藏成功
            rightItems: AppStore.lampOn ? [
                {
                    key: NavigationBar.ICON.COLLECT,
                    onPress: () => {
                        this.setState(pre => {
                            return { isShow: !pre.isShow }
                        })
                    }
                },
                {
                    key: NavigationBar.ICON.MORE,
                    onPress: () => {
                        AppStore.setStatusBarType('dark');
                        navigation_current.navigate('Setting', { 'title': localStrings.setting });
                    }
                }] : [{
                    key: NavigationBar.ICON.MORE,
                    onPress: () => {
                        AppStore.setStatusBarType('dark');
                        navigation_current.navigate('Setting', { 'title': localStrings.setting });
                    }
                }],
        }
    }
    static navigationOptions = (({ navigation }) => {
        navigation_current = navigation;
        return {
            header: null
        };
    })
    InitInnerView(title, img, time) {
        return (<View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginLeft: 10 * CommonJS.unitWidth, marginRight: 18 * CommonJS.unitWidth }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }} >
                <Image style={{ width: 40 * CommonJS.unitWidth, height: 40 * CommonJS.unitWidth, marginLeft: 10 * CommonJS.unitWidth }} source={img} />
                <Text style={{ marginLeft: 15 * CommonJS.unitWidth, color: '#000000', fontFamily: 'D-DIN', fontSize: 15 * CommonJS.unitWidth }} >{title}</Text>
            </View>
            {time && time != '00:00:00' && AppStore.lampOn ? <Text style={{ position: 'absolute', right: 30 * CommonJS.unitWidth, fontSize: 16 * CommonJS.unitWidth, fontFamily: 'D-DIN', color: '#333333' }} >{time}</Text> : null}
            <Image style={{ width: 12 * CommonJS.unitWidth, height: 20 * CommonJS.unitHeight }} source={require('../../resources/assets/next.png')} />
        </View >);
    }
    componentWillMount() {
        // alert('window' + '=' + Dimensions.get('window').height + ' --- ' + 'screen' + '=' + Dimensions.get('screen').height)
        console.disableYellowBox = true;
        this.readCacheInfo();//读取缓存
        this.getInfoFromCloud();//打开请求一次数据
        AppStore.getAllCollectedSecenes();//获取收藏的场景
        this.startLoop();//开启6秒轮询
        this._deviceNameChangedListener = DeviceEvent.deviceNameChanged.addListener((device) => {
            this.props.navigation.setParams({
                name: device.name
            });
            this.forceUpdate();//监听设备名称是否修改
        });
        setInterval(() => {
            if (AppStore.delayTime > 0) {
                AppStore.setDelayTime(AppStore.delayTime - 1);
            }
        }, 1000)
        AsyncStorage.getItem('firstStart').then((res) => {
            if (res !== '1') {
                let licenseURL;
                let policyURL;
                switch (localStrings.getLanguage()) {
                    case "en":
                        licenseURL = require("../../resources/web/license-en.html");
                        policyURL = require("../../resources/web/policy-en.html");
                        break;
                    case "zh":
                        licenseURL = require("../../resources/web/license.html");
                        policyURL = require("../../resources/web/policy.html");
                        break;
                    default:
                        licenseURL = require("../../resources/web/license.html");
                        policyURL = require("../../resources/web/policy.html");
                        break;
                }
                Host.ui.openPrivacyLicense(localStrings.licenseTitle, licenseURL, localStrings.privacyTitle, policyURL).then((res) => {
                    AsyncStorage.setItem('firstStart', '1');
                })
            }
        })
        if (Platform.OS === 'android') {
            BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid.bind(this));
        }
    }
    componentDidMount() {
        // alert(CommonJS.width + '+++' + CommonJS.height)
        // LayoutAnimation.spring();
        // alert(JSON.stringify(Host.systemInfo.mobileModel));
        AppStore.setCurrentPageIdx(1);
        this.addListener = DeviceEventEmitter.addListener('Stop', () => {
            this.loop = false;
        })
        this.addListener = DeviceEventEmitter.addListener('Start', () => {
            this.loop = true;
        })
    }
    componentWillUnmount() {
        // storage.saveItem({ isFirst: this.isFirst });
        this.saveCacheInfo();
        this._didFocusSubscription.removeEventListener;
        if (Platform.OS === 'android') {
            BackHandler.removeEventListener('hardwareBackPress', this.onBackAndroid);
        }
    }
    getInfoFromCloud() {
        let props = ['power', 'bright', 'snm', 'dv', 'notifystatus'];
        var info = {};
        Device.getDeviceWifi().callMethod('get_props', props).then(res => {
            res.result.map((item, index) => {
                info[props[index]] = item;
            });
            AppStore.changedLampStatus(info.power == 'on' ? true : false);
            if (info.power == 'on') {
                this.delayTime = info.dv;
            }
            this.showCollectedBtn();
            AppStore.changeSnm(info.snm);
            AppStore.changeWarnSwitch(info.notifystatus == 'on' ? true : false)
            AppStore.setDelayTime(info.dv);//延时
            AppStore.lampOn ? DeviceEventEmitter.emit('DelayOffTime', { 'time': info.dv }) : ''
            AppStore.adjustBright(info.bright);
        });
    }
    onBackAndroid() {
        // this.saveCacheInfo();
        // alert('HAHAGA')
        switch (AppStore.pageIdex) {
            case 1:
                Package.exit();
                break;
            case 2:
                AppStore.setStatusBarType('light');
                break;
            default:
                break;
        }
        //  
    }
    readCacheInfo() {
        let keys = ['lastBright', 'isFirst', 'isLampOn', 'lastDelayTime', 'lastSnm']
        storage.getItem(keys).then((res) => {
            // alert(JSON.stringify(res));
            AppStore.changedLampStatus(res.isLampOn);
            AppStore.adjustBright(res.lastBright);
            this.delayTime = res.lastDelayTime;
            // this.isFirst = res.isFirst;
        });
    }
    saveCacheInfo() {
        let info = {
            lastBright: AppStore.bright,
            // isFirst: false,
            isLampOn: AppStore.lampOn,
            lastDelayTime: this.delayTime,
            lastSnm: 1
        }
        storage.saveItem(info);
    }
    showCollectedBtn() {
        AppStore.lampOn ? this.setState({
            rightItems: [
                {
                    key: NavigationBar.ICON.COLLECT,
                    onPress: () => {
                        this.judgeWhetherCollect();
                    }
                },
                {
                    key: NavigationBar.ICON.MORE,
                    onPress: () => {
                        AppStore.setStatusBarType('dark');
                        navigation_current.navigate('Setting', { 'title': localStrings.setting });
                    }
                }
            ]
        }) : this.setState({
            rightItems: [
                {
                    key: NavigationBar.ICON.MORE,
                    onPress: () => {
                        AppStore.setStatusBarType('dark');
                        navigation_current.navigate('Setting', { 'title': localStrings.setting });
                    }
                }
            ]
        })
    }
    judgeWhetherCollect() {
        // alert(this.checkoutBrightIsExist())
        if (AppStore.collectedSecenes.length == 6) {
            Toast.sad(localStrings.failNameTipStr4)
            // this.setState({
            //     message: localStrings.failNameTipStr4,
            //     scenesIsExist: true
            // })
        } else if (this.checkoutBrightIsExist() == true) {
            Toast.sad(localStrings.failNameTipStr3, 'bottom')
            // this.setState({
            //     scenesIsExist: true,
            //     message: localStrings.failNameTipStr3
            // })
        } else {
            this.setState(pre => {
                return { isShow: !pre.isShow }
            })
        }
    }
    startLoop() {
        let props = ['power', 'bright', 'snm', 'dv', 'notifystatus'];
        var info = {};
        this.interval = setInterval(() => {
            if (AppStore.isLoop) {
                AppStore.getAllCollectedSecenes();//获取收藏的场景
            }

            Device.getDeviceWifi().callMethod('get_props', props).then(res => {
                res.result.map((item, index) => {
                    info[props[index]] = item;
                });
                // alert(`---+++---${JSON.stringify(info)}---++---`);
                // alert(AppStore.isLoop ? '正在轮询...' : '轮询关闭...')
                if (AppStore.isLoop) {
                    AppStore.changedLampStatus(info.power == 'on' ? true : false);
                    this.showCollectedBtn()
                    AppStore.adjustBright(info.bright);
                    if (info.power == 'on') {
                        this.delayTime = info.dv;
                    }
                    DeviceEventEmitter.emit('ChangedBright', {})
                    AppStore.changeSnm(info.snm);
                    AppStore.changeWarnSwitch(info.notifystatus == 'on' ? true : false)
                    AppStore.setDelayTime(info.dv);//延时
                    DeviceEventEmitter.emit('DelayOffTime', { 'time': info.dv })
                    // alert(AppStore.bright);
                }
            });
        }, 6000)
    }
    stopLoop() {//暂停轮询
        AppStore.changedLoopStatus(false);
        this.interval && clearInterval(this.interval);
        this.timer && clearTimeout(this.timer);
        AppStore.changedLoopStatus(true);
        this.timer = setTimeout(() => {
            this.startLoop();
        }, 2000)
    }
    checkoutBrightIsExist() {
        // alert(AppStore.snm);
        var isExist = false;
        if (AppStore.snm == 0) {
            AppStore.collectedSecenes.map((item, index) => {
                if (item.content.bright == AppStore.bright) {
                    isExist = true
                }
            })
        } else {
            CommonJS.getSceneDatas().map((item, index) => {
                if (item.snm == AppStore.snm) {
                    isExist = true;
                }
            })
        }
        return isExist;
    }
    checkScenesIsExist(title) {//检查场景是否存在
        if (title.length == 0) {
            this.setState({
                message: localStrings.nameIsNull,
                scenesIsExist: true,
            })
        }
        var allScenes = AppStore.collectedSecenes.concat(CommonJS.getSceneDatas());
        allScenes.map((item, index) => {
            if (item.name == title) {
                // this.setState({
                //     scenesIsExist: true,
                //     message: localStrings.failNameTipStr2
                // })
                Toast.sad(localStrings.failNameTipStr2)
            }
        })
        setTimeout(() => {
            this.state.scenesIsExist ? '' : Service.smarthome.setUserColl({ 'did': Device.deviceID, 'name': title, 'content': { 'bright': AppStore.bright, 'color': CommonJS.colorDependonBright(AppStore.bright) } }).then((res) => {
                // alert(res);
                if (res == 'success') {
                    // this.setState({
                    //     collectedSuccess: true,
                    //     message: localStrings.succNameTipStr
                    // })
                    Toast.success(localStrings.succNameTipStr)
                }
                AppStore.getAllCollectedSecenes();
            })
        }, 100)
    }
    setSubTitle() {
        if (AppStore.lampOn) {
            if (AppStore.snm == 0) {
                switch (AppStore.bright) {
                    case 50:
                        return localStrings.brightness;
                        break;
                    case 20:
                        return localStrings.tv;
                        break;
                    case 80:
                        return localStrings.warm;
                        break;
                    case 100:
                        return localStrings.midNight;
                        break;
                    default:
                        return localStrings.lumStr + ' ' + AppStore.bright + '%'
                        break;
                }
            } else {
                switch (AppStore.snm) {
                    case 3:
                        return localStrings.brightness;
                        break;
                    case 4:
                        return localStrings.tv;
                        break;
                    case 2:
                        return localStrings.warm;
                        break;
                    case 1:
                        return localStrings.midNight;
                        break;
                }
            }
        } else {
            return localStrings.powerOff;
        }
    }
    render() {
        return (
            <View style={{ width: CommonJS.width, height: CommonJS.height }} >
                <InputDialog
                    title={localStrings.saveNameTip}
                    message=''
                    singleLine={true}
                    cancel={localStrings.cancelStr}
                    cancelable={false}
                    timeout={0}
                    confirm={localStrings.conformStr}
                    placeholder={localStrings.sceneStr}
                    visible={this.state.isShow}
                    onCancel={() => {
                        this.setState(pre => {
                            return { isShow: !pre.isShow }
                        })
                    }}
                    onConfirm={(e) => {
                        this.checkScenesIsExist(e.text);
                        this.setState(pre => {
                            return { isShow: !pre.isShow }
                        })
                    }}
                />
                {/* <InputDialog
                    title={localStrings.saveNameTip}
                    visible={this.state.isShow}
                    placeholder={localStrings.sceneStr}
                    buttons={[
                        {
                            text: localStrings.cancelStr,
                            callback: () => {
                                this.setState(pre => {
                                    return { isShow: !pre.isShow }
                                })
                            }
                        },
                        {
                            text: localStrings.conformStr,
                            callback: res => {
                                this.checkScenesIsExist(res.textInputArray[0]);
                                this.setState(pre => {
                                    return { isShow: !pre.isShow }
                                })

                            }
                        }
                    ]}

                /> */}

                <Modal
                    ref={refModalView => {
                        this.refModalView = refModalView;
                    }}
                    style={{ margin: 0, }}
                    animationIn={'fadeIn'}
                    animationOut={'fadeOut'}
                    animationOutTiming={300}
                    animationInTiming={300}
                    backdropColor={'transparent'}
                    backdropOpacity={0.1}
                    isVisible={AppStore.isShowChangedBright}
                    onShow={() => {
                        this.setState({
                            refModalView: findNodeHandle(this.refModalView),
                        })
                    }}
                >
                    <BlurView
                        style={{ position: "absolute", top: 0, left: 0, bottom: 0, right: 0 }}
                        viewRef={this.state.refModalView}
                        blurType="dark"
                        blurAmount={Platform.OS == 'ios' ? 1 : 40}
                        downsampleFactor={1}
                    />
                    <ChangedBrightPage />
                </Modal>
                <MessageDialog
                    title={localStrings.warStr}
                    message={this.state.message}
                    messageStyle={{ textAlign: 'center' }}
                    visible={this.state.scenesIsExist}
                    onDismiss={() => {
                        this.setState({ scenesIsExist: false })
                    }}
                    buttons={[
                        {
                            text: '确定',
                            style: { color: "#32BAC0" },
                            callback: () => {
                                this.setState({ scenesIsExist: false })
                            }
                        }
                    ]}
                />
                <MessageDialog
                    title={localStrings.warStr}
                    message={localStrings.succNameTipStr}
                    visible={this.state.collectedSuccess}
                    onDismiss={() => {
                        this.setState({ collectedSuccess: false })
                    }}
                    buttons={[
                        {
                            text: '确定',
                            style: { color: "#32BAC0" },
                            callback: () => {
                                this.setState({ collectedSuccess: false })
                            }
                        }
                    ]}
                />
                <ImageBackground style={{ width: CommonJS.width, height:CommonJS.height }} source={AppStore.lampOn ? onBgImg : offBgImg} >
                    <NavigationBar
                        backgroundColor='transparent'
                        type={AppStore.statusBarType}
                        title={this.props.navigation.state["params"] && this.props.navigation.state.params.name ? this.props.navigation.state.params.name : Device.name}
                        subtitle={this.setSubTitle()}
                        left={[
                            {
                                key: NavigationBar.ICON.BACK,
                                onPress: () => {
                                    this.saveCacheInfo();
                                    Package.exit();
                                }
                            }
                        ]}
                        right={this.state.rightItems}
                    />
                    <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent', justifyContent: 'flex-end', }}>
                        <View style={styles.bottomBoxStyle} >
                            <View style={styles.container} >
                                <Card
                                    icon={AppStore.lampOn ? require('../../resources/assets/off.png') : require('../../resources/assets/off11.png')}
                                    text={AppStore.lampOn ? localStrings.lampOff : localStrings.lampOn}
                                    onPress={() => {
                                        AppStore.changedLampStatus(!AppStore.lampOn);
                                        this.stopLoop();
                                        Device.getDeviceWifi().callMethod('set_power', [AppStore.lampOn ? 'on' : 'off']).then((res) => {
                                            console.log(`====${JSON.stringify(res)}====`);
                                        }).catch((err) => {
                                            // alert(err)
                                        })
                                        AppStore.lampOn ? '' : AppStore.setDelayTime(0);
                                        // AppStore.lampOn ? '' : AppStore.setCurrentSeceneID('0xfff')
                                        this.showCollectedBtn();
                                    }}
                                    underlayColor={'white'}
                                    cardStyle={{ width: (width - 30 * CommonJS.unitWidth) / 2, height: CommonJS.width / 4, borderRadius: 10 * CommonJS.unitWidth, backgroundColor: 'white', marginBottom: 10 * CommonJS.unitWidth, marginTop: 0 }}
                                    iconStyle={styles.icon}
                                    textStyle={{ fontSize: 15 * CommonJS.unitWidth, color: AppStore.lampOn ? '#F76435' : '#000000', marginLeft: 15 * CommonJS.unitWidth, fontFamily: 'D-DIN' }}
                                />
                                <Card
                                    icon={require('../../resources/assets/tg.png')}
                                    text={localStrings.controlStr}
                                    onPress={() => {
                                        AppStore.changedBrightPageStatus(true);
                                        // this.isLoop = false;
                                        // AppStore.setStatusBarHide(true);
                                        this.setState({
                                            isShowChangedBright: true,
                                        })
                                    }}
                                    cover={!AppStore.lampOn}
                                    underlayColor={'white'}
                                    cardStyle={{ width: (width - 30 * CommonJS.unitWidth) / 2, height: CommonJS.width / 4, borderRadius: 10 * CommonJS.unitWidth, backgroundColor: 'white', marginBottom: 10 * CommonJS.unitWidth, marginTop: 0 }}
                                    iconStyle={styles.icon}
                                    textStyle={{ fontSize: 15 * CommonJS.unitWidth, color: '#000000', marginLeft: 15 * CommonJS.unitWidth, fontFamily: 'D-DIN' }}
                                />
                            </View>
                            <Card
                                innerView={this.InitInnerView(localStrings.getLanguage() == 'en' ? localStrings.sceneStr + ' ' + localStrings.model : localStrings.sceneStr + localStrings.model, require('../../resources/assets/scences.png'))}
                                onPress={() => {
                                    AppStore.setStatusBarType('dark');
                                    navigation_current.navigate('SceneModel');
                                }}
                                underlayColor={'white'}
                                cover={!AppStore.lampOn}
                                cardStyle={{ width: width - 20 * CommonJS.unitWidth, height: CommonJS.width / 4, borderRadius: 10 * CommonJS.unitWidth, backgroundColor: 'white', marginLeft: 10 * CommonJS.unitWidth, marginBottom: 10 * CommonJS.unitWidth, marginTop: 0, }}
                            />
                            <Card
                                innerView={this.InitInnerView(localStrings.delayStr, require('../../resources/assets/delayoff.png'), CommonJS.secondTransformTime(AppStore.delayTime))}
                                onPress={() => {
                                    AppStore.setStatusBarType('dark');
                                    navigation_current.navigate('CircleCountDownView', { delayOff: AppStore.lampOn ? this.delayTime : 0, });
                                }}
                                underlayColor={'white'}
                                cover={!AppStore.lampOn}
                                cardStyle={{ width: width - 20 * CommonJS.unitWidth, height: CommonJS.width / 4, borderRadius: 10 * CommonJS.unitWidth, backgroundColor: 'white', marginLeft: 10 * CommonJS.unitWidth, marginBottom: 10 * CommonJS.unitWidth, marginTop: 0, }}
                            />
                        </View>
                    </SafeAreaView >
                </ImageBackground>
            </View >
        );
    }
}
const Home = observer(HomePage);
export default Home;

var styles = StyleSheet.create({
    bottomBoxStyle: { width: '100%', flexDirection: 'column', height: CommonJS.width / 4 * 3 + 30, backgroundColor: 'transparent' },
    card: { width: width - 20 * CommonJS.unitWidth, height: 80 * CommonJS.unitHeight, borderRadius: 10 * CommonJS.unitWidth, backgroundColor: 'white', marginLeft: 10 * CommonJS.unitWidth, marginBottom: 10 * CommonJS.unitWidth, marginTop: 0, },
    icon: { width: 40 * CommonJS.unitWidth, height: 40 * CommonJS.unitWidth, marginLeft: 20 * CommonJS.unitWidth },
    card1: { width: (width - 30 * CommonJS.unitWidth) / 2, height: 80 * CommonJS.unitHeight, borderRadius: 10 * CommonJS.unitWidth, backgroundColor: 'white', marginBottom: 10 * CommonJS.unitWidth, marginTop: 0 },
    container: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', paddingLeft: 10 * CommonJS.unitWidth, paddingRight: 10 * CommonJS.unitWidth }
})