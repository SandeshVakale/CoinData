import { createStackNavigator } from 'react-navigation-stack'
import DetailScreen from '../Containers/DetailScreen'
import LaunchScreen from '../Containers/LaunchScreen'
import styles from './Styles/NavigationStyles'
import { Animated, Easing } from 'react-native'

const noTransitionConfig = () => ({
  transitionSpec: {
    duration: 0,
    timing: Animated.timing,
    easing: Easing.step0,
  },
});


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
export default InititalStack
