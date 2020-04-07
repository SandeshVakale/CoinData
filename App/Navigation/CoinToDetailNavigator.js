import { createStackNavigator } from '@react-navigation/stack';
import CoinsScreen from '../Containers/CoinsScreen'
import DetailScreen from '../Containers/DetailScreen'
import * as React from 'react'

const CoinsStack = createStackNavigator();

export default function CoinToDetailNavigator() {
  return (
    <CoinsStack.Navigator screenOptions={{
      headerShown: false
    }}>
      <CoinsStack.Screen name="Coins" component={CoinsScreen} />
      <CoinsStack.Screen name="DetailScreen" component={DetailScreen}/>
    </CoinsStack.Navigator>
  );
}
