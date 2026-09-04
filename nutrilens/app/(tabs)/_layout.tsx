import { Tabs } from 'expo-router/js-tabs';
import { BottomNav } from '../../components/nav/BottomNav';
import { colors } from '../../theme';

/**
 * The four destinations from the mocks: Home, Discover, Routine, Profile.
 *
 * Home and Routine are designed screens ported from Stitch. Discover and
 * Profile have no mock — they are built from what the other screens already
 * point at (the "Learn more" cards, the profile avatar) and are marked as
 * undesigned on the screens themselves. They exist because the nav bar in both
 * mocks has four entries: shipping the bar with two of them missing changes the
 * design rather than implementing it.
 *
 * The bar itself is custom — see components/nav/BottomNav.
 */
export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <BottomNav {...props} />}
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: colors.surface },
      }}
    >
      <Tabs.Screen name="home" options={{ title: 'Home' }} />
      <Tabs.Screen name="discover" options={{ title: 'Discover' }} />
      <Tabs.Screen name="routine" options={{ title: 'Routine' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}
