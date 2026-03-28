import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, TextInput, ImageBackground } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme, PALETTES } from '../context';
import { BlurView } from 'expo-blur';
import * as ImagePicker from 'expo-image-picker';

const PRESET_COLORS = ['#FF0055', '#00FF00', '#00F0FF', '#FFCC00', '#990000', '#FFFFFF', '#1A1A1A'];

export default function Settings() {
  const router = useRouter();
  const {
    theme, applyTheme, lang, setLang, t, showIntro, setShowIntro, muteIntro, setMuteIntro,
    introSelection, setIntroSelection, customDraft, setCustomDraft, savedThemes, saveNewCustomTheme, saveToStorage
  } = useTheme();
  const [name, setName] = useState('');

  const pickImage = async () => {
    let res = await ImagePicker.launchImageLibraryAsync({ quality: 1 });
    if (!res.canceled) setCustomDraft({...customDraft, bgImg: res.assets[0].uri});
  };

  const updateIntroMode = (val) => {
    setIntroSelection(val);
    saveToStorage('introSelection', val);
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      {theme.bgImg && (
        <ImageBackground
          source={typeof theme.bgImg === 'number' ? theme.bgImg : { uri: theme.bgImg }}
          style={StyleSheet.absoluteFillObject}
          resizeMode="cover"
        />
      )}

      <BlurView intensity={90} tint="dark" style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 60 }}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <MaterialIcons name="arrow-back" size={28} color={theme.accent} />
            </TouchableOpacity>
            <Text style={[styles.title, { color: theme.text }]}>{t.settings}</Text>
            <View style={{ width: 40 }} />
          </View>

          {/* ЯЗЫК */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>ЯЗЫК / ÆВЗАГ</Text>
            <View style={styles.langRow}>
              <TouchableOpacity
                onPress={() => setLang('RU')}
                style={[styles.langBtn, lang === 'RU' && { backgroundColor: theme.accent, borderColor: theme.accent }]}
              >
                <Text style={[styles.langText, { color: lang === 'RU' ? '#000' : theme.accent }]}>РУССКИЙ</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setLang('IR')}
                style={[styles.langBtn, lang === 'IR' && { backgroundColor: theme.accent, borderColor: theme.accent }]}
              >
                <Text style={[styles.langText, { color: lang === 'IR' ? '#000' : theme.accent }]}>ИРОН</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* ИНТРО */}
          <View style={styles.section}>
            <View style={styles.row}>
              <Text style={styles.label}>ПОКАЗЫВАТЬ ИНТРО</Text>
              <Switch value={showIntro} onValueChange={(v) => {setShowIntro(v); saveToStorage('showIntro', v.toString())}}/>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>БЕЗ ЗВУКА</Text>
              <Switch value={muteIntro} onValueChange={(v) => {setMuteIntro(v); saveToStorage('muteIntro', v.toString())}}/>
            </View>
            <Text style={styles.hint}>ВЫБОР ИНТРО:</Text>
            <View style={styles.row}>
              {['RANDOM', '0', '1', '2','3','4','5'].map((m) => (
                <TouchableOpacity key={m} onPress={() => updateIntroMode(m)} style={[styles.miniBtn, { borderColor: introSelection === m ? theme.accent : '#333' }]}>
                  <Text style={{ color: '#FFF', fontSize: 10 }}>{m === 'RANDOM' ? 'MIX' : `V${parseInt(m)+1}`}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* АЛХИМИЯ */}
          <Text style={styles.sectionTitle}>АЛХИМИЯ ТЕМЫ</Text>
          <View style={styles.alchemy}>
            <TextInput style={[styles.input, { borderColor: theme.accent, color: '#FFF' }]} placeholder="ИМЯ ТЕМЫ" placeholderTextColor="#444" onChangeText={setName} />
            <Text style={styles.hint}>ЦВЕТ АКЦЕНТА:</Text>
            <View style={styles.colorRow}>
              {PRESET_COLORS.map(c => (
                <TouchableOpacity key={c} onPress={() => setCustomDraft({...customDraft, accent: c})} style={[styles.colorDot, { backgroundColor: c, borderWidth: customDraft.accent === c ? 3 : 0, borderColor: '#FFF' }]} />
              ))}
            </View>
            <Text style={styles.hint}>ФОН ТЕМЫ:</Text>
            <View style={styles.colorRow}>
              {['#000000', '#1A1A1A', '#0D0D0D', '#F4F1EA', '#120021'].map(c => (
                <TouchableOpacity key={c} onPress={() => setCustomDraft({...customDraft, bg: c})} style={[styles.colorDot, { backgroundColor: c, borderWidth: customDraft.bg === c ? 2 : 0, borderColor: theme.accent }]} />
              ))}
            </View>
            <TouchableOpacity onPress={pickImage} style={styles.pickBtn}>
              <MaterialIcons name="image" size={20} color={theme.accent} />
              <Text style={{ color: theme.accent, marginLeft: 10 }}>ГИФКА / ФОН</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => saveNewCustomTheme(name)} style={[styles.saveBtn, { backgroundColor: theme.accent }]}>
              <Text style={{ fontWeight: 'bold' }}>СОХРАНИТЬ ВАЙБ</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionTitle}>ГОТОВЫЕ ВАЙБЫ</Text>
          <View style={styles.grid}>
            {[...Object.values(PALETTES), ...savedThemes].map(p => (
              <TouchableOpacity key={p.id} onPress={() => applyTheme(p)} style={[styles.box, { borderWidth: 2, borderColor: theme.id === p.id ? theme.accent : 'transparent' }]}>
                {p.bgImg && (
                  <ImageBackground
                    source={typeof p.bgImg === 'number' ? p.bgImg : { uri: p.bgImg }}
                    style={StyleSheet.absoluteFillObject}
                    resizeMode="cover"
                  />
                )}
                <Text style={{ color: p.accent, fontSize: 10, fontWeight: 'bold', backgroundColor: 'rgba(0,0,0,0.5)', paddingHorizontal: 4, borderRadius: 4 }}>
                  {p.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 },
  backBtn: { padding: 8 },
  title: { fontSize: 32, fontFamily: 'OswaldBold' },
  section: { marginBottom: 30, backgroundColor: 'rgba(0,0,0,0.3)', padding: 20, borderRadius: 15 },
  sectionLabel: { color: '#888', fontSize: 12, marginBottom: 15, letterSpacing: 1 },
  langRow: { flexDirection: 'row', gap: 15 },
  langBtn: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 25, borderWidth: 1, borderColor: '#666' },
  langText: { fontSize: 14, fontWeight: '600' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  label: { color: '#FFF', fontFamily: 'OswaldBold' },
  sectionTitle: { color: '#666', marginBottom: 15, fontFamily: 'OswaldBold' },
  alchemy: { padding: 20, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 15, marginBottom: 30 },
  input: { borderWidth: 1, padding: 12, borderRadius: 8, marginBottom: 15, color: '#FFF' },
  hint: { fontSize: 10, color: '#555', marginBottom: 10, textTransform: 'uppercase' },
  colorRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  colorDot: { width: 35, height: 35, borderRadius: 17.5 },
  pickBtn: { padding: 12, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', borderStyle: 'dashed', borderWidth: 1, borderColor: '#333', borderRadius: 10, marginBottom: 15 },
  saveBtn: { padding: 12, borderRadius: 10, alignItems: 'center' },
  miniBtn: { paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderRadius: 5 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 15 },
  box: { width: '47%', height: 70, borderRadius: 10, justifyContent: 'center', alignItems: 'center', overflow: 'hidden', position: 'relative', backgroundColor: 'rgba(0,0,0,0.3)' },
});