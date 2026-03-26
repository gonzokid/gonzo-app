import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import ThemeProvider, { useTheme } from './context';
import { useFonts, Oswald_700Bold, Oswald_400Regular } from '@expo-google-fonts/oswald';

function RootContent() {
  const { showIntro, muteIntro } = useTheme();
  const [isReady, setIsReady] = useState(false);
  const [fontsLoaded] = useFonts({ OswaldBold: Oswald_700Bold, OswaldReg: Oswald_400Regular });

  useEffect(() => {
    if (!showIntro) setIsReady(true);
  }, [showIntro]);

  if (!fontsLoaded) return null;

  if (!isReady && showIntro) {
    return (
      <View style={styles.container}>
        <Video
          source={require('../assets/intro.mp4')}
          style={styles.video}
          resizeMode={ResizeMode.COVER}
          shouldPlay
          isMuted={muteIntro}
          onPlaybackStatusUpdate={(s) => { if (s.isLoaded && s.didJustFinish) setIsReady(true); }}
          onError={() => setIsReady(true)}
        />
      </View>
    );
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
      <RootContent />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  video: { width: Dimensions.get('window').width, height: Dimensions.get('window').height },
});