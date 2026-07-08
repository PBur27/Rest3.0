import React, { useState, useMemo } from "react";
import { StyleSheet, Text, View, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUserSettingsStore } from "../../store/userSettingsStore";
import { useExerciseStore } from "@/store/exerciseStore";
import { colors } from "@/constants/themes";
import FilterExercises  from "@/components/exercises/FilterExercises";
import { Exercise, ExerciseCategoryFilter } from "@/types/models";
import AddExercise from "@/components/exercises/AddExercise";

export default function ExerciseCatalog() {
  const { theme } = useUserSettingsStore();
  const styles = createStyles(colors[theme]);
  const { exercises } = useExerciseStore();

  const [selectedCategory, setSelectedCategory] = useState<ExerciseCategoryFilter>('all');
  const [isCustomOnly, setIsCustomOnly] = useState<boolean>(false);

  const filteredData = useMemo(() => {
    return exercises.filter((item) => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      
      const matchesCustom = !isCustomOnly || item.isCustom === true;

      return matchesCategory && matchesCustom;
    });
  }, [exercises, selectedCategory, isCustomOnly]);

  const handleAddExercise = (exercise: Exercise) => {
    useExerciseStore.getState().addCustomExercise(exercise);
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.container}>
        <Text style={styles.text}>Exercise Catalog Skeleton</Text>
        <FilterExercises
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          isCustomOnly={isCustomOnly}
          onCustomChange={setIsCustomOnly}
        />
        <FlatList
          data={filteredData}
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
        <AddExercise onAddExercise={handleAddExercise} />
      </View>
    </SafeAreaView>
  );
}

const createStyles = (themeColors: (typeof colors)["light" | "dark"]) =>
  StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: themeColors.safeAreaBackground },
    container: { flex: 1, justifyContent: "center", alignItems: "center",backgroundColor: themeColors.background },
    text: { color: themeColors.textPrimary, fontSize: 18 },
    listContent: {
      gap: 12,
      paddingBottom: 24,
    },
    exerciseCard: {
      padding: 16,
      borderRadius: 8,
      backgroundColor: themeColors.backgroundSecondary,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    exerciseName: {
      color: themeColors.textInverse,
      fontSize: 16,
      fontWeight: "600",
    },
    exerciseCategory: {
      color: themeColors.textPrimary,
      fontSize: 12,
      fontWeight: "700",
    },
  });
