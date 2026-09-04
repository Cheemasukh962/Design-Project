import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing } from '../../theme';
import { Icon } from './Icon';

type Props = {
  children: string;
};

/**
 * The gold educational note under a quiz answer.
 *
 * Gold, never red — a nutrition gap is an attention colour in this product, not
 * an error. This card explains what an answer implies; it never tells the user
 * something is wrong with them.
 */
export function InsightCard({ children }: Props) {
  return (
    <View style={styles.card} accessibilityRole="summary">
      <Icon name="lightbulb" size={20} color={colors.secondary} />
      <Text style={styles.text}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    padding: 14,
    borderRadius: radius.md,
    backgroundColor: '#FFF4D6',
    borderWidth: 1,
    borderColor: 'rgba(255,223,160,0.6)',
  },
  text: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: '#0F1720',
    fontFamily: 'Inter_400Regular',
  },
});
