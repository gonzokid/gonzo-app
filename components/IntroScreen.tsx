import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { useTheme } from '../app/context';

const VIDEOS = [
  require('../assets/intro/intro1.mp4'),
  require('../assets/intro/intro2.mp4'),
  require('../assets/intro/intro3.mp4'),
  require('../assets/intro/intro4.mp4'),
  require('../assets/intro/intro5.mp4'),
  require('../assets/intro/intro6.mp4'),
];

export default function IntroScreen({ onFinish }) {
  const { muteIntro, introSelection } = useTheme();
  const [source, setSource] = useState(null);

  useEffect(() => {
    if (introSelection === 'RANDOM') {
      setSource(VIDEOS[Math.floor(Math.random() * VIDEOS.length)]);
    } else {
      const idx = parseInt(introSelection);
      setSource(VIDEOS[idx] || VIDEOS[0]);
    }
  }, [introSelection]);

  if (!source) return <View style={{ flex: 1, backgroundColor: '#000' }} />;

  return (
    <View style={styles.container}>
      <Video
        source={source}
        style={StyleSheet.absoluteFill}
        resizeMode={ResizeMode.COVER}
        shouldPlay
        isMuted={muteIntro}
        onPlaybackStatusUpdate={(status) => {
          if (status.isLoaded && status.didJustFinish) onFinish();
        }}
        onError={() => onFinish()}
      />
    </View>
  );
}

const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: '#000' } });