import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '../context';
import { BlurView } from 'expo-blur';
import { MaterialIcons } from '@expo/vector-icons';
import ProjectEditor from '../../components/ProjectEditor';

export default function ProjectDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { theme, projects, saveProject } = useTheme();
  const [editorVisible, setEditorVisible] = useState(false);

  const project = projects.find(p => p.id === id);
  const isMusic = project?.tab === 'МУЗЫКА';
  const isAlbum = project?.type === 'ALBUM' || project?.type === 'EP';

  if (!project) {
    return (
      <View style={[styles.container, { backgroundColor: theme.bg }]}>
        <BlurView intensity={80} tint="dark" style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: theme.text, fontSize: 18 }}>Проект не найден</Text>
          <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 20 }}>
            <Text style={{ color: theme.accent }}>Вернуться назад</Text>
          </TouchableOpacity>
        </BlurView>
      </View>
    );
  }

  const toggleTrackDone = (trackId: string) => {
    const updatedTracks = project.tracks?.map(t =>
      t.id === trackId ? { ...t, isDone: !t.isDone } : t
    );
    saveProject({ ...project, tracks: updatedTracks });
  };

  const toggleProjectDone = () => {
    const newStatus = project.status === 'active' ? 'done' : 'active';
    saveProject({ ...project, status: newStatus });

    if (newStatus === 'done') {
      setTimeout(() => router.back(), 500);
    }
  };

  const deleteProject = () => {
    Alert.alert('Удалить проект?', 'Это действие нельзя отменить', [
      { text: 'Отмена', style: 'cancel' },
      { text: 'Удалить', style: 'destructive', onPress: () => {
        const updatedProjects = projects.filter(p => p.id !== project.id);
        // Сохраняем обновленный список
        const saveUpdated = async () => {
          await AsyncStorage.setItem('projects', JSON.stringify(updatedProjects));
        };
        saveUpdated();
        router.back();
      }}
    ]);
  };

  const completedTracks = project.tracks?.filter(t => t.isDone).length || 0;
  const totalTracks = project.tracks?.length || 0;

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      {/* Фон */}
      {theme.bgImg && (
        <Image
          source={typeof theme.bgImg === 'number' ? theme.bgImg : { uri: theme.bgImg }}
          style={StyleSheet.absoluteFillObject}
          resizeMode="cover"
        />
      )}

      <BlurView intensity={60} tint="dark" style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <MaterialIcons name="arrow-back" size={28} color={theme.accent} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.text }]} numberOfLines={1}>
            {project.title}
          </Text>
          <TouchableOpacity onPress={() => setEditorVisible(true)}>
            <MaterialIcons name="edit" size={24} color={theme.accent} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <View style={[styles.infoCard, { backgroundColor: theme.card, borderColor: theme.accent }]}>
            <Text style={[styles.type, { color: theme.accent }]}>{project.type}</Text>
            {project.author && (
              <Text style={[styles.author, { color: theme.accent }]}>Исполнитель: {project.author}</Text>
            )}
            <Text style={[styles.date, { color: '#888' }]}>
              Создан: {new Date(project.createdAt).toLocaleDateString()}
            </Text>
          </View>

          {isMusic && isAlbum && project.tracks && project.tracks.length > 0 && (
            <View style={styles.tracksSection}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                ТРЕКЛИСТ ({completedTracks}/{totalTracks})
              </Text>
              {project.tracks.map((track, index) => (
                <TouchableOpacity
                  key={track.id}
                  onPress={() => toggleTrackDone(track.id)}
                  style={[styles.trackItem, { borderColor: theme.accent }]}
                >
                  <View style={styles.trackLeft}>
                    <MaterialIcons
                      name={track.isDone ? 'check-circle' : 'radio-button-unchecked'}
                      size={22}
                      color={track.isDone ? theme.accent : '#666'}
                    />
                    <Text style={[styles.trackNumber, { color: theme.accent }]}>{index + 1}.</Text>
                    <Text style={[
                      styles.trackTitle,
                      { color: theme.text },
                      track.isDone && styles.trackDone
                    ]}>
                      {track.title}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {project.notes && (
            <View style={styles.notesSection}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>ЗАМЕТКИ</Text>
              <Text style={[styles.notesText, { color: '#aaa' }]}>{project.notes}</Text>
            </View>
          )}

          <View style={styles.actions}>
            <TouchableOpacity
              onPress={toggleProjectDone}
              style={[styles.actionBtn, { backgroundColor: project.status === 'active' ? theme.accent : '#4CAF50' }]}
            >
              <MaterialIcons
                name={project.status === 'active' ? 'check-circle' : 'undo'}
                size={20}
                color="#000"
              />
              <Text style={styles.actionText}>
                {project.status === 'active' ? 'ЗАВЕРШИТЬ' : 'ВЕРНУТЬ В РАБОТУ'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={deleteProject}
              style={[styles.actionBtn, { backgroundColor: '#FF4444' }]}
            >
              <MaterialIcons name="delete" size={20} color="#fff" />
              <Text style={[styles.actionText, { color: '#fff' }]}>УДАЛИТЬ</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </BlurView>

      <ProjectEditor
        visible={editorVisible}
        onClose={() => setEditorVisible(false)}
        onSave={saveProject}
        project={project}
        tab={project.tab}
        availableTypes={[]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTitle: { fontSize: 18, fontFamily: 'OswaldBold', flex: 1, textAlign: 'center' },
  content: { padding: 20 },
  infoCard: {
    padding: 20,
    borderRadius: 15,
    borderWidth: 1,
    marginBottom: 20,
  },
  type: { fontSize: 12, fontWeight: 'bold', marginBottom: 8 },
  author: { fontSize: 12, marginBottom: 8 },
  date: { fontSize: 10 },
  tracksSection: { marginBottom: 20 },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', marginBottom: 12, letterSpacing: 1 },
  trackItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    paddingVertical: 12,
  },
  trackLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  trackNumber: { fontSize: 14, fontWeight: '600', width: 28 },
  trackTitle: { fontSize: 14, flex: 1 },
  trackDone: { textDecorationLine: 'line-through', opacity: 0.5 },
  notesSection: { marginBottom: 20 },
  notesText: { fontSize: 14, lineHeight: 20 },
  actions: { gap: 12, marginTop: 20, marginBottom: 40 },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    padding: 14,
    borderRadius: 10,
  },
  actionText: { fontWeight: 'bold', fontSize: 14, color: '#000' },
});