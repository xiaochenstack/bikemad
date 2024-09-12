import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import MapScreen from './src/map';
import DetalhesScreen from './src/detalhes';
import ReservasScreen from './src/reservas';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const MapStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="map" component={MapScreen} />
    <Stack.Screen name="details" component={DetalhesScreen} />
  </Stack.Navigator>
);

const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Map" component={MapStack} />
        <Tab.Screen name="reservas" component={ReservasScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;
