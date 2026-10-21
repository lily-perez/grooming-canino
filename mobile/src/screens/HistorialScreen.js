import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, Alert, ActivityIndicator } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import { useTareas } from '../context/TareasContext';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { citasDesdeTareas, motivoNoFinalizar } from '../utils/vistasGroomer';

const CAMPOS = [
  { clave: 'ojos', etiqueta: 'Ojos' },
  { clave: 'oidos', etiqueta: 'Oídos' },
  { clave: 'dientes', etiqueta: 'Dientes' },
  { clave: 'pelaje', etiqueta: 'Pelaje' },
  { clave: 'comportamiento', etiqueta: 'Comportamiento' },
  { clave: 'unas', etiqueta: 'Uñas' },
  { clave: 'puntualidad', etiqueta: 'Puntualidad' },
  { clave: 'observaciones', etiqueta: 'Observaciones' },
];

export default function HistorialScreen({ route, navigation }) {
  const { citaId } = route.params ?? {};
  const { tareas, finalizarCita } = useTareas();
  const cita = useMemo(
    () => citasDesdeTareas(tareas).find((item) => item.id === String(citaId)),
    [tareas, citaId],
  );
  const bloqueo = motivoNoFinalizar(cita);
  const [valores, setValores] = useState(() =>
    Object.fromEntries(CAMPOS.map((campo) => [campo.clave, ''])),
  );
  const [guardando, setGuardando] = useState(false);
  const perro = cita?.perro || 'Sin nombre';

  const cambiar = (clave, texto) => {
    setValores((prev) => ({ ...prev, [clave]: texto }));
  };

  const handleGuardar = async () => {
    const motivo = motivoNoFinalizar(cita);

    if (motivo || guardando) {
      if (motivo) {
        Alert.alert('No se puede finalizar', motivo);
      }
      return;
    }

    setGuardando(true);

    try {
      await finalizarCita(cita.id, valores);
      Alert.alert(
        'Cita finalizada',
        `La cita de ${perro} quedó completada.`,
        [{ text: 'OK', onPress: () => navigation.goBack() }],
      );
    } catch (error) {
      Alert.alert('No se pudo finalizar', error.message);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Registro de atención</Text>
      <Text style={styles.subtitle}>Evaluación para {perro}</Text>

      {bloqueo ? (
        <Text style={styles.aviso}>{bloqueo}</Text>
      ) : (
        <Text style={styles.aviso}>
          La cita está en proceso y sus tareas están completadas.
        </Text>
      )}

      {CAMPOS.map((campo) => (
        <View key={campo.clave} style={styles.formGroup}>
          <Text style={styles.label}>{campo.etiqueta}</Text>
          <TextInput
            style={[styles.input, campo.clave === 'observaciones' && styles.textArea]}
            value={valores[campo.clave]}
            onChangeText={(texto) => cambiar(campo.clave, texto)}
            placeholder={campo.etiqueta}
            multiline={campo.clave === 'observaciones'}
            numberOfLines={campo.clave === 'observaciones' ? 4 : 1}
          />
        </View>
      ))}

      <View style={styles.formGroup}>
        <Text style={styles.label}>Fotografía</Text>
        <Text style={styles.aviso}>
          La finalización de la cita no tiene un endpoint para imágenes. La fotografía queda deshabilitada y no se guarda.
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        {guardando ? (
          <ActivityIndicator size="large" color={colors.primary} />
        ) : (
          <PrimaryButton
            title="Finalizar cita"
            onPress={handleGuardar}
            disabled={Boolean(bloqueo)}
          />
        )}
      </View>
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.lg },
  title: { fontSize: 24, fontWeight: '700', color: colors.primary, marginBottom: spacing.xs },
  subtitle: { fontSize: 16, color: colors.textSecondary, marginBottom: spacing.md },
  aviso: { fontSize: 14, color: colors.textSecondary, marginBottom: spacing.md },
  formGroup: { marginBottom: spacing.md },
  label: { fontSize: 16, fontWeight: '600', color: colors.textPrimary, marginBottom: spacing.xs },
  input: { backgroundColor: colors.surface, borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 8, padding: spacing.md, fontSize: 15, marginBottom: spacing.sm, color: colors.textPrimary },
  textArea: { height: 100, textAlignVertical: 'top' },
  buttonContainer: { marginTop: spacing.md, marginBottom: spacing.xl },
});
