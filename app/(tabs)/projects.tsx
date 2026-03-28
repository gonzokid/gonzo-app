// app/(tabs)/projects.tsx
import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../context';
import { BlurView } from 'expo-blur';
import Psalter from '../../components/Psalter';

export default function Vault() {
  const router = useRouter();
  const { theme, projects } = useTheme();
  const doneProjects = projects.filter(p => p.status === 'done');

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <BlurView intensity={80} tint="dark" style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ padding: 20 }}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
              <MaterialIcons name="arrow-back" size={28} color={theme.accent} />
            </TouchableOpacity>
            <Text style={[styles.title, { color: theme.text }]}>ШЕДЕВРЫ</Text>
          </View>

          {doneProjects.length === 0 ? (
            <Text style={{ color: '#666', textAlign: 'center', marginVertical: 40 }}>Нет завершенных проектов</Text>
          ) : (
            <FlatList
              data={doneProjects}
              scrollEnabled={false}
              keyExtractor={item => item.id}
              contentContainerStyle={{ marginBottom: 20 }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => router.push(`/project/${item.id}`)}
                  style={[styles.card, { backgroundColor: theme.card, borderColor: theme.accent }]}
                >
                  <View>
                    <Text style={{ color: theme.accent, fontSize: 12 }}>{item.tab} / {item.type}</Text>
                    <Text style={[styles.cardTitle, { color: theme.text }]}>{item.title}</Text>
                    {item.tracks && (
                      <Text style={{ color: '#888', fontSize: 10 }}>
                        {item.tracks.filter(t => t.isDone).length}/{item.tracks.length} треков
                      </Text>
                    )}
                    <Text style={{ color: '#555', fontSize: 10, marginTop: 4 }}>
                      {new Date(item.createdAt).toLocaleDateString()}
                    </Text>
                  </View>
                  <MaterialIcons name="chevron-right" size={24} color={theme.accent} />
                </TouchableOpacity>
              )}
            />
          )}

          {/* ПСАЛТИРЬ */}
          <Text style={[styles.sectionTitle, { color: theme.accent, marginTop: 20 }]}>ПСАЛТИРЬ</Text>
          <Psalter theme={theme} />
        </ScrollView>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: 20, marginBottom: 20 },
  title: { fontSize: 32, fontFamily: 'OswaldBold' },
  sectionTitle: { fontSize: 20, fontFamily: 'OswaldBold', marginBottom: 15 },
  card: { padding: 20, borderRadius: 15, borderWidth: 1, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontSize: 18, fontFamily: 'OswaldBold', marginTop: 4 },
});