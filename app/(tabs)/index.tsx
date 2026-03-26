export default function MainEngine() {
 import { useTheme } from '@react-navigation/native';

const { colors } = useTheme();
  // ... логика стейтов

  return (
    <View style={{ flex: 1 }}> 
       {/* Весь твой UI (TopNav, ScrollView и т.д.) */}
       {/* ТУТ БОЛЬШЕ НЕТ BlurView и Image! Они уже подложены под этот экран в Layout */}
    </View>
  );
}