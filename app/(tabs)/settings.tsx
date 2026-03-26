import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, TextInput } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme, PALETTES } from '../context';
import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';

export default function SettingsScreen() {
  const router = useRouter();
  const { theme, applyTheme, lang, setLang, t, saveToStorage, showIntro, setShowIntro, muteIntro, setMuteIntro, customDraft, setCustomDraft, savedThemes, saveNewCustomTheme } = useTheme();
  const [newThemeName, setNewThemeName] = useState('');

  const pickBg = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 1 });
    if (!result.canceled) setCustomDraft({ ...customDraft, bgImg: result.assets[0].uri });
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      {theme.bgImg && <Image source={{ uri: theme.bgImg }} style={StyleSheet.absoluteFillObject} contentFit="cover" blurRadius={10} />}
      <BlurView intensity={80} tint="dark" style={{ flex: 1 }}>
        <View style={styles.header}>
           <TouchableOpacity onPress={() => router.back()} style={[styles.backBtn, {borderColor: theme.accent}]}><MaterialIcons name="arrow-back" size={28} color={theme.accent}/></TouchableOpacity>
           <Text style={[styles.title, { color: theme.text }]}>{t.settings}</Text>
        </View>

        <ScrollView contentContainerStyle={{ padding: 20 }}>
          {/* СИСТЕМНЫЕ НАСТРОЙКИ */}
          <View style={[styles.optionCard, { borderColor: theme.accent, backgroundColor: theme.card }]}>
            <View style={styles.row}>
              <Text style={styles.label}>{t.langLabel}</Text>
              <Switch value={lang === 'IR'} onValueChange={(v) => { const l = v ? 'IR' : 'RU'; setLang(l); saveToStorage('lang', l); }} trackColor={{ true: theme.accent }} />
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>{t.intro}</Text>
              <Switch value={showIntro} onValueChange={(v) => { setShowIntro(v); saveToStorage('showIntro', v.toString()); }} trackColor={{ true: theme.accent }} />
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>{t.muteIntro}</Text>
              <Switch value={muteIntro} onValueChange={(v) => { setMuteIntro(v); saveToStorage('muteIntro', v.toString()); }} trackColor={{ true: theme.accent }} />
            </View>
          </View>

          {/* КОНСТРУКТОР ТЕМ */}
          <Text style={styles.sectionTitle}>{t.custom}</Text>
          <View style={[styles.optionCard, { borderColor: theme.accent, backgroundColor: theme.card }]}>
            <TouchableOpacity style={styles.uploadBtn} onPress={pickBg}><Text style={{ color: theme.text, fontFamily: 'OswaldBold' }}>ВЫБРАТЬ ФОН</Text></TouchableOpacity>
            <TextInput style={[styles.input, { color: theme.text, borderColor: theme.text }]} placeholder="ИМЯ ТЕМЫ" placeholderTextColor="#666" value={newThemeName} onChangeText={setNewThemeName} />
            <TouchableOpacity style={[styles.saveBtn, { backgroundColor: theme.accent }]} onPress={() => { saveNewCustomTheme(newThemeName); setNewThemeName(''); }}><Text style={{ color: '#000', fontFamily: 'OswaldBold' }}>СОХРАНИТЬ</Text></TouchableOpacity>
          </View>

          {/* СЕТКА ТЕМ */}
          <Text style={styles.sectionTitle}>{t.themes}</Text>
          <View style={styles.themesGrid}>
            {[...savedThemes, ...Object.values(PALETTES)].map((p, i) => (
              <TouchableOpacity key={i} onPress={() => applyTheme(p)} style={[styles.themeCard, { borderColor: theme.id === p.id ? p.accent : 'transparent' }]}>
                {p.bgImg ? <Image source={{ uri: p.bgImg }} style={StyleSheet.absoluteFillObject} /> : <View style={{flex:1, backgroundColor: p.bg}} />}
                <View style={styles.themeOverlay} /><Text style={styles.themeName}>{p.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={{height: 60}} />
        </ScrollView>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', paddingTop: 60, paddingHorizontal: 20, marginBottom: 20, gap: 20 },
  backBtn: { padding: 8, borderRadius: 10, borderWidth: 1 },
  title: { fontFamily: 'OswaldBold', fontSize: 32 },
  sectionTitle: { fontFamily: 'OswaldBold', color: '#FFF', fontSize: 20, marginTop: 25, marginBottom: 15 },
  optionCard: { padding: 20, borderRadius: 15, borderWidth: 1 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10 },
  label: { color: '#FFF', fontFamily: 'OswaldBold', fontSize: 16 },
  uploadBtn: { padding: 15, borderWidth: 1, borderColor: '#FFF', borderRadius: 10, alignItems: 'center', marginBottom: 15, borderStyle: 'dashed' },
  input: { borderWidth: 1, borderRadius: 10, padding: 12, marginBottom: 15, fontFamily: 'OswaldReg' },
  saveBtn: { padding: 15, borderRadius: 10, alignItems: 'center' },
  themesGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  themeCard: { width: '48%', height: 90, borderRadius: 10, borderWidth: 2, marginBottom: 15, overflow: 'hidden', justifyContent: 'center', alignItems: 'center' },
  themeOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)' },
  themeName: { color: '#FFF', fontFamily: 'OswaldBold', fontSize: 12, textAlign: 'center', zIndex: 1 }
});