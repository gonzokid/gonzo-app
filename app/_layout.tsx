import { Tabs } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../context'; // ВНИМАНИЕ: проверь путь до context! Если layout в папке (tabs), то нужно выйти на два уровня вверх: ../../context или ../context в зависимости от твоей структуры.
import { Image } from 'expo-image';
import LottieView from 'lottie-react-native';
import { BlurView } from 'expo-blur';

export default function TabLayout() {
  const { theme } = useTheme();

  // Умная функция рендера фона
  const renderBackground = () => {
    // 1. Если есть Lottie
    if (theme.bgLottie) {
      return (
        <LottieView
          source={theme.bgLottie}
          autoPlay
          loop
          speed={0.6}
          style={StyleSheet.absoluteFillObject}
          resizeMode="cover"
        />
      );
    }

    // 2. Если есть картинка (из сети или из assets)
    if (theme.bgImg) {
      // expo-image умная: если это строка — делает uri, если локальный файл (require) — ест как есть
      const imageSource = typeof theme.bgImg === 'string' ? { uri: theme.bgImg } : theme.bgImg;
      return (
        <Image
          source={imageSource}
          style={StyleSheet.absoluteFillObject}
          contentFit="cover"
        />
      );
    }

    // 3. Если ничего нет — просто заливаем цветом
    return null;
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>

      {/* СЛОЙ 1: Наш глобальный фон (Лотти или Картинка) */}
      {renderBackground()}

      {/* СЛОЙ 2: Глобальный блюр, который накрывает всё */}
      <BlurView intensity={theme.bgLottie ? 30 : 50} tint="dark" style={StyleSheet.absoluteFillObject} />

      {/* СЛОЙ 3: Сами экраны (Они должны быть ПРОЗРАЧНЫМИ!) */}
      <Tabs screenOptions={{
        headerShown: false,
        tabBarStyle: { display: 'none' },
        // КРИТИЧЕСКИ ВАЖНО: без этой строчки табы зальют фон белым/черным цветом по умолчанию
        sceneContainerStyle: { backgroundColor: 'transparent' }
      }}>
        <Tabs.Screen name="index" />
        <Tabs.Screen name="projects" />
        <Tabs.Screen name="settings" />
      </Tabs>
    </View>
  );
}