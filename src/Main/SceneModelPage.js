
import React, { Component } from 'react'
import {
    View,
    Text,
    StyleSheet,
    Button,
    Dimensions,
    ScrollView,
    Image,
    StatusBar,
    Modal,
    TouchableOpacity,
    SafeAreaView,
    DeviceEventEmitter,
    LayoutAnimation,
    FlatList
} from 'react-native'
import NavigationBar from "miot/ui/NavigationBar";
import { MessageDialog } from 'miot/ui/Dialog'
import { Package, Service, Device, Host } from 'miot'
import CustomTitleBar from '../Component/CustomTitleBar';
import Card from '../Component/Card';
// import Card from 'miot/ui/Card'
import AppStore from '../AllStore/AppStore';
import ScenceItem from '../Component/ScenceItem';
var ratio = Math.max(Dimensions.get('window').width / 375, 1);
import { observer } from 'mobx-react'
import { localStrings } from '../Common/LocalizableString';
const { width, height } = Dimensions.get('screen');
import CommonJS from '../Common/CommonJS'
import { Language } from 'miot/resources';

var navigation_current;
class SceneModel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isShow: false,
            // currentSeceneId: 1000,
            justifyContent: 'flex-start',
            rights: [],
            title: localStrings.getLanguage() == 'en' ? localStrings.sceneStr + ' ' + localStrings.model : localStrings.sceneStr + localStrings.model,
        }

    }
    static navigationOptions = (({ navigation }) => {
        navigation_current = navigation;
        return {
            header: null
        }
    })
    setCurrentBright() {
        AppStore.lampOn ? '' : AppStore.changedLampStatus(true);
        DeviceEventEmitter.emit('LampIsOn', { isOn: '1' });
        Device.getDeviceWifi().callMethod('set_bright', [AppStore.bright]).then(res => {
            //   console.log ('~~~' + JSON.stringify (res) + '~~~~');
        });
    }
    setCurrentSnm() {
        AppStore.lampOn ? '' : AppStore.changedLampStatus(true);
        DeviceEventEmitter.emit('LampIsOn', { isOn: '1' });
        Device.getDeviceWifi().callMethod('apply_fixed_scene', [AppStore.snm]).then(res => {
            // alert(JSON.stringify(res));
        }).catch((err) => {
            // alert(JSON.stringify(err))
        })
    }
    InitInnerView(title, img, snm, wid) {
        return (
            <View style={{ width: wid, height: wid * 0.64, }} >
                <View style={{ width: wid, height: wid * 0.64, alignItems: 'center', justifyContent: "center" }} >
                    <Image source={img} style={{ width: 40 * ratio, height: 40 * ratio }} />
                    <Text style={{ fontSize: 14 * CommonJS.ratio, color: 'white', marginTop: 0, fontFamily: 'D-DIN' }} >{title}</Text>
                </View>
                {
                    AppStore.snm == snm && AppStore.lampOn ? <Image style={{ position: 'absolute', right: 0, bottom: 0 }} source={require('../../resources/assets/selected1.png')} /> : null
                }
            </View>)
    }
    componentWillMount() {
        // AppStore.setCurrentSelectItem(AppStore.collectedSecenes);
        AppStore.setCurrentPageIdx(2);
    }
    componentDidMount() {
        // LayoutAnimation.spring();
    }
    onSelect() {
        this.setState({
            title: localStrings.getLanguage() == 'en' ? localStrings.selected + ' ' + AppStore.selectedScenes + ' ' + localStrings.item : localStrings.selected + AppStore.selectedScenes + localStrings.item
        })
    }
    render() {
        return (<View style={{ flex: 1 }}>
            <MessageDialog
                title={localStrings.warStr}
                message={localStrings.deleteTipStr}
                visible={this.state.isShow}
                onDismiss={() => {
                    this.setState({
                        isShow: false
                    })
                }}
                buttons={[
                    {
                        text: localStrings.cancelStr,
                        callback: () => {
                            this.setState({
                                isShow: false
                            })
                        }
                    },
                    {
                        text: localStrings.conformStr,
                        callback: () => {
                            // alert(JSON.stringify(AppStore.collectedSecenes));
                            AppStore.collectedSecenes.map((item, index) => {
                                item.select == '1' ? Service.smarthome.delUserColl({ 'did': item.did, 'coll_id': item.coll_id }).then((res) => {
                                    // alert('==删除自定义场景===' + JSON.stringify(res) + '=====')
                                    AppStore.getAllCollectedSecenes();
                                    DeviceEventEmitter.emit('RECOVER');
                                }).catch((err) => { }) : ''
                            })
                            AppStore.updateSelectedScenes(0);
                            AppStore.clickedLongPress(false);
                            AppStore.changedLoopStatus(true);
                            this.setState({
                                isShow: false,
                                title: localStrings.getLanguage() == 'en' ? localStrings.sceneStr + ' ' + localStrings.model : localStrings.sceneStr + localStrings.model,
                                rights: []
                            })
                        }
                    }
                ]}
            />
            <SafeAreaView style={{ backgroundColor: '#fff', justifyContent: 'space-between', flex: 1 }}>
                <NavigationBar
                    title={this.state.title}
                    type={AppStore.statusBarType}
                    backgroundColor='#fff'
                    left={[
                        {
                            key: NavigationBar.ICON.BACK,
                            onPress: () => {
                                AppStore.changedLoopStatus(true);
                                navigation_current.goBack();
                                AppStore.setStatusBarType('light')
                                AppStore.clickedLongPress(false);
                                AppStore.collectedSecenes.map((item, index) => {
                                    item.select = '0'
                                })
                            }
                        }
                    ]}
                    right={this.state.rights}
                />
                <ScrollView style={{ backgroundColor: '#F7F7F7', }} >
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: 10 * ratio, backgroundColor: "F7F7F7" }} >
                        {
                            CommonJS.getSceneDatas().map((item, index) => {
                                return <Card innerView={this.InitInnerView(item.name, item.img, item.snm, (width - 30 * ratio) / 2)}
                                    onPress={() => {
                                        AppStore.changedLoopStatus(false);
                                        AppStore.changedLoopStatus(true)
                                        AppStore.adjustBright(item.content.bright);
                                        AppStore.changeSnm(item.snm);
                                        this.setCurrentSnm();
                                    }}
                                    underlayColor='transparent'
                                    cardStyle={[{
                                        width: (width - 30 * ratio) / 2, height: (width - 30 * ratio) / 2 * 0.64, borderRadius: 8, backgroundColor: item.color, marginTop: 10 * ratio, marginBottom: 2,
                                    }]} />
                            })
                        }
                    </View>
                    {
                        AppStore.collectedSecenes && AppStore.collectedSecenes.length != 0 ? <View style={{ marginTop: 10 * ratio, borderRadius: 10, backgroundColor: '#F7F7F7', width: width - 20 * ratio, alignSelf: 'center' }}>
                            <Text style={{ fontSize: 11 * ratio, color: '#7f7f7f', marginLeft: 10, marginTop: 10, fontFamily: 'D-DIN' }}>{localStrings.getLanguage() == 'en' ? localStrings.savedStr + ' ' + localStrings.sceneStr : localStrings.savedStr + localStrings.sceneStr}</Text>
                            <View style={{ alignItems: 'center', marginTop: 10 * CommonJS.ratio, borderRadius: 10 * CommonJS.ratio, backgroundColor: '#fff', padding: 10 * CommonJS.ratio }}>
                                <View style={{ alignItems: "center", backgroundColor: "#F7F7F7" }} >
                                    {
                                        AppStore.collectedSecenes.map((item, index) => {
                                            return <ScenceItem item={item}
                                                idx={index}
                                                color={item.content.color}
                                                coll_id={item.coll_id}
                                                btnTitle={AppStore.bright == item.content.bright ? localStrings.used : localStrings.use}
                                                bright={localStrings.getLanguage() == 'en' ? localStrings.lumStr + ' ' + item.content.bright + '%' : localStrings.lumStr + item.content.bright + '%'}
                                                onSelect={this.onSelect.bind(this)}
                                                onLongPress={() => {
                                                    this.setState({
                                                        rights: [{
                                                            key: NavigationBar.ICON.COMPLETE,
                                                            onPress: () => {
                                                                AppStore.clickedLongPress(false);
                                                                DeviceEventEmitter.emit('Start')
                                                                AppStore.changedLoopStatus(true);
                                                                DeviceEventEmitter.emit('RECOVER');
                                                                this.setState({
                                                                    rights: [],
                                                                    isShow: false,
                                                                    title: localStrings.getLanguage() == 'en' ? localStrings.sceneStr + ' ' + localStrings.model : localStrings.sceneStr + localStrings.model,
                                                                })
                                                            }
                                                        }]
                                                    })
                                                    AppStore.changedLoopStatus(false);
                                                    DeviceEventEmitter.emit('Stop', {});
                                                    AppStore.clickedLongPress(true);
                                                    AppStore.updateSelectedScenes(1)
                                                    this.setState({
                                                        title: localStrings.getLanguage() == 'en' ? localStrings.selected + ' ' + AppStore.selectedScenes + ' ' + localStrings.item : localStrings.selected + AppStore.selectedScenes + localStrings.item
                                                    })
                                                }}
                                                clickedUsed={() => {
                                                    if (!AppStore.isClickedLongPress) {
                                                        AppStore.changedLoopStatus(false);
                                                        setTimeout(() => {
                                                            AppStore.changedLoopStatus(true);
                                                        }, 2000)
                                                        AppStore.adjustBright(item.content.bright);
                                                        this.setCurrentBright();
                                                        AppStore.changeSnm(0);
                                                    }
                                                }} />
                                        })
                                    }
                                </View>
                            </View>
                        </View> : <View style={{ marginTop: 20, marginLeft: 15, marginRight: 15, height: (width - 30) * 0.8 * ratio, backgroundColor: '#F7F7F7', justifyContent: 'center', alignItems: 'center', borderRadius: 10 * CommonJS.ratio }} >
                                <View style={{ alignItems: 'center' }} >
                                    <Image source={require('../../resources/assets/customScenes.png')} style={{ width: 80, height: 80, }} />
                                    <Text style={{ color: '#7f7f7f', marginTop: 20 * ratio, fontFamily: 'D-DIN', fontSize: 10 * ratio }} >{localStrings.addScenes}</Text>
                                    <Text style={{ color: '#7f7f7f', marginTop: 1, fontFamily: 'D-DIN', fontSize: 10 * ratio }} >{localStrings.wantscenes}</Text>
                                </View>
                                <Text style={{ position: 'absolute', left: 15, top: 10, color: '#7F7F7F', fontFamily: 'D-DIN', fontSize: 11 * ratio }}>{localStrings.customScenes}</Text>
                            </View>
                    }
                </ScrollView>

                {
                    AppStore.isClickedLongPress ?
                        <View style={{ width: width, height: 70 * ratio, backgroundColor: '#F7F7F7', }}>
                            <TouchableOpacity style={{ width: width, height: 67 * ratio, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center', marginTop: 3 * ratio }} onPress={() => {
                                this.setState({
                                    isShow: true,
                                })
                            }} >
                                <Image source={require('../../resources/assets/delete.png')} style={{ width: 12.5 * ratio, height: 12.5 * ratio }} />
                                <Text style={{ marginTop: 5, fontSize: 10 * ratio, fontFamily: 'D-DIN', color: '#333333' }} >{localStrings.delete}</Text>
                            </TouchableOpacity>
                        </View> : null
                }
            </SafeAreaView >
        </View>)
    }
}

const ScenceModelPage = observer(SceneModel);
export default ScenceModelPage;