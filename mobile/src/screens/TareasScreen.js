import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import EstadoBadge from '../components/EstadoBadge';
import PrimaryButton from '../components/PrimaryButton';
import { useTareas } from '../context/TareasContext';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { ESTADOS } from '../utils/formato';

const FILTROS = [
  { key: ESTADOS.PENDIENTE, label: 'Pendientes' },
  { key: ESTADOS.EN_PROCESO, label: 'En proceso' },
  { key: ESTADOS.COMPLETADA, label: 'Completadas' },
];

export default function TareasScreen({ navigation }) {
  const { tareas, cargando, error, recargar } = useTareas();
  const [filtroActivo, setFiltroActivo] = useState(ESTADOS.PENDIENTE);

  const tareasFiltradas = useMemo(
    () => tareas.filter((t) => t.estado === filtroActivo),
    [tareas, filtroActivo],
  );

  const primeraCarga = cargando && tareas.length === 0;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl
          refreshing={cargando && tareas.length > 0}
          onRefresh={recargar}
          colors={[colors.primary]}
        />
      }
    >
      <Text style={styles.title}>Mis tareas</Text>
      <Text style={styles.subtitle}>
        Servicios y tareas asignadas al Groomer.
      </Text>

      <View style={styles.filters}>
        {FILTROS.map((f) => (
          <Pressable
            key={f.key}
            style={[styles.filter, filtroActivo === f.key && styles.filterActive]}
            onPress={() => setFiltroActivo(f.key)}
          >
            <Text
              style={[
                styles.filterText,
                filtroActivo === f.key && styles.filterTextActive,
              ]}
            >
              {f.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {primeraCarga ? (
        <View style={styles.emptyCard}>
          <ActivityIndicator color={colors.primary} />
          <Text style={styles.emptyText}>Cargando tareas...</Text>
        </View>
      ) : error ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>No se pudieron cargar</Text>
          <Text style={styles.emptyText}>{error}</Text>
          <View style={styles.retry}>
            <PrimaryButton title="Reintentar" onPress={recargar} />
          </View>
        </View>
      ) : tareasFiltradas.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>Sin tareas</Text>
          <Text style={styles.emptyText}>
            No hay tareas disponibles en esta sección.
          </Text>
        </View>
      ) : (
        tareasFiltradas.map((tarea) => (
          <View key={tarea.id} style={styles.card}>
            <Text style={styles.date}>{tarea.fechaTexto}</Text>
            <Text style={styles.time}>
              {tarea.horaInicio} - {tarea.horaFin}
            </Text>

            <Text style={styles.petName}>{tarea.perro}</Text>
            {!!tarea.raza && <Text style={styles.petBreed}>{tarea.raza}</Text>}

            <View style={styles.separator} />

            <Text style={styles.serviceLabel}>Tarea</Text>
            <Text style={styles.service}>{tarea.nombre}</Text>
            <Text style={styles.duration}>{tarea.servicio}</Text>

            <View style={styles.statusContainer}>
              <EstadoBadge estado={tarea.estado} />
            </View>

            <View style={styles.buttonContainer}>
              <PrimaryButton
                title="Ver detalle"
                onPress={() =>
                  navigation.navigate('DetalleTarea', { tareaId: tarea.id })
                }
              />
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  contentContainer: { padding: spacing.lg, paddingBottom: spacing.xxl },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: spacing.lg,
  },
  subtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  filters: { flexDirection: 'row', marginBottom: spacing.lg, gap: spacing.sm },
  filter: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: 12,
    backgroundColor: colors.surface,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  filterText: { fontSize: 13, fontWeight: '600', color: colors.textSecondary },
  filterTextActive: { color: colors.surface, fontWeight: '700' },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: spacing.lg,
    elevation: 3,
    marginBottom: spacing.md,
  },
  date: { fontSize: 13, fontWeight: '700', color: colors.primary },
  time: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginTop: 3,
    marginBottom: spacing.md,
  },
  petName: { fontSize: 22, fontWeight: '700', color: colors.textPrimary },
  petBreed: { fontSize: 14, color: colors.textSecondary, marginTop: 2 },
  separator: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
  serviceLabel: { fontSize: 13, color: colors.textSecondary },
  service: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: 3,
  },
  duration: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  statusContainer: { marginTop: spacing.md },
  buttonContainer: { marginTop: spacing.lg },
  retry: { marginTop: spacing.lg, alignSelf: 'stretch' },
  emptyCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: spacing.xl,
    alignItems: 'center',
    elevation: 2,
  },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: colors.textPrimary },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
});