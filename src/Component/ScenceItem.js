
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    Dimensions,
    StyleSheet,
    Button,
    TouchableWithoutFeedback,
    DeviceEventEmitter,
    ImageBackground,
} from 'react-native'
import LottieView from 'lottie-react-native'
import React, { Component } from 'react'
import AppStore from '../AllStore/AppStore';
import Checkbox from 'miot/ui/Checkbox/Checkbox'
var ratio = Math.max(Dimensions.get('window').width / 375, 1);
const { width, height } = Dimensions.get('window');
import { observer } from 'mobx-react';
import CommonJS from '../Common/CommonJS'
import { localStrings } from '../Common/LocalizableString';
class ScenceItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            item: {},
        }
    }
    componentWillMount() {
        // AppStore.setCurrentSelectItem(this.props.item);
        this.setState({
            item: this.props.item
        })
        DeviceEventEmitter.addListener('RECOVER', (res) => {
            var newItem = this.state.item;
            newItem.select = '0';
            this.setState({
                item: newItem
            })
        })
    }
    render() {
        return (
            <View style={{ alignItems: 'center', width: width - 20, height: (width - 20) * 0.24, marginTop: this.props.idx == 0 ? 0 : 2 * CommonJS.ratio, }} >
                <TouchableOpacity style={{ flex: 1 }} onLongPress={() => {
                    this.props.onLongPress();
                    // AppStore.clickedLongPress(true);
                    var newItem = this.props.item;
                    newItem.select = '1';
                    this.setState({
                        item: newItem,
                    })
                    // alert(JSON.stringify(AppStore.collectedSecenes));
                }}
                    onPress={() => {
                        this.props.clickedUsed()
                        if (AppStore.isClickedLongPress) {
                            var newItem = this.props.item;
                            newItem.select = this.state.item.select == 0 ? '1' : '0';
                            newItem.select == 1 ? AppStore.updateSelectedScenes(AppStore.selectedScenes + 1) : AppStore.updateSelectedScenes(AppStore.selectedScenes - 1);
                            this.props.onSelect();
                            this.setState({
                                item: newItem,
                            })
                            // alert(JSON.stringify(AppStore.collectedSecenes));
                        }
                    }}
                >
                    <View style={{ width: width - 20, height: (width - 20) * 0.24, flexDirection: 'row', alignItems: 'center', backgroundColor: 'white' }} >
                        <View style={{ backgroundColor: this.props.color, width: 50 * CommonJS.ratio, height: 50 * CommonJS.ratio, borderRadius: 25 * CommonJS.ratio, marginLeft: 20 * ratio }} />
                        <View style={{ marginLeft: 20 * ratio, width: 0.45 * CommonJS.width, height: 40 * CommonJS.ratio, justifyContent: 'space-around' }} >
                            <Text numberOfLines={1} style={{ color: '#000000', fontSize: 15 * ratio, fontFamily: 'D-DIN', }}>{this.props.item.name}</Text>
                            <Text style={{ color: '#666666', fontSize: 12 * ratio, fontFamily: 'D-DIN' }}>{this.props.bright}</Text>
                        </View>
                        {
                            AppStore.isClickedLongPress ?
                                <Checkbox
                                    style={{ width: 24 * CommonJS.ratio, height: 24 * CommonJS.ratio, borderRadius: 12 * CommonJS.ratio, position: 'absolute', right: 18 * CommonJS.ratio }}
                                    checked={this.state.item.select == '1' ? true : false}//this.state.item.select == '1' ? true : false
                                    checkedColor='#32BAC0'
                                    onValueChange={(select) => {
                                        select ? AppStore.updateSelectedScenes(AppStore.selectedScenes + 1) : AppStore.updateSelectedScenes(AppStore.selectedScenes - 1)
                                        this.props.onSelect();
                                        var newItem = this.props.item;
                                        newItem.select = this.state.item.select == 0 ? '1' : '0';
                                        this.setState({
                                            item: newItem,
                                        })
                                        // alert(JSON.stringify(AppStore.collectedSecenes));
                                    }}
                                /> :
                                (this.props.btnTitle == localStrings.used && AppStore.lampOn == true) ?
                                    <Image style={{ position: 'absolute', right: 10 * CommonJS.ratio, width: 60 * CommonJS.ratio, height: 30 * CommonJS.ratio, }} source={require('../../resources/assets/selected.png')} />
                                    // <LottieView source={require('../../resources/assets/animation.json')} speed={2} loop={false} autoPlay={true} style={{ position: 'absolute', right: 2 * CommonJS.ratio, width: 50 * CommonJS.ratio, height: 30 * CommonJS.ratio, }} />
                                    :
                                    <ImageBackground style={{
                                        position: 'absolute', right: 18 * CommonJS.ratio, width: 60 * ratio, height: 30 * ratio, alignItems: 'center', justifyContent: 'center'
                                    }} onPress={() => {
                                        this.props.clickedUsed();
                                    }}
                                        resizeMode="stretch"
                                        source={require('../../resources/assets/used.png')}
                                    >
                                        <Text style={{ color: '#32BAC0', fontFamily: 'D-DIN', fontSize: 14 * ratio }}>{localStrings.use}</Text>
                                    </ImageBackground>
                            // <Image style={{ position: 'absolute', right: 18 * CommonJS.ratio, }} source={require('../../resources/assets/used.png')} />
                        }
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
}
const ScenceItemPage = observer(ScenceItem);
export default ScenceItemPage;