import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Share } from 'react-native';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../context';
import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';

export default function ProjectsArchive() {
  const router = useRouter();
  const { theme, projects, deleteProject } = useTheme();

  const confirmDelete = (id: string) => {
    Alert.alert("УДАЛИТЬ?", "Эта работа исчезнет навсегда. Уверен?", [
      { text: "ОТМЕНА", style: "cancel" },
      { text: "ДА, СЖЕЧЬ", onPress: () => deleteProject(id), style: "destructive" }
    ]);
  };

  const shareProject = async (item: any) => {
    try {
      await Share.share({
        message: `[GONZO LAB - ${item.type}]\n${item.field1}\n${item.field2}\n${item.field3}\nДата: ${item.date}`,
      });
    } catch (e) { console.log(e); }
  };

  const renderItem = ({ item }: { item: any }) => (
    <BlurView intensity={80} tint="dark" style={[styles.card, { borderColor: theme.accent }]}>
      <View style={styles.cardHeader}>
        <View style={styles.typeTag}>
          <FontAwesome5 name={item.type === 'MUSIC' ? 'compact-disc' : item.type === 'ART' ? 'palette' : 'pen-nib'} size={14} color={theme.accent} />
          <Text style={[styles.typeText, { color: theme.accent }]}>{item.type}</Text>
        </View>
        <Text style={[styles.dateText, { color: theme.text }]}>{item.date}</Text>
      </View>

      <View style={styles.contentRow}>
        {item.cover && (
          <Image source={{ uri: item.cover }} style={styles.miniCover} contentFit="cover" />
        )}
        <View style={styles.infoCol}>
          <Text style={[styles.title, { color: theme.text }]} numberOfLines={1}>{item.field1}</Text>
          <Text style={[styles.subtitle, { color: theme.accent }]} numberOfLines={1}>{item.field2}</Text>
        </View>
      </View>

      <Text style={[styles.desc, { color: theme.text }]} numberOfLines={3}>{item.field3}</Text>

      <View style={styles.actions}>
        <TouchableOpacity onPress={() => router.push({ pathname: '/', params: { editId: item.id } })} style={styles.actionBtn}>
          <MaterialIcons name="edit" size={22} color={theme.accent} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => shareProject(item)} style={styles.actionBtn}>
          <MaterialIcons name="share" size={22} color={theme.accent} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => confirmDelete(item.id)} style={styles.actionBtn}>
          <MaterialIcons name="delete-forever" size={22} color="#FF4444" />
        </TouchableOpacity>
      </View>
    </BlurView>
  );

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      {theme.bgImg && (
        <Image source={{ uri: theme.bgImg }} style={StyleSheet.absoluteFillObject} contentFit="cover" transition={500} />
      )}

      <BlurView intensity={40} tint="dark" style={{ flex: 1 }}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={[styles.backBtn, { borderColor: theme.accent, backgroundColor: theme.card }]}>
            <MaterialIcons name="arrow-back" size={28} color={theme.accent} />
          </TouchableOpacity>
          <Text style={[styles.header, { color: theme.text, textShadowColor: theme.accent, textShadowRadius: 10 }]}>АРХИВ</Text>
        </View>

        {projects.length === 0 ? (
          <View style={styles.emptyState}>
            <FontAwesome5 name="folder-open" size={60} color={theme.accent} style={{ opacity: 0.5 }} />
            <Text style={[styles.emptyText, { color: theme.text }]}>ЗДЕСЬ ПОКА ПУСТО...</Text>
            <TouchableOpacity style={[styles.startBtn, { backgroundColor: theme.accent }]} onPress={() => router.push('/')}>
              <Text style={styles.startBtnText}>СОЗДАТЬ ШЕДЕВР</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={projects}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
          />
        )}
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: { flexDirection: 'row', alignItems: 'center', paddingTop: 60, paddingHorizontal: 20, marginBottom: 20 },
  backBtn: { padding: 8, borderRadius: 10, borderWidth: 2, marginRight: 15 },
  header: { fontFamily: 'OswaldBold', fontSize: 36, letterSpacing: 2 },
  card: { borderRadius: 16, borderWidth: 2, marginBottom: 15, padding: 15, overflow: 'hidden' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  typeTag: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  typeText: { fontFamily: 'OswaldBold', fontSize: 12, marginLeft: 6, letterSpacing: 1 },
  dateText: { fontFamily: 'OswaldReg', fontSize: 12, opacity: 0.7 },
  contentRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  miniCover: { width: 60, height: 60, borderRadius: 8, marginRight: 15, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  infoCol: { flex: 1 },
  title: { fontFamily: 'OswaldBold', fontSize: 20, marginBottom: 2 },
  subtitle: { fontFamily: 'OswaldReg', fontSize: 16, textTransform: 'uppercase' },
  desc: { fontFamily: 'OswaldReg', fontSize: 14, lineHeight: 20, marginBottom: 15, opacity: 0.9 },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)', paddingTop: 10, gap: 15 },
  actionBtn: { padding: 5 },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingBottom: 100 },
  emptyText: { fontFamily: 'OswaldBold', fontSize: 20, marginTop: 20, letterSpacing: 2 },
  startBtn: { marginTop: 20, paddingHorizontal: 30, paddingVertical: 15, borderRadius: 8 },
  startBtnText: { fontFamily: 'OswaldBold', color: '#000', fontSize: 16 }
});