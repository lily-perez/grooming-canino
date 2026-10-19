import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';

import EstadoBadge from '../components/EstadoBadge';
import PrimaryButton from '../components/PrimaryButton';
import { useTareas } from '../context/TareasContext';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { ESTADOS } from '../utils/formato';

function Fila({ label, value }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

export default function DetalleTareaScreen({ route }) {
  const { tareaId } = route.params;
  const { tareas, cambiarEstado } = useTareas();
  const [guardando, setGuardando] = useState(false);

  const tarea = tareas.find((t) => t.id === tareaId);

  if (!tarea) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Tarea no encontrada</Text>
      </View>
    );
  }

  const cambiar = async (nuevoEstado) => {
    if (guardando) {
      return;
    }

    setGuardando(true);

    try {
      await cambiarEstado(tarea.id, nuevoEstado);
    } catch (e) {
      Alert.alert('No se pudo actualizar', e.message);
    } finally {
      setGuardando(false);
    }
  };

  const confirmarCompletar = () => {
    Alert.alert('Completar tarea', '¿Marcar esta tarea como completada?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Completar', onPress: () => cambiar(ESTADOS.COMPLETADA) },
    ]);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <Text style={styles.title}>{tarea.nombre}</Text>
      <EstadoBadge estado={tarea.estado} />

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Servicio y horario</Text>
        <Fila label="Servicio" value={tarea.servicio} />
        <Fila label="Fecha" value={tarea.fechaTexto} />
        <Fila label="Horario" value={`${tarea.horaInicio} - ${tarea.horaFin}`} />
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Mascota y cliente</Text>
        <Fila label="Perro" value={tarea.perro} />
        {!!tarea.raza && <Fila label="Raza" value={tarea.raza} />}
        <Fila label="Cliente" value={tarea.cliente} />
      </View>

      {!!tarea.observaciones && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Observaciones</Text>
          <Text style={styles.notas}>{tarea.observaciones}</Text>
        </View>
      )}

      <View style={styles.buttonContainer}>
        {tarea.estado === ESTADOS.PENDIENTE && (
          <PrimaryButton
            title={guardando ? 'Guardando...' : 'Iniciar tarea'}
            onPress={() => cambiar(ESTADOS.EN_PROCESO)}
          />
        )}
        {tarea.estado === ESTADOS.EN_PROCESO && (
          <PrimaryButton
            title={guardando ? 'Guardando...' : 'Completar tarea'}
            onPress={confirmarCompletar}
          />
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  contentContainer: { padding: spacing.lg, paddingBottom: spacing.xxl },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: spacing.lg,
    elevation: 2,
    marginTop: spacing.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs + 2,
  },
  rowLabel: { fontSize: 14, color: colors.textSecondary },
  rowValue: { fontSize: 14, fontWeight: '600', color: colors.textPrimary },
  notas: { fontSize: 14, color: colors.textPrimary },
  buttonContainer: { marginTop: spacing.lg },
});