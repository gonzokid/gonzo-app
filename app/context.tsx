import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
// context.tsx — новые типы

interface Track {
  id: string;
  coverImage:string;
  title: string;
  author: string;
  duration?: string;
  isDone: boolean;
  order: number;
  lyrics: string;
  beatUrl: string;
}

interface Project {
    coverImage:string;
  id: string;
  title: string;
  author: string;
  lyrics?: string;    // для сингла
beatUrl?: string;
  type: 'SINGLE' | 'EP' | 'ALBUM' | 'TEXT' | 'POEM' | 'BOOK' | 'PAINTING' | 'DESIGN' | 'COLLECTION';
  tab: 'МУЗЫКА' | 'ПИСЬМО' | 'АРТ';
  status: 'active' | 'done' | 'archived';
  createdAt: string;
  updatedAt: string;

  // Музыкальные поля
  tracks?: Track[];
  releaseDate?: string;
  label?: string;

  // Письменные поля
  wordCount?: number;
  chapters?: { id: string; title: string; isDone: boolean }[];

  // Арт поля
  medium?: string;
  dimensions?: string;
  tags?: string[];

  // Общие поля
  notes?: string;
  coverImage?: string;
}
interface Project {

  isDone: boolean;
  date?: string;
}

export const STRINGS = {
  RU: {
    mainTitle: 'ГОНЗО ЛАБ', settings: 'ПУЛЬТ', publish: 'СОХРАНИТЬ',
    langName: 'РУССКИЙ', themes: 'АРХИВ ВАЙБОВ', custom: 'АЛХИМИЯ ТЕМ',
    intro: 'ИНТРО', muteIntro: 'БЕЗ ЗВУКА', langLabel: 'ЯЗЫК / ÆВЗАГ'
  },
  IR: {
    mainTitle: 'ГОНЗО ЛАБ', settings: 'УАЙРÆДТÆ', publish: 'БÆРÆГ КÆНЫН',
    langName: 'ИРОН', themes: 'ÆМБÆРЦТÆ', custom: 'АРÆЗТ ТЕМÆТÆ',
    intro: 'ИНТРО', muteIntro: 'ÆНÆ ХЪÆЛÆС', langLabel: 'ÆВЗАГ / ЯЗЫК'
  }
};

