import { StyleSheet, Text, View, ScrollView } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

export default function HomeScreen({ navigation }) {
  // Datos temporales para visualizar la interfaz antes de conectar con Firebase
  const tareasHoy = [
    { id: '1', perro: 'Max', raza: 'Golden Retriever', servicio: 'Baño, secado y cepillado', hora: '08:00 AM' },
    { id: '2', perro: 'Luna', raza: 'Poodle', servicio: 'Corte de pelo y limpieza de oídos', hora: '10:30 AM' },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Hola, Omar 👋</Text>
        <Text style={styles.subtitle}>
          Tienes {tareasHoy.length} tareas asignadas para hoy
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Próximas Atenciones</Text>

      {tareasHoy.map((tarea) => (
        <View key={tarea.id} style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>{tarea.perro}</Text>
            <Text style={styles.timeText}>{tarea.hora}</Text>
          </View>

          <Text style={styles.cardText}>Raza: {tarea.raza}</Text>
          <Text style={styles.cardText}>Servicio: {tarea.servicio}</Text>

          <View style={styles.buttonContainer}>
            <PrimaryButton
              title="Registrar Atención"
              // Esto fallará temporalmente hasta que creemos la pantalla 'Historial' en el navegador
              onPress={() => navigation.navigate('Historial', { citaId: tarea.id, perro: tarea.perro })}
            />
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
  },
  header: {
    marginTop: spacing.xl,
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.md,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
  },
  timeText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.secondary || '#666',
  },
  cardText: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  buttonContainer: {
    marginTop: spacing.md,
  },
});