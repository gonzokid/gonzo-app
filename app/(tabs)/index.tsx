import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  ActivityIndicator, FlatList, Image, StatusBar
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// --- КОНФИГ ГОНЗО-СТИЛЯ ---
const GONZO_COLORS = {
  bg: '#F5F5ED',      // Грязная бумага
  black: '#1A1A1A',   // Глубокий черный для границ
  magenta: '#FF0055', // Бешеный розовый
  acidGreen: '#CCFF00', // Кислотный лимон
  paperWhite: '#FFFFFF'
};

export default function Index() {
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(false);

  // Фейковые данные для теста
  const projects = [
    { id: '1', title: 'RAZOR SHARP SOLOS', desc: 'Записи из подвала. Громко. Плохо. Искренне.', type: 'ALBUM' },
    { id: '2', title: 'BAT COUNTRY BEATS', desc: 'Ритмы для поездки через пустыню.', type: 'SINGLE' },
  ];

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: GONZO_COLORS.bg }]}>
        <ActivityIndicator size="large" color={GONZO_COLORS.magenta} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: GONZO_COLORS.bg }}>
      <StatusBar barStyle="dark-content" />

      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 20,
          paddingBottom: insets.bottom + 100,
          paddingHorizontal: 20
        }}
      >
        {/* ЗАГОЛОВОК В СТИЛЕ ГАЗЕТНОЙ ВЫРЕЗКИ */}
        <View style={styles.headerBox}>
          <Text style={styles.mainTitle}>GXNZO / DAILY</Text>
          <View style={styles.divider} />
          <Text style={styles.subTitle}>МУЗЫКАЛЬНЫЙ ХАОС И ПОРТФОЛИО</Text>
        </View>

        {/* СПИСОК КАРТОЧЕК */}
        {projects.map((item) => (
          <TouchableOpacity key={item.id} style={styles.card} activeOpacity={0.9}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardType}>{item.type}</Text>
            </View>
            <View style={styles.cardBody}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardDesc}>{item.desc}</Text>
            </View>
            {/* Жесткая черная плашка внизу */}
            <View style={styles.cardFooter}>
              <Text style={styles.footerText}>ИЗМЕНИТЬ // EDIT</Text>
              <MaterialIcons name="edit" size={18} color={GONZO_COLORS.paperWhite} />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* КВАДРАТНАЯ КНОПКА ДОБАВЛЕНИЯ */}
      <TouchableOpacity
        style={[styles.fab, { bottom: insets.bottom + 20 }]}
        onPress={() => alert('ДОБАВИТЬ НОВЫЙ ХАОС?')}
      >
        <MaterialIcons name="add" size={40} color={GONZO_COLORS.black} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  headerBox: {
    marginBottom: 40,
    borderLeftWidth: 8,
    borderLeftColor: GONZO_COLORS.black,
    paddingLeft: 15,
  },
  mainTitle: {
    fontSize: 48,
    fontWeight: '900',
    color: GONZO_COLORS.black,
    letterSpacing: -2,
    lineHeight: 48,
  },
  subTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: GONZO_COLORS.magenta,
    marginTop: 5,
  },
  divider: {
    height: 4,
    backgroundColor: GONZO_COLORS.black,
    marginVertical: 5,
    width: '100%',
  },
  // БРУТАЛИСТСКАЯ КАРТОЧКА
  card: {
    backgroundColor: GONZO_COLORS.paperWhite,
    borderWidth: 4,
    borderColor: GONZO_COLORS.black,
    marginBottom: 30,
    // Тень без размытия (Neubrutalism)
    shadowColor: GONZO_COLORS.black,
    shadowOffset: { width: 8, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 5,
  },
  cardHeader: {
    backgroundColor: GONZO_COLORS.acidGreen,
    padding: 5,
    borderBottomWidth: 4,
    borderColor: GONZO_COLORS.black,
    alignItems: 'center',
  },
  cardType: {
    fontWeight: '900',
    fontSize: 12,
    letterSpacing: 2,
  },
  cardBody: {
    padding: 15,
  },
  cardTitle: {
    fontSize: 26,
    fontWeight: '900',
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  cardDesc: {
    fontSize: 16,
    lineHeight: 20,
    color: '#333',
    fontWeight: '500',
  },
  cardFooter: {
    backgroundColor: GONZO_COLORS.black,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerText: {
    color: GONZO_COLORS.paperWhite,
    fontWeight: 'bold',
    fontSize: 12,
  },
  fab: {
    position: 'absolute',
    right: 20,
    width: 70,
    height: 70,
    backgroundColor: GONZO_COLORS.acidGreen,
    borderWidth: 4,
    borderColor: GONZO_COLORS.black,
    justifyContent: 'center',
    alignItems: 'center',
    // Тень для кнопки
    shadowColor: GONZO_COLORS.black,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
  }
});