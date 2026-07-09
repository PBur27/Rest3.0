import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useUserSettingsStore } from "@/store/userSettingsStore";
import { useExerciseStore } from "@/store/exerciseStore";
import { useDailyLogStore } from "@/store/dailyLogStore";
import { colors } from "@/constants/themes";

interface RecoveryLogModalProps {
  visible: boolean;
  type: "workout" | "sleep" | "diet";
  onClose: () => void;
}

export default function RecoveryLogModal({
  visible,
  type,
  onClose,
}: RecoveryLogModalProps) {
  const { theme } = useUserSettingsStore();
  const styles = createStyles(colors[theme]);

  const exercises = useExerciseStore((state) => state.exercises);

  const [selectedExerciseId, setSelectedExerciseId] = useState<string>(
    exercises.length > 0 ? exercises[0].id : "",
  );
  const [intensity, setIntensity] = useState("0.8");
  const [bedtime, setBedtime] = useState("22:30");
  const [hoursSlept, setHoursSlept] = useState("7.5");
  const [calories, setCalories] = useState("1800");
  const [protein, setProtein] = useState("120");

  const dailyLogStore = useDailyLogStore();

  const handleSave = () => {
    console.log("Testing Save Data:", {
      type,
      selectedExerciseId,
      intensity: Number(intensity),
      hoursSlept: Number(hoursSlept),
      bedtime,
      calories: Number(calories),
      protein: Number(protein),
    });

    const todayDateKey = new Date().toISOString().split("T")[0];

    if (type === "workout" && selectedExerciseId) {
      dailyLogStore.logExerciseToDate(
        todayDateKey,
        selectedExerciseId,
        Number(intensity),
      );
    } else if (type === "sleep") {
      const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;

      if (bedtime && !timeRegex.test(bedtime)) {
        alert("Please enter a valid time format (HH:MM), e.g., 22:30");
        return;
      }
      dailyLogStore.logSleepToDate(
        todayDateKey,
        Number(hoursSlept),
        bedtime,
      );
    } else if (type === "diet") {
      dailyLogStore.logDietToDate(
        todayDateKey,
        Number(calories),
        Number(protein),
      );
    }

    onClose();
  };

  const renderFields = () => {
    switch (type) {
      case "sleep":
        return (
          <>
            <Text style={styles.label}>Bedtime</Text>
            <TextInput
              style={styles.input}
              value={bedtime}
              onChangeText={setBedtime}
              placeholder="22:30"
              autoCapitalize="none"
            />
            <Text style={styles.label}>Hours slept</Text>
            <TextInput
              style={styles.input}
              value={hoursSlept}
              onChangeText={setHoursSlept}
              placeholder="7.5"
              keyboardType="decimal-pad"
            />
          </>
        );

      case "diet":
        return (
          <>
            <Text style={styles.label}>Calories</Text>
            <TextInput
              style={styles.input}
              value={calories}
              onChangeText={setCalories}
              placeholder="1800"
              keyboardType="number-pad"
            />
            <Text style={styles.label}>Protein</Text>
            <TextInput
              style={styles.input}
              value={protein}
              onChangeText={setProtein}
              placeholder="120"
              keyboardType="number-pad"
            />
          </>
        );

      case "workout":
      default:
        return (
          <>
            <Text style={styles.label}>Exercise</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedExerciseId}
                onValueChange={(itemValue) => setSelectedExerciseId(itemValue)}
                style={styles.picker}
                dropdownIconColor={theme === "dark" ? "#FFF" : "#000"}
              >
                {exercises.map((ex) => (
                  <Picker.Item
                    key={ex.id}
                    label={ex.name}
                    value={ex.id}
                    color={theme === "dark" ? "#FFF" : "#000"}
                  />
                ))}
              </Picker>
            </View>

            <Text style={styles.label}>Intensity (0.0 to 1.0)</Text>
            <TextInput
              style={styles.input}
              value={intensity}
              onChangeText={setIntensity}
              placeholder="0.8"
              keyboardType="decimal-pad"
            />
          </>
        );
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View style={styles.modalCard}>
            <View style={styles.headerRow}>
              <Text style={styles.title}>
                {type === "workout"
                  ? "Log workout data"
                  : type === "sleep"
                    ? "Log sleep data"
                    : "Log diet data"}
              </Text>
              <Pressable onPress={onClose} style={styles.closeButton}>
                <Text style={styles.closeText}>✕</Text>
              </Pressable>
            </View>

            <View style={styles.scrollView}>
              {renderFields()}

              <Pressable style={styles.submitButton} onPress={handleSave}>
                <Text style={styles.submitButtonText}>Save</Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const createStyles = (themeColors: (typeof colors)["light" | "dark"]) =>
  StyleSheet.create({
    backdrop: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.45)",
      justifyContent: "center",
      padding: 16,
    },
    keyboardView: {
      width: "100%",
      alignItems: "center",
    },
    modalCard: {
      width: "100%",
      maxWidth: 480,
      backgroundColor: themeColors.background,
      borderRadius: 20,
      padding: 20,
      shadowColor: "#000",
      shadowOpacity: 0.15,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 8 },
      elevation: 6,
    },
    headerRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 16,
    },
    title: {
      fontSize: 20,
      fontWeight: "700",
      color: themeColors.textPrimary,
      flex: 1,
    },
    closeButton: {
      padding: 6,
    },
    closeText: {
      fontSize: 20,
      color: themeColors.textPrimary,
    },
    segmentRow: {
      flexDirection: "row",
      gap: 8,
      marginBottom: 16,
    },
    segmentButton: {
      flex: 1,
      paddingVertical: 10,
      borderRadius: 999,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: themeColors.backgroundSecondary,
      borderWidth: 1,
      borderColor: themeColors.backgroundSecondary,
    },
    segmentButtonActive: {
      backgroundColor: themeColors.textPrimary,
      borderColor: themeColors.textPrimary,
    },
    segmentButtonText: {
      color: themeColors.textInverse,
      fontWeight: "600",
      textTransform: "capitalize",
    },
    segmentButtonTextActive: {
      color: themeColors.background,
    },
    scrollView: {
      maxHeight: "75%",
    },
    formContent: {
      paddingBottom: 8,
    },
    label: {
      fontSize: 14,
      fontWeight: "600",
      color: themeColors.textPrimary,
      marginBottom: 6,
    },
    input: {
      borderWidth: 1,
      borderColor: themeColors.backgroundSecondary,
      backgroundColor: themeColors.background,
      borderRadius: 12,
      paddingHorizontal: 14,
      paddingVertical: 12,
      color: themeColors.textPrimary,
      marginBottom: 12,
    },
    pickerContainer: {
      borderWidth: 1,
      borderColor: themeColors.backgroundSecondary,
      backgroundColor: themeColors.background,
      borderRadius: 12,
      marginBottom: 12,
      overflow: "hidden",
      justifyContent: "center",
      height: Platform.OS === "ios" ? 150 : 50,
    },
    picker: {
      color: themeColors.textPrimary,
      width: "100%",
    },
    submitButton: {
      marginTop: 8,
      paddingVertical: 14,
      borderRadius: 12,
      backgroundColor: themeColors.backgroundSecondary,
      alignItems: "center",
      justifyContent: "center",
    },
    submitButtonText: {
      color: themeColors.textInverse,
      fontSize: 16,
      fontWeight: "600",
    },
  });
