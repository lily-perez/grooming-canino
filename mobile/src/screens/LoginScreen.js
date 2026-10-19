import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import PrimaryButton from '../components/PrimaryButton';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

export default function LoginScreen() {
  const { iniciarSesion } = useAuth();
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  const entrar = async () => {
    if (enviando) {
      return;
    }

    if (!correo.trim() || !contrasena) {
      setError('Ingresa tu correo y contraseña.');
      return;
    }

    setEnviando(true);
    setError('');

    try {
      await iniciarSesion(correo, contrasena);
    } catch (e) {
      setError(e.message);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Grooming Canino</Text>
      <Text style={styles.subtitle}>Inicia sesión como Groomer</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Correo</Text>
        <TextInput
          style={styles.input}
          value={correo}
          onChangeText={setCorreo}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          placeholder="correo@ejemplo.com"
          placeholderTextColor={colors.textSecondary}
        />

        <Text style={styles.label}>Contraseña</Text>
        <TextInput
          style={styles.input}
          value={contrasena}
          onChangeText={setContrasena}
          secureTextEntry
          autoCapitalize="none"
          placeholder="Tu contraseña"
          placeholderTextColor={colors.textSecondary}
        />

        {!!error && <Text style={styles.error}>{error}</Text>}

        <View style={styles.buttonContainer}>
          <PrimaryButton
            title={enviando ? 'Ingresando...' : 'Ingresar'}
            onPress={entrar}
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
    justifyContent: 'center',
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
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    marginTop: spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    fontSize: 15,
    color: colors.textPrimary,
    backgroundColor: colors.background,
  },
  error: {
    color: colors.danger,
    fontSize: 14,
    marginTop: spacing.md,
  },
  buttonContainer: {
    marginTop: spacing.lg,
  },
});