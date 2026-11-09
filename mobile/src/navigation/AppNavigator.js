import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { AuthProvider, useAuth } from '../context/AuthContext';
import { destinoNavegacion } from '../domain/acceso.mjs';
import { TareasProvider } from '../context/TareasContext';
import AdminHomeScreen from '../screens/AdminHomeScreen';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import CitasScreen from '../screens/CitasScreen';
import DetalleCitaScreen from '../screens/DetalleCitaScreen';
import DisponibilidadScreen from '../screens/DisponibilidadScreen';
import HistorialScreen from '../screens/HistorialScreen';
import TareasScreen from '../screens/TareasScreen';
import DetalleTareaScreen from '../screens/DetalleTareaScreen';
import ClientesScreen from '../screens/ClientesScreen';
import DetalleClientePerroScreen from '../screens/DetalleClientePerroScreen';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import PrimaryButton from '../components/PrimaryButton';

const Stack = createNativeStackNavigator();

function BotonSalir() {
  const { cerrarSesion } = useAuth();

  return (
    <Pressable onPress={cerrarSesion} hitSlop={10}>
      <Text style={styles.salir}>Salir</Text>
    </Pressable>
  );
}

function SinPermisoScreen() {
  const { usuario, aviso, cerrarSesion } = useAuth();

  return (
    <View style={styles.bloqueado}>
      <Text style={styles.bloqueadoTitulo}>Sin acceso</Text>
      <Text style={styles.bloqueadoTexto}>
        {usuario?.correo
          ? `${usuario.correo} inició sesión, pero no tiene un rol activo.`
          : 'La sesión no tiene un rol activo.'}
      </Text>
      <Text style={styles.bloqueadoTexto}>
        Un administrador debe asignar administrador o groomer en la fuente
        confiable. Esta pantalla no concede permisos.
      </Text>
      {!!aviso && <Text style={styles.bloqueadoAviso}>{aviso}</Text>}
      <PrimaryButton title="Cerrar sesión" onPress={cerrarSesion} />
    </View>
  );
}

function Rutas() {
  const { usuario, cargando } = useAuth();
  const destino = destinoNavegacion({ cargando, usuario });

  if (destino === 'cargando') {
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
        {destino === 'administrador' ? (
          <Stack.Screen
            name="AdminHome"
            component={AdminHomeScreen}
            options={{
              title: 'Inicio',
              headerRight: () => <BotonSalir />,
            }}
          />
        ) : destino === 'groomer' ? (
          <>
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{
                title: 'Inicio',
                headerRight: () => <BotonSalir />,
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
              name="Disponibilidad"
              component={DisponibilidadScreen}
              options={{ title: 'Mi disponibilidad' }}
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
              name="Historial"
              component={HistorialScreen}
              options={{ title: 'Registrar Atención' }}
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
        ) : destino === 'sin-permiso' ? (
          <Stack.Screen
            name="SinPermiso"
            component={SinPermisoScreen}
            options={{ title: 'Sin acceso', headerShown: false }}
          />
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
  bloqueado: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: colors.background,
    padding: spacing.lg,
  },
  bloqueadoTitulo: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  bloqueadoTexto: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  bloqueadoAviso: {
    color: colors.danger,
    fontSize: 14,
    marginBottom: spacing.md,
  },
});