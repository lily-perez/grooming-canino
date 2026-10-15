import { ScrollView, StyleSheet, Text, View } from 'react-native';

import PrimaryButton from '../components/PrimaryButton';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

export default function DetalleCitaScreen({ navigation, route }) {
  const { cita } = route.params;

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
        <Text style={styles.value}>{cita.groomer}</Text>

        <Text style={styles.label}>Servicio</Text>
        <Text style={styles.value}>{cita.servicio}</Text>

        <Text style={styles.secondaryValue}>
          Duración estimada: {cita.duracion}
        </Text>

        <Text style={styles.label}>Fecha</Text>
        <Text style={styles.value}>{cita.fechaTexto}</Text>

        <Text style={styles.label}>Horario</Text>
        <Text style={styles.value}>
          {cita.horaInicio} - {cita.horaFin}
        </Text>

        <Text style={styles.label}>Estado</Text>

        <View style={styles.status}>
          <Text style={styles.statusText}>{cita.estado}</Text>
        </View>

        <Text style={styles.label}>Tarea asignada</Text>

        <View style={styles.task}>
          <Text style={styles.taskTitle}>{cita.tarea}</Text>

          <Text style={styles.taskText}>
            {cita.horaInicio} - {cita.horaFin}
          </Text>

          <Text style={styles.taskStatus}>
            {cita.estadoTarea}
          </Text>
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