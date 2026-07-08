import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUserSettingsStore } from '../../store/userSettingsStore';
import { colors } from '@/constants/themes';

export default function ProfileScreen() {
  const { theme } = useUserSettingsStore();
  const styles = createStyles(colors[theme]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <Text style={styles.text}>Profile Screen Skeleton</Text>
      </View>
    </SafeAreaView>
  );
}

const createStyles = (themeColors: typeof colors['light' | 'dark']) =>
  StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: themeColors.safeAreaBackground },
    container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    text: { color: themeColors.textPrimary, fontSize: 18 },
  });