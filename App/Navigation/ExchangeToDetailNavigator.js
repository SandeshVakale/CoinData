import { createStackNavigator } from '@react-navigation/stack';
import DetailScreen from '../Containers/DetailScreen'
import * as React from 'react'
import ExchangesScreen from '../Containers/ExchangesScreen'

const CoinsStack = createStackNavigator();

export default function ExchangeToDetailNavigator() {
  return (
    <CoinsStack.Navigator screenOptions={{
      headerShown: false
    }}>
      <CoinsStack.Screen name="Coins" component={ExchangesScreen} />
      <CoinsStack.Screen name="DetailScreen" component={DetailScreen}/>
    </CoinsStack.Navigator>
  );
}
