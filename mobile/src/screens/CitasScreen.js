import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

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

export default function CitasScreen({
  navigation,
}) {
  const {
    uid,
    rol,
    activo,
    cargando: cargandoAuth,
  } = useAuth();

  const [citas, setCitas] = useState([]);
  const [cargando, setCargando] =
    useState(true);
  const [error, setError] =
    useState('');
  const [filtroActivo, setFiltroActivo] =
    useState('hoy');

  const fechaActual = fechaLocalISO();

  const usuarioPuedeConsultar =
    !cargandoAuth &&
    Boolean(uid) &&
    rol === 'groomer' &&
    activo === true;

  const cargarCitas = useCallback(
    async () => {
      if (!usuarioPuedeConsultar) {
        setCitas([]);
        setError('');
        setCargando(false);
        return;
      }

      try {
        setError('');
        setCargando(true);

        const resultado =
          await obtenerCitasAsignadas(
            uid,
          );

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
    },
    [uid, usuarioPuedeConsultar],
  );

  useEffect(() => {
    let cancelled = false;

    async function cargarAlMontar() {
      if (cargandoAuth) {
        return;
      }

      if (!usuarioPuedeConsultar) {
        await Promise.resolve();

        if (cancelled) {
          return;
        }

        setCitas([]);
        setError('');
        setCargando(false);
        return;
      }

      try {
        setCargando(true);

        const resultado =
          await obtenerCitasAsignadas(
            uid,
          );

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
  }, [
    uid,
    rol,
    activo,
    cargandoAuth,
    usuarioPuedeConsultar,
  ]);

  const citasFiltradas = useMemo(() => {
    return citas.filter((cita) => {
      if (filtroActivo === 'hoy') {
        return (
          cita.fecha === fechaActual
        );
      }

      if (
        filtroActivo === 'proximas'
      ) {
        return (
          cita.fecha > fechaActual
        );
      }

      return (
        cita.fecha &&
        cita.fecha < fechaActual
      );
    });
  }, [
    citas,
    filtroActivo,
    fechaActual,
  ]);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={
        styles.contentContainer
      }
      refreshControl={
        <RefreshControl
          refreshing={
            cargando &&
            citas.length > 0
          }
          onRefresh={cargarCitas}
          colors={[colors.primary]}
        />
      }
    >
      <Text style={styles.title}>
        Mis citas
      </Text>

      <Text style={styles.subtitle}>
        Consulta las citas asignadas al
        Groomer.
      </Text>

      <View
        style={
          styles.availabilityButton
        }
      >
        <PrimaryButton
          title="Ver disponibilidad"
          onPress={() =>
            navigation.navigate(
              'Disponibilidad',
            )
          }
        />
      </View>

      <View style={styles.filters}>
        <Pressable
          style={[
            styles.filter,
            filtroActivo === 'hoy' &&
              styles.filterActive,
          ]}
          onPress={() =>
            setFiltroActivo('hoy')
          }
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
            filtroActivo ===
              'proximas' &&
              styles.filterActive,
          ]}
          onPress={() =>
            setFiltroActivo(
              'proximas',
            )
          }
        >
          <Text
            style={[
              styles.filterText,
              filtroActivo ===
                'proximas' &&
                styles.filterTextActive,
            ]}
          >
            Próximas
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.filter,
            filtroActivo ===
              'pasadas' &&
              styles.filterActive,
          ]}
          onPress={() =>
            setFiltroActivo(
              'pasadas',
            )
          }
        >
          <Text
            style={[
              styles.filterText,
              filtroActivo ===
                'pasadas' &&
                styles.filterTextActive,
            ]}
          >
            Pasadas
          </Text>
        </Pressable>
      </View>

      {cargando &&
      citas.length === 0 ? (
        <View style={styles.emptyCard}>
          <ActivityIndicator
            color={colors.primary}
          />

          <Text
            style={styles.emptyText}
          >
            Cargando citas desde
            Firestore...
          </Text>
        </View>
      ) : error ? (
        <View style={styles.emptyCard}>
          <Text
            style={styles.emptyTitle}
          >
            No se pudieron cargar
          </Text>

          <Text
            style={styles.emptyText}
          >
            {error}
          </Text>

          <View
            style={
              styles.buttonContainer
            }
          >
            <PrimaryButton
              title="Reintentar"
              onPress={cargarCitas}
            />
          </View>
        </View>
      ) : citasFiltradas.length ===
        0 ? (
        <View style={styles.emptyCard}>
          <Text
            style={styles.emptyTitle}
          >
            Sin citas
          </Text>

          <Text
            style={styles.emptyText}
          >
            No hay citas disponibles
            en esta sección.
          </Text>
        </View>
      ) : (
        citasFiltradas.map((cita) => (
          <View
            key={cita.id}
            style={styles.card}
          >
            <View
              style={styles.cardHeader}
            >
              <View
                style={styles.petInfo}
              >
                <Text
                  style={
                    styles.petName
                  }
                >
                  {cita.perro ||
                    'Sin nombre'}
                </Text>

                <Text
                  style={
                    styles.petBreed
                  }
                >
                  {cita.raza ||
                    'Sin raza'}
                </Text>
              </View>

              <View
                style={styles.status}
              >
                <EstadoBadge
                  estado={
                    cita.estado ||
                    'sin estado'
                  }
                />
              </View>
            </View>

            <View
              style={
                styles.separator
              }
            />

            <View
              style={styles.infoRow}
            >
              <Text
                style={
                  styles.infoLabel
                }
              >
                Fecha
              </Text>

              <Text
                style={
                  styles.infoValue
                }
              >
                {cita.fechaTexto ||
                  cita.fecha ||
                  'Sin fecha'}
              </Text>
            </View>

            <View
              style={styles.infoRow}
            >
              <Text
                style={
                  styles.infoLabel
                }
              >
                Horario
              </Text>

              <Text
                style={
                  styles.infoValue
                }
              >
                {cita.horaInicio ||
                  'Sin hora'}{' '}
                -{' '}
                {cita.horaFin ||
                  'Sin hora'}
              </Text>
            </View>

            <View
              style={styles.infoRow}
            >
              <Text
                style={
                  styles.infoLabel
                }
              >
                Cliente
              </Text>

              <Text
                style={
                  styles.infoValue
                }
              >
                {cita.cliente ||
                  'Sin cliente'}
              </Text>
            </View>

            <View
              style={
                styles.detailButton
              }
            >
              <PrimaryButton
                title="Ver detalle"
                onPress={() =>
                  navigation.navigate(
                    'DetalleCita',
                    {
                      cita,
                    },
                  )
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
    backgroundColor:
      colors.background,
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
    backgroundColor:
      colors.surface,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },

  filterActive: {
    backgroundColor:
      colors.primary,
    borderColor:
      colors.primary,
  },

  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color:
      colors.textSecondary,
  },

  filterTextActive: {
    color: colors.surface,
    fontWeight: '700',
  },

  card: {
    backgroundColor:
      colors.surface,
    borderRadius: 18,
    padding: spacing.lg,
    marginBottom: spacing.md,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent:
      'space-between',
    alignItems: 'flex-start',
  },

  petInfo: {
    flex: 1,
    paddingRight: spacing.sm,
  },

  petName: {
    fontSize: 22,
    fontWeight: '700',
    color:
      colors.textPrimary,
  },

  petBreed: {
    fontSize: 14,
    color:
      colors.textSecondary,
    marginTop: 3,
  },

  status: {
    alignItems: 'flex-end',
  },

  separator: {
    height: 1,
    backgroundColor:
      colors.border,
    marginVertical: spacing.md,
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent:
      'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },

  infoLabel: {
    fontSize: 13,
    fontWeight: '600',
    color:
      colors.textSecondary,
    marginRight: spacing.md,
  },

  infoValue: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color:
      colors.textPrimary,
    textAlign: 'right',
  },

  detailButton: {
    marginTop: spacing.md,
  },

  buttonContainer: {
    marginTop: spacing.lg,
  },

  emptyCard: {
    backgroundColor:
      colors.surface,
    borderRadius: 18,
    padding: spacing.xl,
    alignItems: 'center',
    elevation: 2,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color:
      colors.textPrimary,
  },

  emptyText: {
    fontSize: 14,
    color:
      colors.textSecondary,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
});