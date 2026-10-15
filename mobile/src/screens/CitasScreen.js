import { useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import PrimaryButton from '../components/PrimaryButton';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

const citas = [
  {
    id: '2',
    fecha: '2026-09-22',
    fechaTexto: '22 SEP 2026',
    horaInicio: '12:50',
    horaFin: '13:35',

    perro: 'Rocky',
    raza: 'Labrador',
    cliente: 'Juan Perez',

    groomer: 'Luis Suares',

    servicio: 'Baño Completo',
    duracion: '45 min',

    tarea: 'Baño',
    estadoTarea: 'Completada',

    estado: 'Completada',
  },
];

function obtenerFechaActual() {
  const hoy = new Date();

  const year = hoy.getFullYear();
  const month = String(hoy.getMonth() + 1).padStart(2, '0');
  const day = String(hoy.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export default function CitasScreen({ navigation }) {
  const [filtroActivo, setFiltroActivo] = useState('pasadas');

  const fechaActual = obtenerFechaActual();

  const citasFiltradas = useMemo(() => {
    return citas.filter((cita) => {
      if (filtroActivo === 'hoy') {
        return cita.fecha === fechaActual;
      }

      if (filtroActivo === 'proximas') {
        return cita.fecha > fechaActual;
      }

      return cita.fecha < fechaActual;
    });
  }, [filtroActivo, fechaActual]);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <Text style={styles.title}>Mis citas</Text>

      <Text style={styles.subtitle}>
        Consulta las citas asignadas al Groomer.
      </Text>

      <View style={styles.filters}>
        <Pressable
          style={[
            styles.filter,
            filtroActivo === 'hoy' && styles.filterActive,
          ]}
          onPress={() => setFiltroActivo('hoy')}
        >
          <Text
            style={[
              styles.filterText,
              filtroActivo === 'hoy' && styles.filterTextActive,
            ]}
          >
            Hoy
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.filter,
            filtroActivo === 'proximas' && styles.filterActive,
          ]}
          onPress={() => setFiltroActivo('proximas')}
        >
          <Text
            style={[
              styles.filterText,
              filtroActivo === 'proximas' && styles.filterTextActive,
            ]}
          >
            Próximas
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.filter,
            filtroActivo === 'pasadas' && styles.filterActive,
          ]}
          onPress={() => setFiltroActivo('pasadas')}
        >
          <Text
            style={[
              styles.filterText,
              filtroActivo === 'pasadas' && styles.filterTextActive,
            ]}
          >
            Pasadas
          </Text>
        </Pressable>
      </View>

      {citasFiltradas.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>Sin citas</Text>

          <Text style={styles.emptyText}>
            No hay citas disponibles en esta sección.
          </Text>
        </View>
      ) : (
        citasFiltradas.map((cita) => (
          <View key={cita.id} style={styles.card}>
            <Text style={styles.date}>{cita.fechaTexto}</Text>

            <Text style={styles.time}>
              {cita.horaInicio} - {cita.horaFin}
            </Text>

            <Text style={styles.petName}>{cita.perro}</Text>
            <Text style={styles.petBreed}>{cita.raza}</Text>

            <View style={styles.separator} />

            <Text style={styles.serviceLabel}>Servicio</Text>
            <Text style={styles.service}>{cita.servicio}</Text>
            <Text style={styles.duration}>{cita.duracion}</Text>

            <View style={styles.status}>
              <Text style={styles.statusText}>{cita.estado}</Text>
            </View>

            <View style={styles.buttonContainer}>
              <PrimaryButton
                title="Ver detalle"
                onPress={() =>
                  navigation.navigate('DetalleCita', {
                    cita,
                  })
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
  },

  subtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },

  filters: {
    flexDirection: 'row',
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },

  filter: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: 12,
    backgroundColor: colors.surface,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },

  filterActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },

  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },

  filterTextActive: {
    color: colors.surface,
    fontWeight: '700',
  },

  card: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: spacing.lg,
    elevation: 3,
  },

  date: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },

  time: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginTop: 3,
    marginBottom: spacing.md,
  },

  petName: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textPrimary,
  },

  petBreed: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },

  separator: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },

  serviceLabel: {
    fontSize: 13,
    color: colors.textSecondary,
  },

  service: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: 3,
  },

  duration: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },

  status: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    marginTop: spacing.md,
  },

  statusText: {
    color: colors.completed,
    fontWeight: '700',
    fontSize: 13,
  },

  buttonContainer: {
    marginTop: spacing.lg,
  },

  emptyCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: spacing.xl,
    alignItems: 'center',
    elevation: 2,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },

  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
});