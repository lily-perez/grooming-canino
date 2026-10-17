import { StyleSheet, Text, View } from 'react-native';

import PrimaryButton from '../components/PrimaryButton';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inicio</Text>

      <Text style={styles.subtitle}>
        Bienvenida a Grooming Canino
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Módulos principales</Text>

        <Text style={styles.cardText}>
          Desde aquí el Groomer podrá acceder a sus citas, tareas,
          clientes e historial.
        </Text>

        <View style={styles.buttonContainer}>
          <PrimaryButton
            title="Ver citas"
            onPress={() => navigation.navigate('Citas')}
          />
          
          <View style={styles.spacer} />

          <PrimaryButton
            title="Clientes y Perros"
            onPress={() => navigation.navigate('Clientes')}
          />
        </View>

        <View style={styles.buttonContainer}>
          <PrimaryButton
            title="Mis tareas"
            onPress={() => navigation.navigate('Tareas')}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
    justify: 'center',
  },

  title: {
    fontSize: 30,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },

  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
  },

  card: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: spacing.lg,
    elevation: 3,
  },

  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: spacing.sm,
  },

  cardText: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.textSecondary,
  },

  buttonContainer: {
    marginTop: spacing.lg,
  },

  spacer: {
    height: spacing.md,
  },
});