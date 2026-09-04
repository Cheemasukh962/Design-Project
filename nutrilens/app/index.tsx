import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { VitoMascot } from '../components/brand/VitoMascot';
import { FoldText } from '../components/splash/FoldText';
import { Button } from '../components/ui/Button';
import { FooterLinks } from '../components/ui/FooterLinks';
import { Screen } from '../components/ui/Screen';
import { colors, spacing, typography } from '../theme';

/**
 * Splash / value screen.
 *
 * Source: Stitch screen "Splash Screen"
 * (projects/18215832420737560579/screens/ece95834a31446cab8385f46191e1c54)
 *
 * Two doors, deliberately unequal in weight. The guest path is plain text but
 * never greyed or hidden, and it sits with real spacing above the footer so it
 * does not read as fine print.
 */
export default function SplashRoute() {
  return (
    <Screen>
      {/* Mascot occupies the top ~45% and is the first thing to move. */}
      <View style={styles.mascotArea}>
        <VitoMascot pose="idle" size={200} float />
      </View>

      <View style={styles.content}>
        <FoldText style={styles.headline}>Improve your journey</FoldText>

        <Text style={styles.subhead}>Find the gaps in your diet in 60 seconds.</Text>

        <View style={styles.actions}>
          <Button
            label="Take the quiz"
            variant="primary"
            onPress={() => router.push('/quiz/q1')}
          />
          <Button
            label="Continue as guest"
            variant="tertiary"
            onPress={() => router.replace('/home')}
          />
        </View>

        <FooterLinks
          links={[{ label: 'Not medical advice' }, { label: 'How this works' }]}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  mascotArea: {
    // 397px of a 884px reference frame in the mock — 45%.
    flexBasis: '45%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingTop: spacing.stackLg,
    paddingBottom: spacing.stackLg,
  },
  headline: {
    ...typography.display,
    color: colors.primary,
    textAlign: 'center',
  },
  subhead: {
    ...typography.bodyLg,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    maxWidth: 280,
    marginTop: spacing.stackSm,
  },
  actions: {
    width: '100%',
    gap: spacing.stackMd,
    // Pushes the CTA pair to the bottom of the content area, as in the mock.
    marginTop: 'auto',
    marginBottom: spacing.stackLg,
  },
});
