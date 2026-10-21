import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';

import PrimaryButton from '../components/PrimaryButton';
import { useAuth } from '../context/AuthContext';
import { useTareas } from '../context/TareasContext';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { fechaLocalISO } from '../utils/vistasGroomer';

export default function HomeScreen({ navigation }) {
  const { usuario } = useAuth();
  const { tareas, cargando, error, recargar } = useTareas();
  const hoy = fechaLocalISO();
  const tareasHoy = tareas.filter((tarea) => tarea.fecha === hoy);
  const nombre = usuario?.nombre?.trim() || 'Groomer';

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={cargando && tareas.length > 0}
          onRefresh={recargar}
          colors={[colors.primary]}
        />
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>Hola, {nombre}</Text>
        <Text style={styles.subtitle}>
          {cargando && tareas.length === 0
            ? 'Cargando tus tareas...'
            : `Tienes ${tareasHoy.length} tareas asignadas para hoy`}
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
        </View>

        <View style={styles.buttonContainer}>
          <PrimaryButton
            title="Mis tareas"
            onPress={() => navigation.navigate('Tareas')}
          />
        </View>
      </View>

      <Text style={styles.sectionTitle}>Tareas de hoy</Text>

      {cargando && tareas.length === 0 ? (
        <ActivityIndicator color={colors.primary} />
      ) : error ? (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>No se pudieron cargar</Text>
          <Text style={styles.cardText}>{error}</Text>
          <View style={styles.buttonContainer}>
            <PrimaryButton title="Reintentar" onPress={recargar} />
          </View>
        </View>
      ) : tareasHoy.length === 0 ? (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Sin tareas para hoy</Text>
          <Text style={styles.cardText}>
            Cuando tengas citas asignadas con tareas, aparecerán aquí.
          </Text>
        </View>
      ) : (
        tareasHoy.map((tarea) => (
          <View key={tarea.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{tarea.perro || 'Sin nombre'}</Text>
              <Text style={styles.timeText}>
                {tarea.horaInicio || 'Sin hora'}
              </Text>
            </View>

            {!!tarea.raza && (
              <Text style={styles.cardText}>Raza: {tarea.raza}</Text>
            )}
            <Text style={styles.cardText}>
              Servicio: {tarea.servicio || 'Sin servicio'}
            </Text>
            <Text style={styles.cardText}>Tarea: {tarea.nombre || 'Sin nombre'}</Text>

            <View style={styles.buttonContainer}>
              <PrimaryButton
                title="Ver tarea"
                onPress={() =>
                  navigation.navigate('DetalleTarea', { tareaId: tarea.id })
                }
              />
            </View>

            {tarea.citaEncontrada && (
              <View style={styles.buttonContainer}>
                <PrimaryButton
                  title="Registrar atención"
                  onPress={() =>
                    navigation.navigate('Historial', {
                      citaId: tarea.citaId,
                    })
                  }
                />
              </View>
            )}
          </View>
        ))
      )}
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
  timeText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.secondary || '#666',
  },
  cardText: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  buttonContainer: {
    marginTop: spacing.md,
  },
  spacer: {
    height: spacing.md,
  },
});
