import { Tabs } from 'expo-router';
import { View, StyleSheet, ImageBackground } from 'react-native';
import { useTheme } from '../context';
import LottieView from 'lottie-react-native';
import { BlurView } from 'expo-blur';

export default function TabLayout() {
  const { theme } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      {/* Lottie */}
      {theme.bgLottie && (
        <LottieView
          source={theme.bgLottie}
          autoPlay
          loop
          style={StyleSheet.absoluteFillObject}
          resizeMode="cover"
        />
      )}

      {/* Фон — гифки/картинки */}
      {!theme.bgLottie && theme.bgImg && (
        <ImageBackground
          source={typeof theme.bgImg === 'number' ? theme.bgImg : { uri: theme.bgImg }}
          style={StyleSheet.absoluteFillObject}
          resizeMode="cover"
        />
      )}

      {/* Блюр */}
      <BlurView
        intensity={theme.bgLottie ? 30 : 50}
        tint="dark"
        style={StyleSheet.absoluteFillObject}
      />

      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: { display: 'none' },
          sceneContainerStyle: { backgroundColor: 'transparent' }
        }}
      >
        <Tabs.Screen name="index" />
        <Tabs.Screen name="projects" />
        <Tabs.Screen name="settings" />
      </Tabs>
    </View>
  );
}