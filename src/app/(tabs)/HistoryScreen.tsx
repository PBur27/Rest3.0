import { useMemo, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDailyLogStore } from "../../store/dailyLogStore";
import { useExerciseStore } from "../../store/exerciseStore";
import { useUserSettingsStore } from "../../store/userSettingsStore";
import { useUserProfileStore } from "../../store/userProfileStore";
import HistoryDetailsModal from "@/components/history/HistoryDetailsModal";
import { colors } from "@/constants/themes";
import { DailyLog } from "@/types/models";
import {
  getRecoveryCalculationInput,
  recoveryCalculation,
} from "@/utilities/recoveryCalculation";
import { toLocalDateKey } from "@/utilities/dates";

const getLastSevenDays = () => {
  const today = new Date();
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - index);
    const dateString = toLocalDateKey(date);
    const label = date.toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
    return { dateString, label };
  });
};

export default function HistoryScreen() {
  const { theme } = useUserSettingsStore();
  const { profile } = useUserProfileStore();
  const styles = createStyles(colors[theme]);

  const dayLogHistory = useDailyLogStore((state) => state.history);
  const userWeightKg = profile?.weightKg;
  const proteinPerKgBwGoalGrams = profile?.proteinPerKgBwGoalGrams;
  const calorieGoal = profile?.calorieGoal;
  const exercises = useExerciseStore((state) => state.exercises);

  const [selectedDayLog, setSelectedDayLog] = useState<DailyLog | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const lastSevenDays = useMemo(() => getLastSevenDays(), []);

  const openDayDetails = (dateString: string) => {
    setSelectedDayLog(
      dayLogHistory[dateString] ?? {
        id: dateString,
        dateString,
        exercises: [],
        meals: [],
        sleep: [],
      },
    );
    console.log(
      "Opening details for date:",
      dateString,
      "Day log:",
      dayLogHistory[dateString],
    );
    setModalVisible(true);
  };

  const renderDayItem = ({
    item,
  }: {
    item: { dateString: string; label: string };
  }) => {
    const dayLog = dayLogHistory[item.dateString];
    const exerciseCount = dayLog?.exercises.length ?? 0;
    const hasSleep = (dayLog?.sleep?.length ?? 0) > 0;
    const hasDiet = (dayLog?.meals?.length ?? 0) > 0;
    const recoveryIndex = dayLog
      ? recoveryCalculation({
          ...getRecoveryCalculationInput(dayLog),
          calorieGoal,
          proteinPerKgBwGoalGrams,
        })
      : null;

    return (
      <Pressable
        style={({ pressed }) => [
          styles.dayRow,
          pressed && styles.dayRowPressed,
        ]}
        onPress={() => openDayDetails(item.dateString)}
      >
        <View style={styles.dayRowText}>
          <Text style={styles.dayLabel}>{item.label}</Text>
          <Text style={styles.daySummary}>
            {dayLog
              ? `${exerciseCount} exercise${exerciseCount === 1 ? "" : "s"}`
              : "No log"}
            {dayLog && (hasSleep || hasDiet)
              ? ` · ${hasSleep ? "Sleep" : ""}${hasSleep && hasDiet ? " · " : ""}${hasDiet ? "Diet" : ""}`
              : ""}
          </Text>
          <Text style={styles.daySummary}>
            Recovery index:{" "}
            {recoveryIndex !== null ? recoveryIndex.toFixed(2) : "0.00"}
          </Text>
        </View>
        <Text style={styles.chevron}>›</Text>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.container}>
        <Text style={styles.header}>History</Text>
        <Text style={styles.description}>
          Review your last 7 days of logs and tap any day for details.
        </Text>

        <FlatList
          data={lastSevenDays}
          keyExtractor={(item) => item.dateString}
          renderItem={renderDayItem}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          showsVerticalScrollIndicator={false}
        />
      </View>

      <HistoryDetailsModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        dayLog={selectedDayLog}
        exercises={exercises}
      />
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
      backgroundColor: themeColors.background,
      paddingHorizontal: 16,
      paddingTop: 16,
    },
    header: {
      fontSize: 28,
      fontWeight: "700",
      color: themeColors.textPrimary,
      marginBottom: 6,
    },
    description: {
      fontSize: 15,
      color: themeColors.textSecondary,
      marginBottom: 16,
    },
    listContent: {
      paddingBottom: 24,
    },
    dayRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 16,
      borderRadius: 16,
      backgroundColor: themeColors.backgroundSecondary,
    },
    dayRowPressed: {
      opacity: 0.85,
    },
    dayRowText: {
      flex: 1,
      marginRight: 12,
    },
    dayLabel: {
      fontSize: 16,
      fontWeight: "700",
      color: themeColors.textInverse,
      marginBottom: 4,
    },
    daySummary: {
      fontSize: 14,
      color: themeColors.textInverseMuted,
    },
    chevron: {
      fontSize: 24,
      color: themeColors.textInverse,
    },
    separator: {
      height: 12,
    },
  });
