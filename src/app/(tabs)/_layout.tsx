import React from 'react';
import { Tabs } from 'expo-router';
import { useUserSettingsStore } from '../../store/userSettingsStore';
import { colors } from '@/constants/themes';

export default function ScreensLayout() {
  const { theme } = useUserSettingsStore();
  const activeColors = colors[theme];

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: activeColors.background, borderTopWidth: 0 },
        tabBarActiveTintColor: activeColors.accentBg,
        tabBarInactiveTintColor: activeColors.subText,
      }}
    >
      <Tabs.Screen name="HomeScreen" options={{ title: "Home" }} />
      <Tabs.Screen name="ActivityScreen" options={{ title: "Activity" }} />
      <Tabs.Screen name="InfoScreen" options={{ title: "Info" }} />
      <Tabs.Screen name="HistoryScreen" options={{ title: "History" }} />
      <Tabs.Screen name="ProfileScreen" options={{ title: "Profile" }} />
    </Tabs>
  );
}