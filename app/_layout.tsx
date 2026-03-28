import { Stack } from 'expo-router';
import ThemeProvider, { useTheme } from './context';
import { useState, useEffect } from 'react';
import IntroScreen from '../components/IntroScreen';

function RootStack() {
  const { showIntro } = useTheme();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!showIntro) setIsReady(true);
  }, [showIntro]);

  if (showIntro && !isReady) {
    return <IntroScreen onFinish={() => setIsReady(true)} />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />

    </Stack>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <RootStack />
    </ThemeProvider>
  );
}