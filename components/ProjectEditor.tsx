import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity,
  Modal, Alert, Image
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { useTheme } from '../app/context';
import DraggableFlatList from 'react-native-draggable-flatlist';

interface Track {
  id: string;
  title: string;
  duration?: string;
  isDone: boolean;
  order: number;
  lyrics?: string;
  beatUrl?: string;
}

interface Project {
  id: string;
  title: string;
  author?: string;
  releaseDate?: string;
  type: 'SINGLE' | 'EP' | 'ALBUM' | 'TEXT' | 'POEM' | 'BOOK' | 'PAINTING' | 'DESIGN' | 'COLLECTION';
  tab: 'МУЗЫКА' | 'ПИСЬМО' | 'АРТ';
  status: 'active' | 'done' | 'archived';
  createdAt: string;
  updatedAt: string;
  tracks?: Track[];
  notes?: string;
  coverImage?: string;
  lyrics?: string;
  beatUrl?: string;
}

interface ProjectEditorProps {
  visible: boolean;
  onClose: () => void;
  onSave: (project: Project) => void;
  project?: Project | null;
  tab: string;
  availableTypes: string[];
}

export default function ProjectEditor({
  visible,
  onClose,
  onSave,
  project,
  tab,
  availableTypes
}: ProjectEditorProps) {
  const { theme } = useTheme();
  const isEditing = !!project;

  // Основные поля
  const [title, setTitle] = useState(project?.title || '');
  const [type, setType] = useState(project?.type || availableTypes[0]);
  const [notes, setNotes] = useState(project?.notes || '');
  const [author, setAuthor] = useState(project?.author || '');
  const [releaseDate, setReleaseDate] = useState(project?.releaseDate || '');
  const [coverImage, setCoverImage] = useState(project?.coverImage || '');

  // Для сингла
  const [singleLyrics, setSingleLyrics] = useState(project?.lyrics || '');
  const [singleBeatUrl, setSingleBeatUrl] = useState(project?.beatUrl || '');

  // Треки
  const [tracks, setTracks] = useState<Track[]>(project?.tracks || []);
  const [showTrackModal, setShowTrackModal] = useState(false);
  const [editingTrack, setEditingTrack] = useState<Track | null>(null);
  const [trackTitle, setTrackTitle] = useState('');
  const [trackLyrics, setTrackLyrics] = useState('');
  const [trackBeatUrl, setTrackBeatUrl] = useState('');

  const isMusicProject = tab === 'МУЗЫКА';
  const isSingle = type === 'SINGLE';
  const isAlbumOrEp = type === 'ALBUM' || type === 'EP';

  // Выбор обложки
  const pickCoverImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: true,
      aspect: [1, 1]
    });
    if (!result.canceled) {
      setCoverImage(result.assets[0].uri);
    }
  };

  // Выбор бита для сингла
  const pickSingleBeat = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: 'audio/*',
      copyToCacheDirectory: true
    });
    if (!result.canceled) {
      setSingleBeatUrl(result.assets[0].uri);
    }
  };

  // Выбор бита для трека
  const pickTrackBeat = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: 'audio/*',
      copyToCacheDirectory: true
    });
    if (!result.canceled) {
      setTrackBeatUrl(result.assets[0].uri);
    }
  };

  const addTrack = () => {
    if (!trackTitle.trim()) return;
    const newTrack: Track = {
      id: Date.now().toString(),
      title: trackTitle,
      isDone: false,
      order: tracks.length,
      lyrics: trackLyrics || undefined,
      beatUrl: trackBeatUrl || undefined
    };
    setTracks([...tracks, newTrack]);
    resetTrackModal();
    setShowTrackModal(false);
  };

  const updateTrack = () => {
    if (!editingTrack || !trackTitle.trim()) return;
    const updatedTracks = tracks.map(t =>
      t.id === editingTrack.id ? {
        ...t,
        title: trackTitle,
        lyrics: trackLyrics || undefined,
        beatUrl: trackBeatUrl || undefined
      } : t
    );
    setTracks(updatedTracks);
    resetTrackModal();
    setShowTrackModal(false);
  };

  const deleteTrack = (trackId: string) => {
    Alert.alert('Удалить трек?', '', [
      { text: 'Отмена', style: 'cancel' },
      { text: 'Удалить', style: 'destructive', onPress: () => {
        const filtered = tracks.filter(t => t.id !== trackId);
        const reordered = filtered.map((t, idx) => ({ ...t, order: idx }));
        setTracks(reordered);
      }}
    ]);
  };

  const toggleTrackDone = (trackId: string) => {
    setTracks(tracks.map(t =>
      t.id === trackId ? { ...t, isDone: !t.isDone } : t
    ));
  };

  const onDragEnd = ({ data }: { data: Track[] }) => {
    const reordered = data.map((t, idx) => ({ ...t, order: idx }));
    setTracks(reordered);
  };

  const resetTrackModal = () => {
    setTrackTitle('');
    setTrackLyrics('');
    setTrackBeatUrl('');
    setEditingTrack(null);
  };

  const openTrackModal = (track?: Track) => {
    if (track) {
      setEditingTrack(track);
      setTrackTitle(track.title);
      setTrackLyrics(track.lyrics || '');
      setTrackBeatUrl(track.beatUrl || '');
    } else {
      resetTrackModal();
    }
    setShowTrackModal(true);
  };

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert('Ошибка', 'Название не может быть пустым');
      return;
    }

    const now = new Date().toISOString();

    const savedProject: Project = {
      id: project?.id || Date.now().toString(),
      title: title.trim(),
      type,
      tab,
      status: project?.status || 'active',
      createdAt: project?.createdAt || now,
      updatedAt: now,
      notes: notes.trim() || undefined,
      ...(author && { author: author.trim() }),
      ...(releaseDate && { releaseDate: releaseDate.trim() }),
      ...(coverImage && { coverImage }),
    };

    // Для музыки
    if (isMusicProject) {
      if (isSingle) {
        savedProject.lyrics = singleLyrics || undefined;
        savedProject.beatUrl = singleBeatUrl || undefined;
      }
      if (isAlbumOrEp && tracks.length > 0) {
        savedProject.tracks = tracks;
      }
    }

    onSave(savedProject);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setTitle('');
    setType(availableTypes[0]);
    setNotes('');
    setAuthor('');
    setReleaseDate('');
    setCoverImage('');
    setSingleLyrics('');
    setSingleBeatUrl('');
    setTracks([]);
    resetTrackModal();
  };

  React.useEffect(() => {
    if (project) {
      setTitle(project.title || '');
      setType(project.type || availableTypes[0]);
      setNotes(project.notes || '');
      setAuthor(project.author || '');
      setReleaseDate(project.releaseDate || '');
      setCoverImage(project.coverImage || '');
      setSingleLyrics(project.lyrics || '');
      setSingleBeatUrl(project.beatUrl || '');
      setTracks(project.tracks || []);
    }
  }, [project]);

  const renderTrackItem = ({ item, index, drag }: { item: Track; index: number; drag: () => void }) => (
    <View style={[styles.trackItem, { borderColor: theme.accent }]}>
      <TouchableOpacity onPressIn={drag} style={styles.dragHandle}>
        <MaterialIcons name="drag-handle" size={24} color={theme.accent} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => toggleTrackDone(item.id)} style={styles.trackLeft}>
        <MaterialIcons
          name={item.isDone ? 'check-circle' : 'radio-button-unchecked'}
          size={22}
          color={item.isDone ? theme.accent : '#666'}
        />
        <Text style={[styles.trackNumber, { color: theme.accent }]}>{index + 1}.</Text>
        <Text style={[styles.trackTitle, { color: theme.text }, item.isDone && styles.trackDone]}>
          {item.title}
        </Text>
      </TouchableOpacity>
      <View style={styles.trackActions}>
        <TouchableOpacity onPress={() => openTrackModal(item)}>
          <MaterialIcons name="edit" size={20} color={theme.accent} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => deleteTrack(item.id)}>
          <MaterialIcons name="delete-outline" size={20} color="#FF4444" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <BlurView intensity={100} tint="dark" style={styles.modalContainer}>
        <View style={[styles.modalContent, { backgroundColor: theme.card || '#1a1a1a' }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.accent }]}>
              {isEditing ? 'РЕДАКТИРОВАТЬ' : 'НОВЫЙ ПРОЕКТ'}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialIcons name="close" size={28} color={theme.text} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Тип */}
            <Text style={[styles.label, { color: theme.text }]}>ТИП</Text>
            <View style={styles.typeContainer}>
              {availableTypes.map(t => (
                <TouchableOpacity
                  key={t}
                  onPress={() => setType(t)}
                  style={[styles.typeBtn, { borderColor: theme.accent }, type === t && { backgroundColor: theme.accent }]}
                >
                  <Text style={[styles.typeText, { color: type === t ? '#000' : theme.accent }]}>{t}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Название */}
            <Text style={[styles.label, { color: theme.text }]}>НАЗВАНИЕ</Text>
            <TextInput
              style={[styles.input, { borderColor: theme.accent, color: theme.text }]}
              value={title}
              onChangeText={setTitle}
              placeholder="Введите название"
              placeholderTextColor="#666"
            />

            {/* Музыкальные поля */}
            {isMusicProject && (
              <>
                <Text style={[styles.label, { color: theme.text }]}>ИСПОЛНИТЕЛЬ</Text>
                <TextInput
                  style={[styles.input, { borderColor: theme.accent, color: theme.text }]}
                  value={author}
                  onChangeText={setAuthor}
                  placeholder="Имя исполнителя"
                  placeholderTextColor="#666"
                />
                <Text style={[styles.label, { color: theme.text }]}>ДАТА РЕЛИЗА</Text>
                <TextInput
                  style={[styles.input, { borderColor: theme.accent, color: theme.text }]}
                  value={releaseDate}
                  onChangeText={setReleaseDate}
                  placeholder="ГГГГ-ММ-ДД"
                  placeholderTextColor="#666"
                />
                <Text style={[styles.label, { color: theme.text }]}>ОБЛОЖКА</Text>
                <TouchableOpacity onPress={pickCoverImage} style={[styles.pickBtn, { borderColor: theme.accent }]}>
                  <MaterialIcons name="image" size={24} color={theme.accent} />
                  <Text style={{ color: theme.accent, marginLeft: 10 }}>ВЫБРАТЬ ОБЛОЖКУ</Text>
                </TouchableOpacity>
                {coverImage && (
                  <View style={styles.previewContainer}>
                    <Image source={{ uri: coverImage }} style={styles.coverPreview} />
                    <TouchableOpacity onPress={() => setCoverImage('')} style={styles.removePreview}>
                      <MaterialIcons name="close" size={20} color="#FF4444" />
                    </TouchableOpacity>
                  </View>
                )}
              </>
            )}

            {/* Для сингла — текст и бит */}
            {isMusicProject && isSingle && (
              <>
                <Text style={[styles.label, { color: theme.text }]}>ТЕКСТ ПЕСНИ</Text>
                <TextInput
                  style={[styles.textArea, { borderColor: theme.accent, color: theme.text }]}
                  value={singleLyrics}
                  onChangeText={setSingleLyrics}
                  placeholder="Текст песни..."
                  placeholderTextColor="#666"
                  multiline
                  numberOfLines={6}
                />
                <Text style={[styles.label, { color: theme.text }]}>БИТ</Text>
                <TouchableOpacity onPress={pickSingleBeat} style={[styles.pickBtn, { borderColor: theme.accent }]}>
                  <MaterialIcons name="audiotrack" size={20} color={theme.accent} />
                  <Text style={{ color: theme.accent, marginLeft: 8 }}>ВЫБРАТЬ БИТ</Text>
                </TouchableOpacity>
                {singleBeatUrl && (
                  <Text style={{ color: theme.accent, fontSize: 10, marginBottom: 10 }}>Файл выбран</Text>
                )}
              </>
            )}

            {/* Треки для альбомов и EP */}
            {isMusicProject && isAlbumOrEp && (
              <View style={styles.tracksSection}>
                <View style={styles.tracksHeader}>
                  <Text style={[styles.label, { color: theme.text }]}>ТРЕКЛИСТ</Text>
                  <TouchableOpacity onPress={() => openTrackModal()} style={styles.addTrackBtn}>
                    <MaterialIcons name="add" size={20} color={theme.accent} />
                    <Text style={{ color: theme.accent, fontSize: 12 }}>ДОБАВИТЬ</Text>
                  </TouchableOpacity>
                </View>

                {tracks.length === 0 ? (
                  <Text style={[styles.emptyText, { color: '#666' }]}>Нет треков. Нажмите + чтобы добавить</Text>
                ) : (
                  <DraggableFlatList
                    data={tracks}
                    keyExtractor={(item) => item.id}
                    onDragEnd={onDragEnd}
                    renderItem={renderTrackItem}
                    contentContainerStyle={{ paddingBottom: 10 }}
                  />
                )}
              </View>
            )}

            {/* Заметки */}
            <Text style={[styles.label, { color: theme.text }]}>ЗАМЕТКИ</Text>
            <TextInput
              style={[styles.textArea, { borderColor: theme.accent, color: theme.text }]}
              value={notes}
              onChangeText={setNotes}
              placeholder="Дополнительные заметки..."
              placeholderTextColor="#666"
              multiline
              numberOfLines={4}
            />

            <View style={styles.buttonsContainer}>
              <TouchableOpacity onPress={onClose} style={styles.cancelBtn}>
                <Text style={{ color: '#FF4444' }}>ОТМЕНА</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSave} style={[styles.saveBtn, { backgroundColor: theme.accent }]}>
                <Text style={{ color: '#000', fontWeight: 'bold' }}>{isEditing ? 'СОХРАНИТЬ' : 'СОЗДАТЬ'}</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

          {/* Модалка для трека */}
          <Modal visible={showTrackModal} transparent animationType="fade">
            <BlurView intensity={100} tint="dark" style={styles.trackModalContainer}>
              <View style={[styles.trackModalContent, { backgroundColor: theme.card || '#2a2a2a' }]}>
                <Text style={[styles.trackModalTitle, { color: theme.accent }]}>
                  {editingTrack ? 'РЕДАКТИРОВАТЬ ТРЕК' : 'НОВЫЙ ТРЕК'}
                </Text>
                <TextInput
                  style={[styles.trackInput, { borderColor: theme.accent, color: theme.text }]}
                  value={trackTitle}
                  onChangeText={setTrackTitle}
                  placeholder="Название трека"
                  placeholderTextColor="#666"
                  autoFocus
                />
                <TextInput
                  style={[styles.trackTextArea, { borderColor: theme.accent, color: theme.text }]}
                  value={trackLyrics}
                  onChangeText={setTrackLyrics}
                  placeholder="Текст песни (необязательно)"
                  placeholderTextColor="#666"
                  multiline
                  numberOfLines={4}
                />
                <TouchableOpacity onPress={pickTrackBeat} style={[styles.pickBeatBtn, { borderColor: theme.accent }]}>
                  <MaterialIcons name="audiotrack" size={20} color={theme.accent} />
                  <Text style={{ color: theme.accent, marginLeft: 8 }}>ВЫБРАТЬ БИТ</Text>
                </TouchableOpacity>
                {trackBeatUrl && (
                  <Text style={{ color: theme.accent, fontSize: 10, marginTop: 5 }}>Файл выбран</Text>
                )}
                <View style={styles.trackModalButtons}>
                  <TouchableOpacity onPress={() => setShowTrackModal(false)}>
                    <Text style={{ color: '#FF4444' }}>ОТМЕНА</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={editingTrack ? updateTrack : addTrack}>
                    <Text style={{ color: theme.accent, fontWeight: 'bold' }}>
                      {editingTrack ? 'ОБНОВИТЬ' : 'ДОБАВИТЬ'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </BlurView>
          </Modal>
        </View>
      </BlurView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: { flex: 1, justifyContent: 'center', padding: 20 },
  modalContent: { borderRadius: 20, padding: 20, maxHeight: '90%' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 24, fontFamily: 'OswaldBold' },
  label: { fontSize: 12, fontWeight: '600', marginTop: 15, marginBottom: 8, letterSpacing: 1 },
  input: { borderWidth: 1, borderRadius: 10, padding: 12, fontSize: 16 },
  textArea: { borderWidth: 1, borderRadius: 10, padding: 12, fontSize: 14, minHeight: 80, textAlignVertical: 'top' },
  typeContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  typeBtn: { borderWidth: 1, paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20 },
  typeText: { fontSize: 12, fontWeight: '600' },
  pickBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderStyle: 'dashed', borderRadius: 10, padding: 12, marginBottom: 10 },
  previewContainer: { position: 'relative', alignItems: 'center', marginBottom: 15 },
  coverPreview: { width: 100, height: 100, borderRadius: 10 },
  removePreview: { position: 'absolute', top: -8, right: -8, backgroundColor: 'rgba(0,0,0,0.7)', borderRadius: 12, padding: 2 },
  tracksSection: { marginTop: 20 },
  tracksHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  addTrackBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  trackItem: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 0.5, paddingVertical: 10, gap: 8 },
  dragHandle: { padding: 4 },
  trackLeft: { flexDirection: 'row', alignItems: 'center', flex: 1, gap: 8 },
  trackNumber: { fontSize: 14, fontWeight: '600', width: 25 },
  trackTitle: { fontSize: 14, flex: 1 },
  trackDone: { textDecorationLine: 'line-through', opacity: 0.5 },
  trackActions: { flexDirection: 'row', gap: 12 },
  emptyText: { textAlign: 'center', paddingVertical: 20, fontSize: 12 },
  buttonsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 30, marginBottom: 20, gap: 15 },
  cancelBtn: { flex: 1, paddingVertical: 12, borderRadius: 10, alignItems: 'center', borderWidth: 1, borderColor: '#FF4444' },
  saveBtn: { flex: 1, paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  trackModalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 30 },
  trackModalContent: { width: '100%', borderRadius: 20, padding: 20 },
  trackModalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  trackInput: { borderWidth: 1, borderRadius: 10, padding: 12, fontSize: 16, marginBottom: 12 },
  trackTextArea: { borderWidth: 1, borderRadius: 10, padding: 12, fontSize: 14, minHeight: 80, textAlignVertical: 'top', marginBottom: 12 },
  pickBeatBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderStyle: 'dashed', borderRadius: 10, padding: 12, marginBottom: 15 },
  trackModalButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
});