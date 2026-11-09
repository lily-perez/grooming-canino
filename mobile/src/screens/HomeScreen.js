import React, { useEffect } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';

import PrimaryButton from '../components/PrimaryButton';
import { useAuth } from '../context/AuthContext';
import { useHistorial } from '../context/HistorialContext';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

export default function HomeScreen({ navigation }) {
  const { usuario, cerrarSesion } = useAuth();
  const { historial, cargandoHistorial, cargarHistorial } = useHistorial();

  // Preferir nombre del perfil; si no hay, usar la parte local del correo
  const nombre =
    (typeof usuario?.nombre === 'string' && usuario.nombre.trim()) ||
    (typeof usuario?.correo === 'string' && usuario.correo.includes('@')
      ? usuario.correo.split('@')[0]
      : '') ||
    'Groomer'; 

  // Cargar el historial al montar la pantalla o cuando cambie el usuario
  useEffect(() => {
    if (usuario?.uid) {
      cargarHistorial(usuario.uid);
    }
  }, [usuario, cargarHistorial]);

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={cargandoHistorial}
          onRefresh={() => usuario?.uid && cargarHistorial(usuario.uid)}
          colors={[colors.primary]}
        />
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>Hola, {nombre}</Text>
        <Text style={styles.subtitle}>
          Bienvenido a tu Dashboard
        </Text>

        <View style={styles.buttonContainer}>
          <PrimaryButton
            title="Ver citas"
            onPress={() => navigation.navigate('Citas')}
          />
          <View style={styles.spacer} />
          <PrimaryButton
            title="Clientes y Perros"
            onPress={() => navigation.navigate('Clientes')}
          />
          <View style={styles.spacer} />
          <PrimaryButton
            title="Mis tareas"
            onPress={() => navigation.navigate('Tareas')}
          />
        </View>
      </View>

      <Text style={styles.sectionTitle}>Mi Historial de Atenciones</Text>

      {cargandoHistorial ? (
        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: spacing.lg }} />
      ) : historial.length === 0 ? (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Sin historial</Text>
          <Text style={styles.cardText}>
            No tienes atenciones registradas aún en Firestore. Cuando finalices una cita, aparecerá aquí.
          </Text>
        </View>
      ) : (
        historial.map((registro) => (
          <View key={registro.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{registro.perro || 'Sin nombre'}</Text>
            </View>
            <Text style={styles.cardText}>Pelaje: {registro.pelaje || 'N/A'}</Text>
            <Text style={styles.cardText}>Comportamiento: {registro.comportamiento || 'N/A'}</Text>
            <Text style={styles.cardText}>Observaciones: {registro.observaciones || 'Ninguna'}</Text>
          </View>
        ))
      )}

      <View style={[styles.buttonContainer, { marginTop: spacing.xl, marginBottom: spacing.xl }]}>
        <PrimaryButton
          title="Cerrar Sesión"
          onPress={cerrarSesion}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
  },
  header: {
    marginTop: spacing.xl,
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.md,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
  },
  cardText: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  buttonContainer: {
    marginTop: spacing.md,
  },
  spacer: {
    height: spacing.md,
  },
});