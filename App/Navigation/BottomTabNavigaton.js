import * as React from 'react'
import FavoritesScreen from '../Containers/FavoritesScreen'
import MarketsScreen from '../Containers/MarketsScreen'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { Colors } from '../Themes'
import CoinToDetailNavigator from './CoinToDetailNavigator'
import ExchangeToDetailNavigator from './ExchangeToDetailNavigator'

const Tab = createBottomTabNavigator()

export default function BottomTabNavigation (props) {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenProps={props}
        screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName

          if (route.name === 'Coins') {
            iconName = focused
              ? 'death-star'
              : 'death-star'
          } else if (route.name === 'Exchanges') {
            iconName = focused ? 'chart-bubble' : 'chart-bubble'
          } else if (route.name === 'Markets') {
            iconName = focused ? 'chart-bar' : 'chart-bar'
          } else if (route.name === 'Favorites') {
            iconName = focused ? 'star' : 'star'
          }

          // You can return any component that you like here!
          return <Icon name={iconName} size={size} color={color}/>
        },
      })}
                     tabBarOptions={{
                       activeTintColor: Colors.bloodOrange,
                       inactiveTintColor: Colors.charcoal
                     }}>
        <Tab.Screen name="Coins" component={CoinToDetailNavigator}/>
        <Tab.Screen name="Exchanges" component={ExchangeToDetailNavigator}/>
        <Tab.Screen name="Markets" component={MarketsScreen}/>
        <Tab.Screen name="Favorites" component={FavoritesScreen}/>
      </Tab.Navigator>
    </NavigationContainer>
  )
}
