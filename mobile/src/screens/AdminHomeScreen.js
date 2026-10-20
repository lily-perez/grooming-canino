import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import PrimaryButton from '../components/PrimaryButton';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

const ETIQUETA_ROL = {
  administrador: 'Administrador',
  groomer: 'Groomer',
};

export default function AdminHomeScreen() {
  const { usuario, cerrarSesion } = useAuth();
  const [cerrando, setCerrando] = useState(false);
  const rol = ETIQUETA_ROL[usuario?.rol] ?? usuario?.rol ?? 'Sin rol';

  const salir = async () => {
    if (cerrando) {
      return;
    }

    setCerrando(true);

    try {
      await cerrarSesion();
    } finally {
      setCerrando(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.kicker}>Sesión iniciada</Text>
      <Text style={styles.nombre}>{usuario?.nombre || 'Administrador'}</Text>
      <Text style={styles.correo}>{usuario?.correo || 'Sin correo'}</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Rol</Text>
        <Text style={styles.rol}>{rol}</Text>
      </View>

      <PrimaryButton
        title={cerrando ? 'Cerrando sesión...' : 'Cerrar sesión'}
        onPress={salir}
        disabled={cerrando}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
  },
  kicker: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  nombre: {
    marginTop: spacing.sm,
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  correo: {
    marginTop: spacing.xs,
    fontSize: 16,
    color: colors.textSecondary,
  },
  card: {
    marginTop: spacing.xl,
    marginBottom: spacing.xl,
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  rol: {
    marginTop: spacing.xs,
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
  },
});
