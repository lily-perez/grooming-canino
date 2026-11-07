import { ScrollView, StyleSheet, Text, View } from 'react-native';

import EstadoBadge from '../components/EstadoBadge';
import PrimaryButton from '../components/PrimaryButton';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

export default function DetalleCitaScreen({ navigation, route }) {
  const { usuario } = useAuth();
  const { cita } = route.params ?? {};

  if (!cita) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Cita no encontrada</Text>

        <Text style={styles.secondaryText}>
          No fue posible recuperar la información de la cita.
        </Text>

        <View style={styles.buttonContainer}>
          <PrimaryButton
            title="Regresar a citas"
            onPress={() => navigation.goBack()}
          />
        </View>
      </View>
    );
  }

  const horario = [cita.horaInicio, cita.horaFin]
    .filter(Boolean)
    .join(' - ');

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <Text style={styles.title}>Detalle de cita</Text>

      <View style={styles.card}>
        <Text style={styles.petName}>
          {cita.perro || 'Sin nombre'}
        </Text>

        <Text style={styles.petBreed}>
          {cita.raza || 'Sin raza'}
        </Text>

        <View style={styles.separator} />

        <Text style={styles.label}>Cliente</Text>
        <Text style={styles.value}>
          {cita.cliente || 'Sin cliente'}
        </Text>

        <Text style={styles.label}>Groomer asignado</Text>
        <Text style={styles.value}>
          {usuario?.nombre || cita.groomerUid || 'Sin groomer'}
        </Text>

        <Text style={styles.label}>Fecha</Text>
        <Text style={styles.value}>
          {cita.fechaTexto || cita.fecha || 'Sin fecha'}
        </Text>

        <Text style={styles.label}>Horario</Text>
        <Text style={styles.value}>
          {horario || 'Sin horario'}
        </Text>

        <Text style={styles.label}>Servicio</Text>
        <Text style={styles.value}>
          {cita.servicio || 'Sin servicio registrado'}
        </Text>

        <Text style={styles.label}>Estado de la cita</Text>

        <View style={styles.status}>
          <EstadoBadge
            estado={cita.estado || 'sin estado'}
          />
        </View>

        {cita.observaciones ? (
          <>
            <Text style={styles.label}>Observaciones</Text>
            <Text style={styles.value}>
              {cita.observaciones}
            </Text>
          </>
        ) : null}

        <View style={styles.buttonContainer}>
          <PrimaryButton
            title="Registrar atención"
            onPress={() =>
              navigation.navigate('Historial', {
                citaId: cita.id,
              })
            }
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

  secondaryText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginHorizontal: spacing.lg,
  },

  status: {
    alignSelf: 'flex-start',
    marginTop: spacing.sm,
  },

  buttonContainer: {
    marginTop: spacing.xl,
  },
});