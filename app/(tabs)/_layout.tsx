import { Tabs } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../context';
import { Image } from 'expo-image';
import LottieView from 'lottie-react-native';
import { BlurView } from 'expo-blur';

export default function TabLayout() {
  const { theme } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>

      {/* Слой 1: Lottie */}
      {theme.bgLottie && (
        <LottieView
          source={theme.bgLottie}
          autoPlay
          loop
          style={StyleSheet.absoluteFillObject}
          resizeMode="cover"
        />
      )}

      {/* Слой 2: Картинка (URL или require) */}
      {theme.bgImg && !theme.bgLottie && (
        <Image
          source={typeof theme.bgImg === 'string' ? { uri: theme.bgImg } : theme.bgImg}
          style={StyleSheet.absoluteFillObject}
          contentFit="cover"
        />
      )}

      {/* Слой 3: Общий Блюр для всех вкладок */}
      <BlurView intensity={theme.bgLottie ? 30 : 50} tint="dark" style={StyleSheet.absoluteFillObject} />

      {/* Сами табы */}
      <Tabs screenOptions={{
        headerShown: false,
        tabBarStyle: { display: 'none' }, // Прячем нижнюю панель, раз у тебя кастомная навигация
        sceneContainerStyle: { backgroundColor: 'transparent' } // Стеклянный эффект
      }}>
        <Tabs.Screen name="index" />
        <Tabs.Screen name="projects" />
        <Tabs.Screen name="settings" />
      </Tabs>
    </View>
  );
}