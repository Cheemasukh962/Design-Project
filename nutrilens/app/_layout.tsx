import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from '@expo-google-fonts/inter';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { DeviceFrame } from '../components/ui/DeviceFrame';
import { CompanionProvider } from '../data/CompanionContext';
import { QuizProvider } from '../data/QuizContext';
import { RoutineProvider } from '../data/RoutineContext';
import { SavedProvider } from '../data/SavedContext';
import { colors } from '../theme';

// Hold the native splash until Inter is ready, so no screen renders in the
// system fallback face and then reflows.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    // Hide on error too — shipping in a fallback font beats a stuck splash.
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <QuizProvider>
        <SavedProvider>
        <RoutineProvider>
        {/* Companion sits inside Routine because it awards tokens for ticked
            items, and inside Quiz because the routine itself reads answers. */}
        <CompanionProvider>
        <StatusBar style="dark" />
        {/* Locks the browser build to a 393x852 canvas. Pass-through on native. */}
        <DeviceFrame>
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: colors.surface },
              animation: 'slide_from_right',
            }}
          />
        </DeviceFrame>
        </CompanionProvider>
        </RoutineProvider>
        </SavedProvider>
      </QuizProvider>
    </SafeAreaProvider>
  );
}
