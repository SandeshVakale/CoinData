import { createAppContainer } from 'react-navigation'
import DetailScreen from '../Containers/DetailScreen'
import { createStackNavigator } from 'react-navigation-stack'
import LaunchScreen from '../Containers/LaunchScreen'
import {Animated, Easing} from 'react-native'
import BottomTabNavigation from './BottomTabNavigaton'

import styles from './Styles/NavigationStyles'
const noTransitionConfig = () => ({
  transitionSpec: {
    duration: 0,
    timing: Animated.timing,
    easing: Easing.step0,
  },
});
// Manifest of possible screens
const InititalStack = createStackNavigator({
  DetailScreen: { screen: DetailScreen },
  LaunchScreen: { screen: LaunchScreen }
}, {
  // Default config for all screens
  headerMode: 'none',
  initialRouteName: 'LaunchScreen',
  transitionConfig: noTransitionConfig,
  navigationOptions: {
    headerStyle: styles.header
  }
})

const PrimaryNav = createStackNavigator(
  {
    InititalStack: {screen: InititalStack},
    postStack: {screen: BottomTabNavigation},
  },
  {
    // Default config for all screens
    headerMode: 'none',
    initialRouteName: 'InititalStack',
    transitionConfig: noTransitionConfig,
    defaultNavigationOptions: {
      gesturesEnabled: false,
    },
  },
);

export default createAppContainer(PrimaryNav)
