import { useCallback, useEffect, useMemo, useState } from 'react';
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
import { useAuth } from '../context/AuthContext';
import { obtenerCitasAsignadas } from '../services/citasFirestoreService';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { fechaLocalISO } from '../utils/vistasGroomer';

export default function CitasScreen({ navigation }) {
  const { uid } = useAuth();

  const [citas, setCitas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [filtroActivo, setFiltroActivo] = useState('hoy');

  const fechaActual = fechaLocalISO();

  const cargarCitas = useCallback(async () => {
    if (!uid) {
      setCitas([]);
      setError('No se identificó al usuario autenticado.');
      setCargando(false);
      return;
    }

    try {
      setError('');
      setCargando(true);

      const resultado = await obtenerCitasAsignadas(uid);

      setCitas(resultado);
    } catch (err) {
      console.error(
        'Error cargando citas desde Firestore:',
        err,
      );

      setError(
        err?.message ||
          'No se pudieron consultar las citas desde Firestore.',
      );
    } finally {
      setCargando(false);
    }
  }, [uid]);

  useEffect(() => {
    let cancelled = false;

    async function cargarAlMontar() {
      if (!uid) {
        await Promise.resolve();
        if (cancelled) {
          return;
        }

        setCitas([]);
        setError('No se identificó al usuario autenticado.');
        setCargando(false);
        return;
      }

      try {
        const resultado = await obtenerCitasAsignadas(uid);

        if (cancelled) {
          return;
        }

        setError('');
        setCitas(resultado);
      } catch (err) {
        if (cancelled) {
          return;
        }

        console.error(
          'Error cargando citas desde Firestore:',
          err,
        );

        setError(
          err?.message ||
            'No se pudieron consultar las citas desde Firestore.',
        );
      } finally {
        if (!cancelled) {
          setCargando(false);
        }
      }
    }

    void cargarAlMontar();

    return () => {
      cancelled = true;
    };
  }, [uid]);

  const citasFiltradas = useMemo(() => {
    return citas.filter((cita) => {
      if (filtroActivo === 'hoy') {
        return cita.fecha === fechaActual;
      }

      if (filtroActivo === 'proximas') {
        return cita.fecha > fechaActual;
      }

      return cita.fecha && cita.fecha < fechaActual;
    });
  }, [citas, filtroActivo, fechaActual]);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl
          refreshing={cargando && citas.length > 0}
          onRefresh={cargarCitas}
          colors={[colors.primary]}
        />
      }
    >
      <Text style={styles.title}>Mis citas</Text>

      <Text style={styles.subtitle}>
        Consulta las citas asignadas al Groomer.
      </Text>

      <View style={styles.availabilityButton}>
        <PrimaryButton
          title="Ver disponibilidad"
          onPress={() =>
            navigation.navigate('Disponibilidad')
          }
        />
      </View>

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
              filtroActivo === 'hoy' &&
                styles.filterTextActive,
            ]}
          >
            Hoy
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.filter,
            filtroActivo === 'proximas' &&
              styles.filterActive,
          ]}
          onPress={() => setFiltroActivo('proximas')}
        >
          <Text
            style={[
              styles.filterText,
              filtroActivo === 'proximas' &&
                styles.filterTextActive,
            ]}
          >
            Próximas
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.filter,
            filtroActivo === 'pasadas' &&
              styles.filterActive,
          ]}
          onPress={() => setFiltroActivo('pasadas')}
        >
          <Text
            style={[
              styles.filterText,
              filtroActivo === 'pasadas' &&
                styles.filterTextActive,
            ]}
          >
            Pasadas
          </Text>
        </Pressable>
      </View>

      {cargando && citas.length === 0 ? (
        <View style={styles.emptyCard}>
          <ActivityIndicator color={colors.primary} />

          <Text style={styles.emptyText}>
            Cargando citas desde Firestore...
          </Text>
        </View>
      ) : error ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>
            No se pudieron cargar
          </Text>

          <Text style={styles.emptyText}>{error}</Text>

          <View style={styles.buttonContainer}>
            <PrimaryButton
              title="Reintentar"
              onPress={cargarCitas}
            />
          </View>
        </View>
      ) : citasFiltradas.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>Sin citas</Text>

          <Text style={styles.emptyText}>
            No hay citas disponibles en esta sección.
          </Text>
        </View>
      ) : (
        citasFiltradas.map((cita) => (
          <View key={cita.id} style={styles.card}>
            <Text style={styles.date}>
              {cita.fechaTexto}
            </Text>

            <Text style={styles.time}>
              {cita.horaInicio || 'Sin hora'} -{' '}
              {cita.horaFin || 'Sin hora'}
            </Text>

            <Text style={styles.petName}>
              {cita.perro || 'Sin nombre'}
            </Text>

            <Text style={styles.petBreed}>
              {cita.raza || 'Sin raza'}
            </Text>

            <View style={styles.separator} />

            <Text style={styles.serviceLabel}>
              Cliente
            </Text>

            <Text style={styles.service}>
              {cita.cliente || 'Sin cliente'}
            </Text>

            <View style={styles.status}>
              <EstadoBadge
                estado={cita.estado || 'sin estado'}
              />
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

  availabilityButton: {
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
    marginBottom: spacing.md,
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

  status: {
    alignSelf: 'flex-start',
    marginTop: spacing.md,
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