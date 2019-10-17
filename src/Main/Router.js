import { createStackNavigator } from 'react-navigation';
import HomePage from './HomePage';
import StorePage from './StorePage';
import ChangedBrightPage from './ChangedBrightPage';
import SceneModelPage from './SceneModelPage';
import DelayOffLampPage from './DelayOffLamp';
import SettingPage from './SettingPage';
import MoreSetting from 'miot/ui/CommonSetting/MoreSetting';
import FirmwareUpgrade from 'miot/ui/CommonSetting/FirmwareUpgrade';
import CircleCountDownView from './CircleCountDownView';
import LampSettings from './LampSettingsPage'
import Test from './TestPage'
// import { fadeIn, fromRight, zoomIn, flipY } from 'react-navigation-transitions'
const App = createStackNavigator(
  {
    Home: HomePage,
    Store: StorePage,
    ChangedBright: ChangedBrightPage,
    SceneModel: SceneModelPage,
    DelayOffLamp: DelayOffLampPage,
    Setting: SettingPage,
    MoreSetting,
    FirmwareUpgrade,
    CircleCountDownView,
    LampSettings,
    Test,
  },
  {
    initialRouteName: 'Home',
    // transitionConfig: () => zoomIn(500),
  }
);
export default App;
