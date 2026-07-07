import React from "react";
import { StyleSheet, Text, View, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUserSettingsStore } from "@/store/userSettingsStore";
import { useExerciseStore } from "@/store/exerciseStore";
import { colors } from "@/constants/themes";

export default function ActivityScreen() {
  const { theme } = useUserSettingsStore();
  const styles = createStyles(colors[theme]);
  const { exercises } = useExerciseStore();

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      
      <View style={styles.container}>
        <Text style={styles.headerTitle}>Activity Screen Skeleton</Text>
        
        <FlatList
          data={exercises}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent} 
          renderItem={({ item }) => (
            <View style={styles.exerciseCard}>
              <Text style={styles.exerciseName}>{item.name}</Text>
              <Text style={styles.exerciseCategory}>
                {item.category.toUpperCase()}
              </Text>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const createStyles = (themeColors: (typeof colors)["light" | "dark"]) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: themeColors.background,
    },
    container: {
      flex: 1,
      paddingHorizontal: 16,
      paddingTop: 16,
    },
    headerTitle: { 
      fontSize: 24,
      fontWeight: "700",
      color: themeColors.text,
      marginBottom: 16,
    },
    listContent: {
      gap: 12,
      paddingBottom: 24,
    },
    exerciseCard: {
      padding: 16,
      borderRadius: 8,
      backgroundColor: themeColors.buttonBg,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    exerciseName: {
      color: themeColors.buttonText,
      fontSize: 16,
      fontWeight: "600",
    },
    exerciseCategory: {
      color: themeColors.subText,
      fontSize: 12,
      fontWeight: "700",
    },
  });