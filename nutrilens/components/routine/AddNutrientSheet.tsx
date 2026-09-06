import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { PillMark } from '../nutrient/PillMark';
import { Icon } from '../ui/Icon';
import { NUTRIENTS, pillFor } from '../../data/nutrients';
import { ALL_OPTIONS, useRoutine } from '../../data/RoutineContext';
import { useQuiz } from '../../data/QuizContext';
import { colors, radius, spacing, typography } from '../../theme';

type Props = {
  visible: boolean;
  onClose: () => void;
};

/**
 * Adding to the routine. Vitamins first; food and habits are an option.
 *
 * WHY THE SPLIT. Adding a nutrient used to drop every route it had into the
 * routine at once — a pill, a meal and a habit — so three vitamins produced a
 * nine-line checklist nobody had asked for, and trimming it meant deleting
 * rows one at a time. A routine is a short list of things you actually intend
 * to do, and for this product that is overwhelmingly supplements.
 *
 * The food routes are not deleted, because "food first" is a real position
 * this app holds and the nutrient pages argue for it. They are one section
 * down, added deliberately, one at a time.
 */
export function AddNutrientSheet({ visible, onClose }: Props) {
  const { picks, add, addOption } = useRoutine();
  const { answers } = useQuiz();
  const [showOther, setShowOther] = useState(false);

  const taken = (id: string) => picks.includes(id);
  const allowed = (o: (typeof ALL_OPTIONS)[number]) =>
    !o.excludedBy?.some((r) => answers.restrictions.includes(r));

  const supplements = ALL_OPTIONS.filter(
    (o) => o.type === 'supplement' && allowed(o) && !taken(o.id),
  );
  const other = ALL_OPTIONS.filter(
    (o) => o.type !== 'supplement' && allowed(o) && !taken(o.id),
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
      accessibilityViewIsModal
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Close"
        style={styles.scrim}
        onPress={onClose}
      />

      <View style={styles.sheet}>
        <View style={styles.grabber} />

        <View style={styles.head}>
          <Text style={styles.title} accessibilityRole="header">
            Add to your routine
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close"
            onPress={onClose}
            hitSlop={10}
          >
            <Icon name="remove" size={22} color={colors.onSurfaceVariant} />
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
          <Text style={styles.section}>Vitamins and supplements</Text>

          {supplements.length === 0 ? (
            <Text style={styles.empty}>Every supplement we cover is already in your routine.</Text>
          ) : (
            <View style={styles.stack}>
              {supplements.map((option) => {
                const nutrient = NUTRIENTS[option.nutrientId];
                return (
                  <Pressable
                    key={option.id}
                    accessibilityRole="button"
                    accessibilityLabel={`Add ${nutrient?.name ?? option.title}. ${option.title}.`}
                    onPress={() => {
                      add(option.nutrientId);
                      onClose();
                    }}
                    style={({ pressed }) => [styles.row, pressed && styles.pressed]}
                  >
                    <PillMark shape={pillFor(option.nutrientId)} size={40} />
                    <View style={styles.rowText}>
                      <Text style={styles.rowTitle}>{nutrient?.name ?? option.title}</Text>
                      <Text style={styles.rowBody} numberOfLines={2}>
                        {option.title} · {option.detail}
                      </Text>
                    </View>
                    <Icon name="add-circle" size={22} color={colors.aggieBlue} />
                  </Pressable>
                );
              })}
            </View>
          )}

          {/* Food and habits, one level down. Present because food first is a
              real position, optional because a checklist of meals is a
              different product. */}
          {other.length > 0 && (
            <>
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ expanded: showOther }}
                accessibilityLabel={`Food and habits, ${other.length} options`}
                onPress={() => setShowOther((o) => !o)}
                style={styles.moreHead}
              >
                <Text style={styles.section}>Food and habits</Text>
                <View style={showOther ? styles.chevronOpen : undefined}>
                  <Icon name="expand-more" size={22} color={colors.onSurfaceVariant} />
                </View>
              </Pressable>

              {showOther && (
                <View style={styles.stack}>
                  {other.map((option) => (
                    <Pressable
                      key={option.id}
                      accessibilityRole="button"
                      accessibilityLabel={`Add ${option.title}. ${option.detail}.`}
                      onPress={() => {
                        addOption(option.id);
                        onClose();
                      }}
                      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
                    >
                      <View style={styles.glyph}>
                        <Icon
                          name={option.type === 'habit' ? 'wb-sunny' : 'restaurant'}
                          size={18}
                          color={colors.aggieBlue}
                        />
                      </View>
                      <View style={styles.rowText}>
                        <Text style={styles.rowTitle}>{option.title}</Text>
                        <Text style={styles.rowBody}>
                          {NUTRIENTS[option.nutrientId]?.name} · {option.detail}
                        </Text>
                      </View>
                      <Icon name="add-circle" size={22} color={colors.aggieBlue} />
                    </Pressable>
                  ))}
                </View>
              )}
            </>
          )}
        </ScrollView>

        <Text style={styles.footnote}>
          One tap adds one line. Nothing is added that you did not pick.
        </Text>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  scrim: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(2,40,81,0.35)',
  },
  sheet: {
    marginTop: 'auto',
    maxHeight: '82%',
    paddingHorizontal: spacing.screenMargin,
    paddingBottom: spacing.stackLg,
    paddingTop: spacing.stackSm,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    backgroundColor: colors.surface,
    gap: spacing.stackSm,
  },
  grabber: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: radius.full,
    backgroundColor: colors.outlineVariant,
    marginBottom: spacing.stackSm,
  },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: { ...typography.h2, color: colors.aggieBlue },
  body: { paddingBottom: spacing.stackSm },
  section: {
    ...typography.micro,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: colors.onSurfaceVariant,
    marginTop: spacing.stackMd,
    marginBottom: spacing.stackSm,
  },
  moreHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  chevronOpen: { transform: [{ rotate: '180deg' }] },
  stack: { gap: spacing.stackSm },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.stackMd,
    padding: spacing.cardPaddingSm,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: colors.cardEdge,
  },
  glyph: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: { opacity: 0.9 },
  rowText: { flex: 1, gap: 2 },
  rowTitle: {
    ...typography.bodyMd,
    fontFamily: typography.h3.fontFamily,
    color: colors.onSurface,
  },
  rowBody: { ...typography.caption, color: colors.onSurfaceVariant },
  empty: { ...typography.caption, color: colors.onSurfaceVariant },
  footnote: { ...typography.caption, color: colors.outline },
});