export const PALETTES = {

  GRANNYSWAG: { id: 'GRANNY', name: 'GRANNYSWAG', bg: '#000', accent: '#778899', text: '#D3D3D3', card: 'rgba(40,0,0,1)', bgImg: 'https://files.catbox.moe/wj0fat.jpg' },
  PPARKER: { id: 'PPARKER', name: 'PPARKER', bg: '#000', accent: '#8B0000', text: '#FFFAFA', card: 'rgba(40, 0, 0, 0.6)', bgImg: 'https://files.catbox.moe/g590zw.jpg' },
  KNIGHTANDPR: { id: 'KNIGHTPR', name: 'РЫЦАРЬ и ПРИНЦЕССА', bg: '#000', accent: '#778899', text: '#D3D3D3', card: 'rgba(40,0,0,1)', bgImg: 'https://files.catbox.moe/lyrsr2.jpg' },
  CARPET: { id: 'CARPET', name: 'КОВЕР', bg: '#000', accent: '#778899', text: '#D3D3D3', card: 'rgba(40,0,0,1)', bgImg: 'https://files.catbox.moe/jc525d.jpg' },
  CAT: { id: 'CAT', name: 'ЯПОНОКОТ', bg: '#000', accent: '#778899', text: '#D3D3D3', card: 'rgba(40,0,0,1)', bgImg: 'https://files.catbox.moe/wviqei.jpg' },
  ANGELZ: { id: 'ANGELZ', name: 'АНГЕЛЫ', bg: '#000', accent: '#778899', text: '#D3D3D3', card: 'rgba(40,0,0,1)', bgImg: 'https://files.catbox.moe/9r50i6.jpg' },
  GOTHANGEL: { id: 'GOTHANGEL', name: 'GOTHIC ANGEL', bg: '#000', accent: '#778899', text: '#D3D3D3', card: 'rgba(40,0,0,1)', bgImg: 'https://files.catbox.moe/ex097u.png' },
  ASIAN: { id: 'ASIANPX', name: 'ПИКСЕЛИ САКУРЫ', bg: '#000', accent: '#990000', text: '#D3D3D3', card: 'rgba(40,0,0,0.8)',bgMediaType:'video', bgImg: require('../assets/bmw.gif') },
  SILENCE: { id: 'SILENCE', name: 'ТИШИНА', bg: '#000', accent: '#20B2AA', text: '#FFE4E1', card: 'rgba(10, 10, 30, 0.8)', bgImg: 'https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExNnR4bjFhNHJoM2YyeW5zd2RhdXV1N295czJ4eThhZzgxamdtamwyZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/ddtCHufQDNS2SMkbed/giphy.gif' },
  YEOW: { id: 'YEOW', name: 'ГРОЗОВОЙ ПЕРЕВАЛ', bg: '#000', accent: '#778899', text: '#D3D3D3', card: 'rgba(40,0,0,1)', bgImg: 'https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExNTFrY2U5emc5Y2w2a3gxYzBmejNxbXk3Z3phbzdrMDA0NjF2enl1aiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9dg/dmxXiyHpvrAICXffik/giphy.gif' },
  TECHNO: { id: 'TECHNO', name: 'ТЕХНО', bg: '#000', accent: '#F0FFF0', text: '#F0FFF0', card: 'rgba(80, 140, 100, 0.5)', bgImg: 'https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExbnEydTNsazV1a3l3cG45ZnRha3R1NmltbTQyejhrcWw4amV6MWNoYiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Byour3OgR0nWnRR6Tc/giphy.gif' },
  PAPER: { id: 'PAPER', name: 'БУМАГА', bg: '#000', accent: '#DEB887', text: '#191970', card: 'rgba(40,0,0,0.8)', bgImg: 'https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExbDliZWNpM3YyMmFxbnNtczhsbGx5dDY4cmZweTZwNTFrbnB3bWdlbiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/rcFs59ww1R7yeFszmo/giphy.gif' },
  GONZO: { id: 'GONZO', name: 'ХАОС', bg: '#000', accent: '#FF0055', text: '#FFF', card: 'rgba(30,0,5,0.9)', bgImg: 'https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExYzV1YTM4Zm45MHp3ZHprMmJrYWRiY2ZuOWJ6andvNXl5NHhmOWMwcyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/9UigOJtabbA1BXOVZA/giphy.gif' },
  TOXIC: { id: 'TOXIC', name: 'ТОКСИН', bg: '#0D0D0D', accent: '#CCFF00', text: '#CCFF00', card: 'rgba(20,20,0,0.9)', bgImg: 'https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExcnF1cjI5eGZhcjRwMTZpbDNibTYzMjE5NDF0YTg1bzZzZGUzd3lnbSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9dg/3piGIwfhxKMwTRpTy9/giphy.gif' },
  NEON: { id: 'NEON', name: 'КИБЕР', bg: '#050505', accent: '#00F0FF', text: '#E0E0E0', card: 'rgba(0,20,30,0.8)', bgImg: 'https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExcm1kaXNuaHdvczVhZXVzZG5senFobDZleWhuM3dieXl4bmY1MGcxayZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9dg/gOKLnHAbgCQtAd7zOw/giphy.gif' },
  VAMPIRE: { id: 'VAMPIRE', name: 'КРОВЬ', bg: '#000', accent: '#990000', text: '#D3D3D3', card: 'rgba(40,0,0,0.8)', bgImg: 'https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExdWNxOXVmd24xbjd6MTk2eXRoN2w4cWlhNXE3dTk0dzN4cnVtYmppeiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/argDpg3qYUxVK/giphy.gif' },
};

const ThemeContext = createContext(null);

