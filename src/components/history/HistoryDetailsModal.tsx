import React from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useUserSettingsStore } from "@/store/userSettingsStore";
import { colors } from "@/constants/themes";
import { DailyLog, Exercise } from "@/types/models";

interface HistoryDetailsModalProps {
  visible: boolean;
  onClose: () => void;
  dayLog: DailyLog | null;
  exercises: Exercise[];
}

const formatFullDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
};

const getExerciseLabel = (exerciseId: string, exercises: Exercise[]) => {
  return exercises.find((exercise) => exercise.id === exerciseId)?.name ?? "Unknown exercise";
};

const formatTimestamp = (isoString: string) => {
  const date = new Date(isoString);
  return date.toLocaleString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    month: "short",
    day: "numeric",
  });
};

export default function HistoryDetailsModal({
  visible,
  onClose,
  dayLog,
  exercises,
}: HistoryDetailsModalProps) {
  const { theme } = useUserSettingsStore();
  const themeColors = colors[theme];
  const styles = createStyles(themeColors);

  if (!dayLog) {
    return null;
  }

  const hasExercises = dayLog.exercises.length > 0;
  const hasSleepData = dayLog.sleep.length > 0;
  const hasDietData = dayLog.meals.length > 0;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.modalCard}>
          <View style={styles.headerRow}>
            <View style={styles.titleColumn}>
              <Text style={styles.title}>Day details</Text>
              <Text style={styles.subTitle}>{formatFullDate(dayLog.dateString)}</Text>
            </View>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeText}>✕</Text>
            </Pressable>
          </View>

          <ScrollView contentContainerStyle={styles.scrollContent}>
            <Text style={styles.sectionTitle}>Exercises</Text>
            {hasExercises ? (
              dayLog.exercises.map((exerciseEntry) => (
                <View key={exerciseEntry.id} style={styles.exerciseRow}>
                  <Text style={styles.exerciseName}>
                    {getExerciseLabel(exerciseEntry.exerciseId, exercises)}
                  </Text>
                  <Text style={styles.exerciseMeta}>
                    Intensity: {exerciseEntry.intensity.toFixed(2)}
                  </Text>
                  <Text style={styles.entryTime}>Logged: {formatTimestamp(exerciseEntry.loggedAtUTC)}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>No exercises logged for this day.</Text>
            )}

            {(hasSleepData || hasDietData) && (
              <View style={styles.summarySection}>
                {hasSleepData && (
                  <>
                    <Text style={styles.sectionTitle}>Sleep entries</Text>
                    {dayLog.sleep.map((sleepEntry) => (
                      <View key={sleepEntry.id} style={styles.detailRow}>
                        <Text style={styles.summaryText}>
                          Bedtime: {sleepEntry.bedtime}
                        </Text>
                        <Text style={styles.summaryText}>
                          Hours slept: {sleepEntry.hoursSlept}
                        </Text>
                        <Text style={styles.entryTime}>Logged: {formatTimestamp(sleepEntry.loggedAtUTC)}</Text>
                      </View>
                    ))}
                  </>
                )}
                {hasDietData && (
                  <>
                    <Text style={styles.sectionTitle}>Meal entries</Text>
                    {dayLog.meals.map((mealEntry) => (
                      <View key={mealEntry.id} style={styles.detailRow}>
                        <Text style={styles.summaryText}>
                          Calories: {mealEntry.calories}
                        </Text>
                        <Text style={styles.summaryText}>
                          Protein: {mealEntry.proteinGrams} g
                        </Text>
                        <Text style={styles.entryTime}>Logged: {formatTimestamp(mealEntry.loggedAtUTC)}</Text>
                      </View>
                    ))}
                  </>
                )}
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const createStyles = (themeColors: (typeof colors)["light" | "dark"]) =>
  StyleSheet.create({
    backdrop: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "center",
      padding: 16,
    },
    modalCard: {
      width: "100%",
      maxHeight: "80%",
      backgroundColor: themeColors.background,
      borderRadius: 20,
      padding: 16,
      shadowColor: "#000",
      shadowOpacity: 0.2,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 8 },
      elevation: 8,
    },
    headerRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
    },
    titleColumn: {
      flex: 1,
      paddingRight: 12,
    },
    title: {
      fontSize: 20,
      fontWeight: "700",
      color: themeColors.textPrimary,
      marginBottom: 6,
    },
    subTitle: {
      fontSize: 14,
      color: themeColors.textSecondary,
    },
    closeButton: {
      padding: 6,
    },
    closeText: {
      fontSize: 22,
      color: themeColors.textPrimary,
    },
    scrollContent: {
      paddingBottom: 16,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: themeColors.textPrimary,
      marginBottom: 10,
    },
    exerciseRow: {
      marginBottom: 12,
      padding: 12,
      borderRadius: 16,
      backgroundColor: themeColors.backgroundSecondary,
    },
    exerciseName: {
      color: themeColors.textInverse,
      fontSize: 16,
      fontWeight: "600",
      marginBottom: 4,
    },
    exerciseMeta: {
      color: themeColors.textInverseMuted,
      fontSize: 14,
    },
    emptyText: {
      color: themeColors.textSecondary,
      fontSize: 15,
      marginBottom: 12,
    },
    summarySection: {
      marginTop: 18,
      paddingTop: 10,
      borderTopWidth: 1,
      borderTopColor: themeColors.backgroundTertiary,
    },
    detailRow: {
      marginBottom: 10,
      padding: 12,
      borderRadius: 16,
      backgroundColor: themeColors.backgroundSecondary,
    },
    summaryText: {
      color: themeColors.textPrimary,
      fontSize: 14,
      marginTop: 6,
    },
    entryTime: {
      color: themeColors.textSecondary,
      fontSize: 12,
      marginTop: 4,
    },
  });
