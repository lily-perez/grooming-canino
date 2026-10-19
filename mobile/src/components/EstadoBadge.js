import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { ETIQUETA_ESTADO } from '../utils/formato';

const COLOR_POR_ESTADO = {
  pendiente: colors.pending,
  en_proceso: colors.inProgress,
  completada: colors.completed,
};

export default function EstadoBadge({ estado }) {
  const color = COLOR_POR_ESTADO[estado] ?? colors.textSecondary;

  return (
    <View style={[styles.badge, { backgroundColor: `${color}22` }]}>
      <Text style={[styles.text, { color }]}>
        {ETIQUETA_ESTADO[estado] ?? estado}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
  },
  text: {
    fontWeight: '700',
    fontSize: 13,
  },
});