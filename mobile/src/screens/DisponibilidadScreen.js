import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import PrimaryButton from '../components/PrimaryButton';
import { useAuth } from '../context/AuthContext';
import { obtenerDisponibilidadGroomer } from '../services/disponibilidadFirestoreService';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

function formatearDia(diaSemana) {
  if (!diaSemana) {
    return 'Día no registrado';
  }

  const texto = String(diaSemana).trim();

  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

export default function DisponibilidadScreen({ navigation }) {
  const { uid } = useAuth();

  const [horarios, setHorarios] = useState([]);
  const [citas, setCitas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  const cargarDisponibilidad = useCallback(async () => {
    if (!uid) {
      setHorarios([]);
      setCitas([]);
      setError('No se identificó al groomer autenticado.');
      setCargando(false);
      return;
    }

    try {
      setError('');
      setCargando(true);

      const resultado =
        await obtenerDisponibilidadGroomer(uid);

      setHorarios(resultado.horarios ?? []);
      setCitas(resultado.citas ?? []);
    } catch (err) {
      console.error(
        'Error cargando disponibilidad desde Firestore:',
        err,
      );

      setError(
        err?.message ||
          'No se pudo consultar la disponibilidad desde Firestore.',
      );
    } finally {
      setCargando(false);
    }
  }, [uid]);

  useEffect(() => {
    cargarDisponibilidad();
  }, [cargarDisponibilidad]);

  const citasQueOcupanAgenda = useMemo(() => {
    return citas.filter((cita) => {
      const estado = String(
        cita.estado || '',
      ).toLowerCase();

      return estado !== 'cancelada' &&
        estado !== 'cancelado';
    });
  }, [citas]);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl
          refreshing={cargando}
          onRefresh={cargarDisponibilidad}
          colors={[colors.primary]}
        />
      }
    >
      <Text style={styles.title}>
        Mi disponibilidad
      </Text>

      <Text style={styles.subtitle}>
        Consulta tu horario laboral y las citas que
        ocupan tu agenda.
      </Text>

      {cargando ? (
        <View style={styles.emptyCard}>
          <ActivityIndicator
            color={colors.primary}
          />

          <Text style={styles.emptyText}>
            Cargando disponibilidad...
          </Text>
        </View>
      ) : error ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>
            No se pudo cargar
          </Text>

          <Text style={styles.emptyText}>
            {error}
          </Text>

          <View style={styles.buttonContainer}>
            <PrimaryButton
              title="Reintentar"
              onPress={cargarDisponibilidad}
            />
          </View>
        </View>
      ) : (
        <>
          <Text style={styles.sectionTitle}>
            Horario laboral
          </Text>

          {horarios.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyTitle}>
                Sin horario registrado
              </Text>

              <Text style={styles.emptyText}>
                No tienes horarios activos asociados
                a tu usuario.
              </Text>
            </View>
          ) : (
            horarios.map((horario) => (
              <View
                key={horario.id}
                style={styles.card}
              >
                <Text style={styles.day}>
                  {formatearDia(
                    horario.diaSemana,
                  )}
                </Text>

                <Text style={styles.label}>
                  Horario activo
                </Text>

                <Text style={styles.time}>
                  {horario.horaInicio ||
                    'Sin hora'}{' '}
                  -{' '}
                  {horario.horaFin ||
                    'Sin hora'}
                </Text>
              </View>
            ))
          )}

          <Text style={styles.sectionTitle}>
            Citas que ocupan agenda
          </Text>

          {citasQueOcupanAgenda.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyTitle}>
                Sin citas asignadas
              </Text>

              <Text style={styles.emptyText}>
                No tienes citas que ocupen tu agenda.
              </Text>
            </View>
          ) : (
            citasQueOcupanAgenda.map((cita) => (
              <View
                key={cita.id}
                style={styles.card}
              >
                <Text style={styles.date}>
                  {cita.fechaTexto ||
                    cita.fecha ||
                    'Sin fecha'}
                </Text>

                <Text style={styles.time}>
                  {cita.horaInicio ||
                    'Sin hora'}{' '}
                  -{' '}
                  {cita.horaFin ||
                    'Sin hora'}
                </Text>

                <Text style={styles.petName}>
                  {cita.perro ||
                    'Cita asignada'}
                </Text>

                <Text style={styles.secondaryText}>
                  {cita.cliente ||
                    'Sin cliente'}
                </Text>

                <View style={styles.occupiedBadge}>
                  <Text
                    style={styles.occupiedText}
                  >
                    Horario ocupado
                  </Text>
                </View>
              </View>
            ))
          )}
        </>
      )}

      <View style={styles.buttonContainer}>
        <PrimaryButton
          title="Regresar a citas"
          onPress={() => navigation.goBack()}
        />
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
  },

  subtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },

  card: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: spacing.lg,
    marginBottom: spacing.md,
    elevation: 3,
  },

  day: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
  },

  date: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },

  label: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: spacing.md,
  },

  time: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 4,
  },

  petName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: spacing.md,
  },

  secondaryText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },

  occupiedBadge: {
    alignSelf: 'flex-start',
    marginTop: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 12,
    backgroundColor: colors.background,
  },

  occupiedText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },

  emptyCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: spacing.xl,
    alignItems: 'center',
    elevation: 2,
    marginBottom: spacing.md,
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

  buttonContainer: {
    marginTop: spacing.lg,
  },
});