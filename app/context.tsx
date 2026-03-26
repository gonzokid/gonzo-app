import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'expo-image'; // А не из 'react-native'

export const STRINGS = {
  RU: {
    mainTitle: 'ГОНЗО ЛАБ', settings: 'ПУЛЬТ', publish: 'СОХРАНИТЬ ШЕДЕВР',
    langName: 'РУССКИЙ', themes: 'АРХИВ ВАЙБОВ', custom: 'АЛХИМИЯ ТЕМ',
    intro: 'ПОКАЗЫВАТЬ ИНТРО', muteIntro: 'БЕЗ ЗВУКА В ИНТРО', langLabel: 'ЯЗЫК / ÆВЗАГ',
    musicTypes: ['СИНГЛ', 'EP', 'АЛЬБОМ'], writeTypes: ['ТЕКСТ', 'СТИХ', 'КНИГА', 'СБОРНИК', 'ПСАЛТИРЬ (ЦИТАТА)'], artTypes: ['КАРТИНА', 'КОЛЛЕКЦИЯ', 'ВЫСТАВКА', 'ДИЗАЙН-КОНЦЕПТ']
  },
  IR: {
    mainTitle: 'ГОНЗО ЛАБ', settings: 'УАЙРÆДТÆ', publish: 'БÆРÆГ КÆНЫН',
    langName: 'ИРОН', themes: 'ÆМБÆРЦТÆ', custom: 'АРÆЗТ ТЕМÆТÆ',
    intro: 'ИНТРО ÆВДИСЫН', muteIntro: 'ИНТРО ÆНÆ ХЪÆЛÆС', langLabel: 'ÆВЗАГ / ЯЗЫК',
    musicTypes: ['ЗАРАГ', 'EP', 'АЛЬБОМ'], writeTypes: ['ТЕКСТ', 'ÆМДЗÆВГÆ', 'ЧИНЫГ', 'ÆМБЫРДГОНД', 'ЦИТАТÆ'], artTypes: ['НЫВ', 'КОЛЛЕКЦИ', 'РАВдыст', 'ДИЗАЙН']
  }
};
// В твоем файле с темами

// Твои темы оставляем как были, я сократил код для читаемости, вставь свои PALETTES сюда:
export const PALETTES = {

  GONZO: { id: 'GONZO', name: 'GONZO (ХАОС)', bg: '#000', accent: '#2E8B57', text: '#FFF', card: 'rgba(20,0,10,0.8)', bgImg: 'https://media.giphy.com/media/l41YcWb5tEwB8AovG/giphy.gif',bgLottie:null },
  ABYSS: { id: 'ABYSS', name: 'БЕЗДНА', bg: '#000', accent: '#2E8B57', text: '#FFF', card: 'rgba(20,0,10,0.8)', bgImg: require('../assets/0313.gif),bgLottie:null },
  GRADIENT: { id: 'GRADIENT', name: 'GRADIENT', bg: '#000', accent: '#2E8B57', text: '#FFF', card: 'rgba(20,0,10,0.8)', bgImg:null, bgLottie: require('../assets/animations/Gradient Animated Background.json')},
  MATRIX: { id: 'MATRIX', name: 'MATRIX', bg: '#000', accent: '#00FF41', text: '#00FF41', card: 'rgba(0,20,0,0.8)', bgImg: 'https://media.giphy.com/media/oWjyixDbWuAk8/giphy.gif' },
  PITCH: { id: 'PITCH', name: 'BLACK', bg: '#000', accent: '#FFF', text: '#CCC', card: '#111', bgImg: null },
};

const ThemeContext = createContext(null);

export default function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(PALETTES.GONZO);
  const [lang, setLang] = useState('RU');
  const [showIntro, setShowIntro] = useState(true);
  const [muteIntro, setMuteIntro] = useState(false);
  const [projects, setProjects] = useState([]);
  const [savedThemes, setSavedThemes] = useState([]);
  const [customDraft, setCustomDraft] = useState({ id: 'DRAFT', name: 'DRAFT', bg: '#000', accent: '#00FF00', text: '#FFF', card: 'rgba(0,0,0,0.7)', bgImg: null });

  const t = STRINGS[lang] || STRINGS.RU;

  useEffect(() => {
    const load = async () => {
      try {
        const sTheme = await AsyncStorage.getItem('theme');
        const sLang = await AsyncStorage.getItem('lang');
        const sIntro = await AsyncStorage.getItem('showIntro');
        const sMute = await AsyncStorage.getItem('muteIntro');
        const sProjects = await AsyncStorage.getItem('projects');
        const sSaved = await AsyncStorage.getItem('savedThemes');

        if (sTheme) setTheme(JSON.parse(sTheme));
        if (sLang) setLang(sLang);
        if (sIntro !== null) setShowIntro(sIntro === 'true');
        if (sMute !== null) setMuteIntro(sMute === 'true');
        if (sProjects) setProjects(JSON.parse(sProjects));
        if (sSaved) setSavedThemes(JSON.parse(sSaved));
      } catch (e) { console.log(e); }
    };
    load();
  }, []);

  const saveToStorage = async (key, val) => {
    await AsyncStorage.setItem(key, typeof val === 'string' ? val : JSON.stringify(val));
  };

  const applyTheme = (nt) => { setTheme(nt); saveToStorage('theme', nt); };

  const saveNewCustomTheme = (name) => {
    const newT = { ...customDraft, id: 'CUST_' + Date.now(), name: name || 'MY VIBE' };
    const updated = [newT, ...savedThemes];
    setSavedThemes(updated); saveToStorage('savedThemes', updated); applyTheme(newT);
  };

  // CRUD для проектов
  const saveProject = (p) => {
    let n;
    if (projects.find(x => x.id === p.id)) {
      n = projects.map(x => x.id === p.id ? p : x); // Обновление
    } else {
      n = [p, ...projects]; // Создание
    }
    setProjects(n); saveToStorage('projects', n);
  };

  const deleteProject = (id) => {
    const n = projects.filter(x => x.id !== id);
    setProjects(n); saveToStorage('projects', n);
  };

  // ГОНЗО-ГЕНЕРАТОР ИДЕЙ (От души)
  const getRandomIdea = (tab) => {
    const ideas = {
      MUSIC: ["Симфония из звуков ломающихся костей и драм-машины 808.", "Кантри-альбом о кибернетическом Иисусе.", "Сингл, где бас звучит как работающий холодильник в 3 часа ночи."],
      WRITE: ["Эссе о том, почему летучие мыши лучше политиков.", "Стихотворение, написанное от лица сгоревшего тостера.", "Книга, где главный герой — это паранойя автора."],
      ART: ["Картина, нарисованная кофе и пеплом.", "Выставка пустых рамок с названиями твоих страхов.", "Дизайн-концепт упаковки для таблеток от бессмертия."]
    };
    const arr = ideas[tab] || ideas.WRITE;
    return arr[Math.floor(Math.random() * arr.length)];
  };

  return (
    <ThemeContext.Provider value={{
      theme, applyTheme, lang, setLang, t, showIntro, setShowIntro, muteIntro, setMuteIntro,
      projects, saveProject, deleteProject, saveToStorage, customDraft, setCustomDraft, savedThemes, saveNewCustomTheme, getRandomIdea
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);