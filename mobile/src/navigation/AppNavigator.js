import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import CitasScreen from '../screens/CitasScreen';
import DetalleCitaScreen from '../screens/DetalleCitaScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: true,
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Inicio' }}
        />

        <Stack.Screen
          name="Citas"
          component={CitasScreen}
          options={{ title: 'Mis citas' }}
        />

        <Stack.Screen
          name="DetalleCita"
          component={DetalleCitaScreen}
          options={{ title: 'Detalle de cita' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}