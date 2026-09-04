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
import { QuizProvider } from '../data/QuizContext';
import { RoutineProvider } from '../data/RoutineContext';
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
        <RoutineProvider>
        <StatusBar style="dark" />
        <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.surface },
          animation: 'slide_from_right',
        }}
        />
        </RoutineProvider>
      </QuizProvider>
    </SafeAreaProvider>
  );
}
