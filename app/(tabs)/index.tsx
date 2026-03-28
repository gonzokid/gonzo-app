// app/(tabs)/index.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Vibration, ImageBackground, Image } from 'react-native';
import { useTheme } from '../context';
import { BlurView } from 'expo-blur';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import ProjectEditor from '../../components/ProjectEditor';

export default function GonzoEngine() {
  const { theme, projects, saveProject } = useTheme();
  const [activeTab, setActiveTab] = useState('МУЗЫКА');
  const [editorVisible, setEditorVisible] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const router = useRouter();

  const TABS = [
    { n: 'МУЗЫКА', i: 'audiotrack', types: ['SINGLE', 'EP', 'ALBUM'] },
    { n: 'ПИСЬМО', i: 'edit', types: ['TEXT', 'POEM', 'BOOK'] },
    { n: 'АРТ', i: 'palette', types: ['PAINTING', 'DESIGN', 'COLLECTION'] }
  ];

  const currentTab = TABS.find(t => t.n === activeTab);
  const activeProjects = projects.filter(p => p.tab === activeTab && p.status === 'active');

  const openEditor = (project = null) => {
    setEditingProject(project);
    setEditorVisible(true);
  };

  const handleSaveProject = (projectData) => {
    saveProject(projectData);
    Vibration.vibrate(100);
  };

  const openProjectDetail = (project) => {
    router.push({
      pathname: '../project/[id]',
      params: { id: project.id }
    });
  };

  const mutedColor = theme.mutedText || '#666';

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      {/* ФОН */}
      {theme.bgImg && (
        <ImageBackground
          source={typeof theme.bgImg === 'number' ? theme.bgImg : { uri: theme.bgImg }}
          style={StyleSheet.absoluteFillObject}
          resizeMode="cover"
        />
      )}

      <BlurView intensity={40} tint="dark" style={{ flex: 1 }}>
        <View style={styles.header}>
          <Text style={[styles.logo, { color: theme.accent }]}>GONZO LAB</Text>
          <TouchableOpacity onPress={() => router.push('/settings')}>
            <MaterialIcons name="tune" size={28} color={theme.accent} />
          </TouchableOpacity>
        </View>

        {/* Улучшенные табы */}
        <View style={styles.tabContainer}>
          {TABS.map(t => (
            <TouchableOpacity
              key={t.n}
              onPress={() => setActiveTab(t.n)}
              style={[
                styles.tab,
                activeTab === t.n && styles.tabActive
              ]}
            >
              <MaterialIcons
                name={t.i}
                size={18}
                color={activeTab === t.n ? theme.accent : '#888'}
              />
              <Text style={[
                styles.tabText,
                { color: activeTab === t.n ? theme.accent : '#888' }
              ]}>
                {t.n}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <ScrollView contentContainerStyle={{ padding: 16 }}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>АКТИВНЫЕ ПРОЦЕССЫ</Text>
            <TouchableOpacity onPress={() => openEditor()} style={[styles.addBtn, { backgroundColor: theme.accent }]}>
              <MaterialIcons name="add" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          {activeProjects.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={{ color: mutedColor, textAlign: 'center' }}>
                Нет активных проектов. Нажмите + чтобы создать
              </Text>
            </View>
          ) : (
            activeProjects.map(p => (
              <TouchableOpacity
                key={p.id}
                onPress={() => openProjectDetail(p)}
                onLongPress={() => openEditor(p)}
                style={[styles.card, { backgroundColor: theme.card, borderColor: theme.accent }]}
              >
                <View style={styles.cardContent}>
                  {p.coverImage ? (
                    <Image
                      source={{ uri: p.coverImage }}
                      style={styles.coverImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={[styles.coverPlaceholder, { backgroundColor: theme.accent + '20' }]}>
                      <MaterialIcons name="album" size={40} color={theme.accent} />
                    </View>
                  )}

                  <View style={styles.cardInfo}>
                    <View style={styles.cardHeader}>
                      <Text style={{ color: theme.accent, fontSize: 12, fontFamily: 'OswaldBold' }}>{p.type}</Text>
                      {p.releaseDate && (
                        <Text style={{ color: mutedColor, fontSize: 11 }}>
                          📅 {new Date(p.releaseDate).toLocaleDateString()}
                        </Text>
                      )}
                    </View>

                    <Text style={[styles.cardTitle, { color: theme.text }]} numberOfLines={1}>{p.title}</Text>

                    {p.author && (
                      <Text style={{ color: theme.accent, fontSize: 13, marginTop: 4 }}>{p.author}</Text>
                    )}

                    {p.tracks && (
                      <Text style={{ color: mutedColor, fontSize: 12, marginTop: 6 }}>
                        🎵 {p.tracks.filter(t => t.isDone).length}/{p.tracks.length} треков
                      </Text>
                    )}
                  </View>

                  <MaterialIcons name="chevron-right" size={32} color={theme.accent} style={styles.chevron} />
                </View>
              </TouchableOpacity>
            ))
          )}

          <TouchableOpacity onPress={() => router.push('/projects')} style={styles.vaultBtn}>
            <Text style={{ color: mutedColor, fontFamily: 'OswaldBold', opacity: 0.7 }}>
              ЗАВЕРШЕННЫЕ ШЕДЕВРЫ →
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </BlurView>

      <ProjectEditor
        visible={editorVisible}
        onClose={() => {
          setEditorVisible(false);
          setEditingProject(null);
        }}
        onSave={handleSaveProject}
        project={editingProject}
        tab={activeTab}
        availableTypes={currentTab?.types || []}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingTop: 60, paddingHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  logo: { fontSize: 24, fontFamily: 'OswaldBold' },
  tabContainer: {
    flexDirection: 'row',
    marginTop: 20,
    marginHorizontal: 16,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 30,
    padding: 4,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 25,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  tabActive: {
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  tabText: {
    fontSize: 14,
    fontFamily: 'OswaldBold',
    letterSpacing: 1,
  },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, marginTop: 20 },
  sectionTitle: { fontSize: 16, fontFamily: 'OswaldBold' },
  addBtn: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  card: { borderRadius: 20, borderWidth: 1, marginBottom: 14, overflow: 'hidden' },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
  },
  coverImage: {
    width: 85,
    height: 85,
    borderRadius: 14,
    marginRight: 16,
  },
  coverPlaceholder: {
    width: 85,
    height: 85,
    borderRadius: 14,
    marginRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardInfo: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  cardTitle: {
    fontSize: 20,
    fontFamily: 'OswaldBold',
  },
  chevron: {
    marginLeft: 12,
  },
  emptyState: { padding: 40, alignItems: 'center' },
  vaultBtn: { marginTop: 20, alignItems: 'center', paddingVertical: 20 },
});