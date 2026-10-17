import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { AuthProvider, useAuth } from '../context/AuthContext';
import { TareasProvider } from '../context/TareasContext';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import CitasScreen from '../screens/CitasScreen';
import DetalleCitaScreen from '../screens/DetalleCitaScreen';
import TareasScreen from '../screens/TareasScreen';
import DetalleTareaScreen from '../screens/DetalleTareaScreen';
import ClientesScreen from '../screens/ClientesScreen';
import DetalleClientePerroScreen from '../screens/DetalleClientePerroScreen';
import { colors } from '../theme/colors';

const Stack = createNativeStackNavigator();

function Rutas() {
  const { usuario, cargando, cerrarSesion } = useAuth();

  if (cargando) {
    return (
      <View style={styles.splash}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: true,
        }}
      >
        {usuario ? (
          <>
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{
                title: 'Inicio',
                headerRight: () => (
                  <Pressable onPress={cerrarSesion} hitSlop={10}>
                    <Text style={styles.salir}>Salir</Text>
                  </Pressable>
                ),
              }}
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

            <Stack.Screen
              name="Tareas"
              component={TareasScreen}
              options={{ title: 'Mis tareas' }}
            />

            <Stack.Screen
              name="DetalleTarea"
              component={DetalleTareaScreen}
              options={{ title: 'Detalle de tarea' }}
            />

            <Stack.Screen
              name="Clientes"
              component={ClientesScreen}
              options={{ title: 'Clientes y Perros' }}
            />

            <Stack.Screen
              name="DetalleClientePerro"
              component={DetalleClientePerroScreen}
              options={{ title: 'Expediente del Cliente' }}
            />
          </>
        ) : (
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ title: 'Iniciar sesión', headerShown: false }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function AppNavigator() {
  return (
    <AuthProvider>
      <TareasProvider>
        <Rutas />
      </TareasProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  salir: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: 15,
  },
});