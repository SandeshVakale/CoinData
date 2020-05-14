import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'
import {Animated, Easing} from 'react-native'
import BottomTabNavigation from './BottomTabNavigaton'
import InititalStack from './StackNavigator'

const noTransitionConfig = () => ({
  transitionSpec: {
    duration: 0,
    timing: Animated.timing,
    easing: Easing.step0,
  },
});

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