export default function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(PALETTES.GONZO);
  const [lang, setLang] = useState('RU');
  const [projects, setProjects] = useState([]);
  const [showIntro, setShowIntro] = useState(true);
  const [muteIntro, setMuteIntro] = useState(false);
  const [introSelection, setIntroSelection] = useState('RANDOM');
  const [savedThemes, setSavedThemes] = useState([]);
  const [customDraft, setCustomDraft] = useState({
    id: 'DRAFT', name: 'МОЙ ВАЙБ', bg: '#000000', accent: '#00FF00', text: '#FFFFFF', card: 'rgba(255,255,255,0.1)', bgImg: null
  });

  const t = STRINGS[lang] || STRINGS.RU;

  // ========== ФУНКЦИИ ДЛЯ РАБОТЫ С ПРОЕКТАМИ ==========

  const saveProject = async (project: Project) => {
    try {
      const existingIndex = projects.findIndex(p => p.id === project.id);
      let updatedProjects;
      if (existingIndex !== -1) {
        updatedProjects = [...projects];
        updatedProjects[existingIndex] = project;
      } else {
        updatedProjects = [project, ...projects];
      }
      setProjects(updatedProjects);
      await AsyncStorage.setItem('projects', JSON.stringify(updatedProjects));
      console.log('Проект сохранен:', project.title);
    } catch (error) {
      console.error('Ошибка сохранения проекта:', error);
      throw error;
    }
  };

  const deleteProject = async (id: string) => {
    try {
      const updatedProjects = projects.filter(p => p.id !== id);
      setProjects(updatedProjects);
      await AsyncStorage.setItem('projects', JSON.stringify(updatedProjects));
    } catch (error) {
      console.error('Ошибка удаления проекта:', error);
      throw error;
    }
  };

  const toggleProjectDone = async (id: string) => {
    try {
      const updatedProjects = projects.map(p =>
        p.id === id ? { ...p, isDone: !p.isDone } : p
      );
      setProjects(updatedProjects);
      await AsyncStorage.setItem('projects', JSON.stringify(updatedProjects));
    } catch (error) {
      console.error('Ошибка обновления проекта:', error);
    }
  };

  // ========== КОНЕЦ ФУНКЦИЙ ==========

  useEffect(() => {
    const load = async () => {
      const res = await Promise.all([
        AsyncStorage.getItem('theme'),
        AsyncStorage.getItem('lang'),
        AsyncStorage.getItem('projects'),
        AsyncStorage.getItem('savedThemes'),
        AsyncStorage.getItem('showIntro'),
        AsyncStorage.getItem('muteIntro'),
        AsyncStorage.getItem('introSelection')
      ]);
      if (res[0]) setTheme(JSON.parse(res[0]));
      if (res[1]) setLang(res[1]);
      if (res[2]) setProjects(JSON.parse(res[2]));
      if (res[3]) setSavedThemes(JSON.parse(res[3]));
      if (res[4] !== null) setShowIntro(res[4] === 'true');
      if (res[5] !== null) setMuteIntro(res[5] === 'true');
      if (res[6] !== null) setIntroSelection(res[6]);
    };
    load();
  }, []);

  const saveToStorage = async (key, val) => {
    await AsyncStorage.setItem(key, typeof val === 'string' ? val : JSON.stringify(val));
  };

  const applyTheme = (nt) => { setTheme(nt); saveToStorage('theme', nt); };

  const saveNewCustomTheme = (name) => {
    const newT = { ...customDraft, id: 'CUST_' + Date.now(), name: name || 'АЛХИМИЯ' };
    const updated = [newT, ...savedThemes];
    setSavedThemes(updated);
    saveToStorage('savedThemes', updated);
    applyTheme(newT);
  };

  return (
    <ThemeContext.Provider value={{
      theme, applyTheme, lang, setLang, t, projects,
      showIntro, setShowIntro, muteIntro, setMuteIntro, introSelection, setIntroSelection, saveToStorage,
      customDraft, setCustomDraft, savedThemes, saveNewCustomTheme,
      // 🔥 ДОБАВЛЯЕМ НОВЫЕ ФУНКЦИИ В ПРОВАЙДЕР
      saveProject,
      deleteProject,
      toggleProjectDone,
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);