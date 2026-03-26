import { Tabs } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../context';
import { Image } from 'expo-image';
import LottieView from 'lottie-react-native';
import { BlurView } from 'expo-blur';

export default function TabLayout() {
  const { theme } = useTheme();

  const getImgSource = (src) => {
    if (!src) return null;
    return typeof src === 'string' ? { uri: src } : src;
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>

      {/* 1. Глобальный Lottie (если есть) */}
      {theme.bgLottie && (
        <LottieView
          source={theme.bgLottie}
          autoPlay
          loop
          speed={0.6}
          style={StyleSheet.absoluteFillObject}
          resizeMode="cover"
        />
      )}

      {/* 2. Глобальная Картинка/Гифка (если есть и нет Lottie) */}
      {theme.bgImg && !theme.bgLottie && (
        <Image
          source={getImgSource(theme.bgImg)}
          style={StyleSheet.absoluteFillObject}
          contentFit="cover"
        />
      )}

      {/* 3. Глобальный Блюр */}
      <BlurView intensity={theme.bgLottie ? 30 : 50} tint="dark" style={StyleSheet.absoluteFillObject} />

      {/* 4. Контейнеры экранов (Сделаны ПРОЗРАЧНЫМИ!) */}
      <Tabs screenOptions={{
        headerShown: false,
        tabBarStyle: { display: 'none' },
        sceneContainerStyle: { backgroundColor: 'transparent' } // ОЧЕНЬ ВАЖНО
      }}>
        <Tabs.Screen name="index" />
        <Tabs.Screen name="projects" />
        <Tabs.Screen name="settings" />
      </Tabs>
    </View>
  );
}