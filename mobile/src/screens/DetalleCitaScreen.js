import { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import EstadoBadge from '../components/EstadoBadge';
import PrimaryButton from '../components/PrimaryButton';
import { useAuth } from '../context/AuthContext';
import { useTareas } from '../context/TareasContext';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { ETIQUETA_ESTADO } from '../utils/formato';
import { citasDesdeTareas, serviciosDeCita } from '../utils/vistasGroomer';

export default function DetalleCitaScreen({ navigation, route }) {
  const { citaId } = route.params ?? {};
  const { usuario } = useAuth();
  const { tareas } = useTareas();
  const cita = useMemo(
    () => citasDesdeTareas(tareas).find((item) => item.id === String(citaId)),
    [tareas, citaId],
  );

  if (!cita) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Cita no encontrada</Text>
        <Text style={styles.petBreed}>
          No está entre las citas recuperadas de tus tareas.
        </Text>
      </View>
    );
  }

  const servicios = serviciosDeCita(cita);
  const horario = [cita.horaInicio, cita.horaFin].filter(Boolean).join(' - ');

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <Text style={styles.title}>Detalle de cita</Text>

      <View style={styles.card}>
        <Text style={styles.petName}>{cita.perro}</Text>
        <Text style={styles.petBreed}>{cita.raza}</Text>

        <View style={styles.separator} />

        <Text style={styles.label}>Cliente</Text>
        <Text style={styles.value}>{cita.cliente}</Text>

        <Text style={styles.label}>Groomer asignado</Text>
        <Text style={styles.value}>{usuario?.nombre || 'Sin nombre'}</Text>

        <Text style={styles.label}>Servicio</Text>
        <Text style={styles.value}>
          {servicios.length > 0 ? servicios.join(', ') : 'Sin servicio'}
        </Text>

        <Text style={styles.label}>Fecha</Text>
        <Text style={styles.value}>{cita.fechaTexto}</Text>

        <Text style={styles.label}>Horario</Text>
        <Text style={styles.value}>{horario || 'Sin horario'}</Text>

        <Text style={styles.label}>Estado de la cita</Text>

        <View style={styles.status}>
          <EstadoBadge estado={cita.estado || 'sin estado'} />
        </View>

        <Text style={styles.label}>Tareas asignadas</Text>

        {cita.tareas.map((tarea) => (
          <View key={tarea.id} style={styles.task}>
            <Text style={styles.taskTitle}>{tarea.nombre || 'Sin nombre'}</Text>
            <Text style={styles.taskText}>
              {[tarea.horaInicio, tarea.horaFin].filter(Boolean).join(' - ') ||
                'Sin horario'}
            </Text>
            <Text style={styles.taskStatus}>
              Tarea: {ETIQUETA_ESTADO[tarea.estado] ?? (tarea.estado || 'Sin estado')}
            </Text>
          </View>
        ))}

        <View style={styles.buttonContainer}>
          <PrimaryButton
            title="Registrar atención"
            onPress={() => navigation.navigate('Historial', { citaId: cita.id })}
          />
        </View>

        <View style={styles.buttonContainer}>
          <PrimaryButton
            title="Regresar a citas"
            onPress={() => navigation.goBack()}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  contentContainer: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },

  title: {
    fontSize: 30,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
  },

  card: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: spacing.lg,
    elevation: 3,
  },

  petName: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
  },

  petBreed: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },

  separator: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },

  label: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: spacing.md,
  },

  value: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: 4,
  },

  secondaryValue: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 3,
  },

  status: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    marginTop: spacing.sm,
  },

  statusText: {
    color: colors.completed,
    fontWeight: '700',
    fontSize: 13,
  },

  task: {
    backgroundColor: colors.primaryLight,
    borderRadius: 14,
    padding: spacing.md,
    marginTop: spacing.sm,
  },

  taskTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },

  taskText: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
  },

  taskStatus: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.completed,
    marginTop: 4,
  },

  buttonContainer: {
    marginTop: spacing.xl,
  },
});