import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUserSettingsStore } from '../../store/userSettingsStore';
import { colors } from '@/constants/themes';

export default function HomeScreen() {
  const { theme, setTheme, language } = useUserSettingsStore();
  const activeColors = colors[theme];
  const styles = createStyles(activeColors);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <Text style={styles.title}>Welcome</Text>
        <Text style={styles.subtitle}>Your app is ready</Text>
        
        <Text style={styles.info}>Theme: {theme}</Text>
        <Text style={styles.info}>Language: {language}</Text>
        
        <View style={styles.buttonContainer}>
          <Pressable style={styles.buttonLight} onPress={() => setTheme('light')}>
            <Text style={styles.buttonTextLight}>Light</Text>
          </Pressable>
          
          <Pressable style={styles.buttonDark} onPress={() => setTheme('dark')}>
            <Text style={styles.buttonTextDark}>Dark</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const createStyles = (themeColors: typeof colors['light' | 'dark']) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: themeColors.background,
    },
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 24,
    },
    title: {
      fontSize: 36,
      fontWeight: '700',
      marginBottom: 12,
      color: themeColors.text,
    },
    subtitle: {
      fontSize: 18,
      marginBottom: 24,
      color: themeColors.subText,
    },
    info: {
      fontSize: 16,
      marginTop: 8,
      color: themeColors.text,
    },
    buttonContainer: {
      flexDirection: 'row',
      marginTop: 32,
      gap: 12,
    },
    buttonLight: {
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 6,
      backgroundColor: themeColors.buttonBg,
    },
    buttonTextLight: {
      fontSize: 14,
      fontWeight: '600',
      color: themeColors.buttonText,
    },
    buttonDark: {
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 6,
      backgroundColor: themeColors.accentBg,
    },
    buttonTextDark: {
      fontSize: 14,
      fontWeight: '600',
      color: themeColors.accentText,
    },
  });