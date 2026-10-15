import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.logo}>
        <Text style={styles.logoText}>🐾</Text>
      </View>

      <Text style={styles.title}>Grooming Canino</Text>

      <Text style={styles.subtitle}>
        Aplicación móvil para Groomers
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Inicio</Text>

        <Text style={styles.cardText}>
          Base móvil preparada para integrar los módulos del proyecto.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },

  logo: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },

  logoText: {
    fontSize: 42,
  },

  title: {
    fontSize: 28,
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
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: spacing.lg,
    alignItems: 'center',
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
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
});