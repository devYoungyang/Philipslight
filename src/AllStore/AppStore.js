import { Package, Device, Host, Service } from 'miot';
import { observable } from 'mobx';
import { DeviceEventEmitter } from 'react-native'
import NavigationBar from "miot/ui/NavigationBar";

const AppStore = observable({
  counter: 0,
  lampOn: false,
  isCollected: false,
  isShowChangedBright: false,
  statusBarType: NavigationBar.TYPE.DARK,
  isClickedLongPress: false,
  bright: 1,
  collectedSecenes: [],
  allSelectedData: [],
  longPressIndex: 0,
  currentSeceneId: '0xfff',
  dv: 0,
  statusBarHide: false,
  selectedScenes: 0,
  delayTime: 0,
  pageIdex: 1,
  warnSwitch: false,
  snm: 0,
  isLoop: true,
  // currentSelectItem: [],
});
// AppStore.setCurrentSelectItem = (items) => {
//     AppStore.currentSelectItem = items;
// }


AppStore.changedLoopStatus = (isLoop) => {
  if (isLoop == true) {
    setTimeout(() => {
      AppStore.isLoop = isLoop;
    }, 2000)
  } else {
    AppStore.isLoop = isLoop;
  }

}

AppStore.changeSnm = (snm) => {
  AppStore.snm = snm;
}
AppStore.changeWarnSwitch = (isOn) => {
  AppStore.warnSwitch = isOn;
}
AppStore.setCurrentPageIdx = (index) => {
  AppStore.pageIdex = index;
}
AppStore.setDelayTime = (time) => {
  AppStore.delayTime = time;
}
AppStore.updateSelectedScenes = (scenes) => {
  AppStore.selectedScenes = scenes;
}
AppStore.changedDv = (dv) => {
  AppStore.dv = dv;
}
AppStore.setStatusBarHide = (hide) => {
  AppStore.statusBarHide = hide;
}

AppStore.getInfoFromCloud = () => {
  let props = ['power', 'bright', 'snm'];
  var info = {};
  Device.getDeviceWifi().callMethod('get_props', props).then(res => {
    res.result.map((item, index) => {
      info[props[index]] = item;
    });
    // alert(`---+++---${JSON.stringify(info)}---++---`);
    // alert(info.power == 'on' ? true : false)
    AppStore.changedLampStatus(info.power == 'on' ? true : false);
    info.power == 'on' ? DeviceEventEmitter.emit('LampIsOn', { isOn: '1' }) : ''
    AppStore.adjustBright(info.bright);
  });
};
AppStore.stopLoop = () => {
  this.interval && clearInterval(this.interval);
  setTimeout(() => {
    AppStore.getInfoFromCloud();
  }, 2000)
}
AppStore.setCurrentSeceneID = id => {

  AppStore.currentSeceneId = id;
};
AppStore.setLongPressIndex = index => {
  AppStore.longPressIndex = index;
};
AppStore.getAllSelectedData = (idx, value) => {
  AppStore.collectedSecenes[idx].select == value;
};
AppStore.adjustBright = value => {
  AppStore.bright = Math.round(value) < 1 ? 1 : Math.round(value);
  // if (AppStore.lampOn) {
  //   Device.getDeviceWifi()
  //     .callMethod('set_bright', [AppStore.bright])
  //     .then(res => {
  //       //   console.log ('~~~' + JSON.stringify (res) + '~~~~');
  //     });
  // }

};
AppStore.deleteSelectSecenes = data => {
  AppStore.collectedSecenes = data;
};

AppStore.getAllCollectedSecenes = () => {
  Service.smarthome.getUserColl({ did: Device.deviceID }).then(res => {
    res.map((item, index) => {
      item.select = '0';
    });
    // alert('>>>>>>>' + JSON.stringify(res) + '<<<<<');
    AppStore.collectedSecenes = res;
  }).catch((err) => {
    // alert(JSON.stringify(err))
  });
};

AppStore.clickedLongPress = isLongPress => {
  AppStore.isClickedLongPress = isLongPress;
};

AppStore.setStatusBarType = type => {
  AppStore.statusBarType = type == 'light' ? NavigationBar.TYPE.DARK : NavigationBar.TYPE.LIGHT;
};

AppStore.changedCollectStatus = isCollect => {
  AppStore.isCollected = isCollect;
};

AppStore.changedLampStatus = isOn => {
  AppStore.lampOn = isOn;
};

AppStore.plus = () => {
  AppStore.counter++;
};

AppStore.minus = () => {
  AppStore.counter--;
};
AppStore.changedBrightPageStatus = isShow => {
  AppStore.isShowChangedBright = isShow;
};

export default AppStore;
