import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Animated, Vibration } from 'react-native';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../context';

const GlitchTitle = ({ text, color }) => {
  const anim = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    const glitch = () => {
      Animated.sequence([
        Animated.timing(anim, { toValue: 1.1, duration: 50, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 1, duration: 100, useNativeDriver: true }),
      ]).start();
    };
    const interval = setInterval(glitch, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Animated.View style={{ transform: [{ scale: anim }], flexDirection: 'row', alignItems: 'center' }}>
      <FontAwesome5 name="skull-crossbones" size={26} color={color} style={{ marginRight: 10 }} />
      <Text style={[styles.logoText, { color, textShadowColor: color, textShadowRadius: 10 }]}>{text}</Text>
    </Animated.View>
  );
};

export default function MainEngine() {
  const router = useRouter();
  const { theme, t, saveProject } = useTheme();
  const [activeTab, setActiveTab] = useState('MUSIC');
  const [f1, setF1] = useState('');
  const [f2, setF2] = useState('');
  const [f3, setF3] = useState('');

  const handlePublish = () => {
    if (!f1) return;
    Vibration.vibrate(70);
    saveProject({ id: Date.now().toString(), type: activeTab, field1: f1, field2: f2, field3: f3, date: new Date().toLocaleDateString() });
    setF1(''); setF2(''); setF3('');
  };

  // Возвращаем просто View с flex: 1 (Фона и BlurView тут больше нет!)
  return (
    <View style={{ flex: 1 }}>
        <View style={styles.topNav}>
          <TouchableOpacity onPress={() => router.push('/projects')} style={[styles.navBtn, { borderColor: theme.accent }]}>
            <MaterialIcons name="menu" size={26} color={theme.accent} />
          </TouchableOpacity>
          <GlitchTitle text={t.mainTitle} color={theme.accent} />
          <TouchableOpacity onPress={() => router.push('/settings')} style={[styles.navBtn, { borderColor: theme.accent }]}>
            <MaterialIcons name="settings" size={26} color={theme.accent} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={{ padding: 20 }}>
          <View style={styles.tabs}>
            {['MUSIC', 'ART', 'WRITE'].map(tab => (
              <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)} style={[styles.tab, { backgroundColor: activeTab === tab ? theme.accent : 'transparent', borderColor: theme.accent }]}>
                <Text style={{ color: activeTab === tab ? '#000' : theme.text, fontFamily: 'OswaldBold' }}>{tab}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TextInput style={[styles.input, { color: theme.text, borderColor: theme.accent, backgroundColor: theme.card }]} placeholder={t.placeholder1} placeholderTextColor="#777" value={f1} onChangeText={setF1} />
          <TextInput style={[styles.input, { color: theme.text, borderColor: theme.accent, backgroundColor: theme.card }]} placeholder={t.placeholder2} placeholderTextColor="#777" value={f2} onChangeText={setF2} />
          <TextInput style={[styles.input, { color: theme.text, borderColor: theme.accent, backgroundColor: theme.card, height: 150 }]} placeholder={t.placeholder3} placeholderTextColor="#777" multiline value={f3} onChangeText={setF3} />
          <TouchableOpacity style={[styles.pubBtn, { backgroundColor: theme.accent }]} onPress={handlePublish}><Text style={styles.pubBtnText}>{t.publish}</Text></TouchableOpacity>
        </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  topNav: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 60, paddingHorizontal: 20, marginBottom: 20 },
  navBtn: { padding: 10, borderRadius: 10, borderWidth: 1 },
  logoText: { fontFamily: 'OswaldBold', fontSize: 24, letterSpacing: 2 },
  tabs: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  tab: { flex: 1, padding: 12, borderRadius: 8, borderWidth: 1, alignItems: 'center' },
  input: { fontFamily: 'OswaldReg', fontSize: 18, borderWidth: 1, borderRadius: 10, padding: 15, marginBottom: 15 },
  pubBtn: { padding: 20, borderRadius: 10, alignItems: 'center' },
  pubBtnText: { fontFamily: 'OswaldBold', fontSize: 22, color: '#000' }
});