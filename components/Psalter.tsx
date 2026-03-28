import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Modal, ScrollView, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Quote {
  id: string;
  text: string;
  isUsed: boolean;
  usedIn?: string;
  createdAt: string;
}

export default function Psalter({ theme }: { theme: any }) {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newQuoteText, setNewQuoteText] = useState('');
  const [editingQuote, setEditingQuote] = useState<Quote | null>(null);
  const [usedInProject, setUsedInProject] = useState('');

  useEffect(() => {
    loadQuotes();
  }, []);

  const loadQuotes = async () => {
    const stored = await AsyncStorage.getItem('psalter_quotes');
    if (stored) setQuotes(JSON.parse(stored));
  };

  const saveQuotes = async (newQuotes: Quote[]) => {
    setQuotes(newQuotes);
    await AsyncStorage.setItem('psalter_quotes', JSON.stringify(newQuotes));
  };

  const addQuote = () => {
    if (!newQuoteText.trim()) return;
    const newQuote: Quote = {
      id: Date.now().toString(),
      text: newQuoteText.trim(),
      isUsed: false,
      createdAt: new Date().toISOString(),
    };
    saveQuotes([newQuote, ...quotes]);
    setNewQuoteText('');
    setModalVisible(false);
  };

  const updateQuote = () => {
    if (!editingQuote || !newQuoteText.trim()) return;
    const updatedQuotes = quotes.map(q =>
      q.id === editingQuote.id ? { ...q, text: newQuoteText.trim() } : q
    );
    saveQuotes(updatedQuotes);
    setNewQuoteText('');
    setEditingQuote(null);
    setModalVisible(false);
  };

  const deleteQuote = (id: string) => {
    saveQuotes(quotes.filter(q => q.id !== id));
  };

  const toggleUsed = (quote: Quote) => {
    const updated = quotes.map(q =>
      q.id === quote.id ? { ...q, isUsed: !q.isUsed, usedIn: !q.isUsed ? usedInProject : undefined } : q
    );
    saveQuotes(updated);
    setUsedInProject('');
  };

  const openEditModal = (quote: Quote) => {
    setEditingQuote(quote);
    setNewQuoteText(quote.text);
    setUsedInProject(quote.usedIn || '');
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.accent }]}>ПСАЛТИРЬ</Text>
        <TouchableOpacity onPress={() => { setEditingQuote(null); setNewQuoteText(''); setUsedInProject(''); setModalVisible(true); }} style={styles.addBtn}>
          <MaterialIcons name="add" size={24} color={theme.accent} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={quotes}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <View style={[styles.quoteCard, { backgroundColor: theme.card, borderColor: theme.accent }]}>
            <TouchableOpacity onPress={() => toggleUsed(item)} style={styles.checkbox}>
              <MaterialIcons
                name={item.isUsed ? 'check-box' : 'check-box-outline-blank'}
                size={24}
                color={item.isUsed ? theme.accent : '#666'}
              />
            </TouchableOpacity>
            <View style={styles.quoteContent}>
              <Text style={[styles.quoteText, { color: theme.text }]}>{item.text}</Text>
              {item.isUsed && item.usedIn && (
                <Text style={[styles.usedIn, { color: theme.accent }]}>Использовано в: {item.usedIn}</Text>
              )}
              <Text style={styles.date}>{new Date(item.createdAt).toLocaleDateString()}</Text>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity onPress={() => openEditModal(item)}>
                <MaterialIcons name="edit" size={20} color={theme.accent} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteQuote(item.id)}>
                <MaterialIcons name="delete-outline" size={20} color="#FF4444" />
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={[styles.emptyText, { color: '#666' }]}>Нет цитат. Нажмите + чтобы добавить</Text>
        }
      />

      <Modal visible={modalVisible} transparent animationType="slide">
        <BlurView intensity={100} tint="dark" style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            <Text style={[styles.modalTitle, { color: theme.accent }]}>
              {editingQuote ? 'РЕДАКТИРОВАТЬ ЦИТАТУ' : 'НОВАЯ ЦИТАТА'}
            </Text>
            <TextInput
              style={[styles.input, { borderColor: theme.accent, color: theme.text }]}
              value={newQuoteText}
              onChangeText={setNewQuoteText}
              placeholder="Текст цитаты"
              placeholderTextColor="#666"
              multiline
              numberOfLines={4}
            />
            {editingQuote && (
              <TextInput
                style={[styles.input, { borderColor: theme.accent, color: theme.text, marginTop: 10 }]}
                value={usedInProject}
                onChangeText={setUsedInProject}
                placeholder="Где использовано (необязательно)"
                placeholderTextColor="#666"
              />
            )}
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={{ color: '#FF4444' }}>ОТМЕНА</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={editingQuote ? updateQuote : addQuote}>
                <Text style={{ color: theme.accent, fontWeight: 'bold' }}>{editingQuote ? 'ОБНОВИТЬ' : 'ДОБАВИТЬ'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </BlurView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 24, fontFamily: 'OswaldBold' },
  addBtn: { padding: 8 },
  quoteCard: { flexDirection: 'row', padding: 15, borderRadius: 12, borderWidth: 1, marginBottom: 12, alignItems: 'center' },
  checkbox: { marginRight: 12 },
  quoteContent: { flex: 1 },
  quoteText: { fontSize: 14, lineHeight: 20 },
  usedIn: { fontSize: 11, marginTop: 6, fontStyle: 'italic' },
  date: { fontSize: 9, color: '#888', marginTop: 4 },
  actions: { flexDirection: 'row', gap: 12, marginLeft: 8 },
  emptyText: { textAlign: 'center', paddingVertical: 40 },
  modalContainer: { flex: 1, justifyContent: 'center', padding: 20 },
  modalContent: { borderRadius: 20, padding: 20 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
  input: { borderWidth: 1, borderRadius: 10, padding: 12, fontSize: 16, minHeight: 80, textAlignVertical: 'top' },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
});