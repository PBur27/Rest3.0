import React from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useUserSettingsStore } from "../../store/userSettingsStore";
import { useDailyLogStore } from "../../store/dailyLogStore";

import { calculate7DayNetExertion } from "@/utilities/calculate7DayNetExertion"
import { mapExertionLevelsToOrganism } from "@/utilities/mapExertionLevelsToOrganism"

import { colors } from "@/constants/themes";
import BodyImage from "@/components/home/BodyImage";
import { Organism } from "@/types/models";

export default function HomeScreen() {
  const { theme } = useUserSettingsStore();
  const styles = createStyles(colors[theme]);
  
  // workout and recovery log
  const dailyLog = useDailyLogStore()
  //console.log(dailyLog.history)

  const calculated7DayNetExertion = calculate7DayNetExertion(dailyLog.history)
  const organism: Organism = mapExertionLevelsToOrganism(calculated7DayNetExertion)
  console.log(organism)



  /*
  const mockOrganism: Organism = {
    front: {
      abs: 2,
      biceps: 1,
      calves: 0,
      chest: 3,
      forearms: 1,
      lats: 2,
      obliques: 0,
      quads: 3,
      shoulders: 2,
      traps: 1,
      triceps: 0,
      ludzik: 0,
    },
    back: {
      head: 0,
      traps: 2,
      rhomboids: 1,
      shoulders: 3,
      lats: 3,
      triceps: 1,
      forearms: 0,
      erectorSpinae: 2,
      glutes: 1,
      hamstrings: 2,
      calves: 1,
      ludzik: 0,
      obliques: 0,
    },
  };
  */
  
  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.container}>
        <BodyImage organism={organism} />
      </View>
    </SafeAreaView>
  );
}

const createStyles = (themeColors: (typeof colors)["light" | "dark"]) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: themeColors.safeAreaBackground,
    },
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 24,
      backgroundColor: themeColors.background,
    },
    title: {
      fontSize: 36,
      fontWeight: "700",
      marginBottom: 12,
      color: themeColors.textPrimary,
    },
    subtitle: {
      fontSize: 18,
      marginBottom: 24,
      color: themeColors.textSecondary,
    },
    info: {
      fontSize: 16,
      marginTop: 8,
      color: themeColors.textPrimary,
    },
    buttonContainer: {
      flexDirection: "row",
      marginTop: 32,
      gap: 12,
    },
    buttonLight: {
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 6,
      backgroundColor: themeColors.backgroundSecondary,
    },
    buttonTextLight: {
      fontSize: 14,
      fontWeight: "600",
      color: themeColors.textInverse,
    },
    buttonDark: {
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 6,
      backgroundColor: themeColors.backgroundTertiary,
    },
    buttonTextDark: {
      fontSize: 14,
      fontWeight: "600",
      color: themeColors.textInverse,
    },
  });
