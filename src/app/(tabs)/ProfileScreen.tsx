import { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Switch,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUserSettingsStore } from "../../store/userSettingsStore";
import { colors } from "@/constants/themes";
import { useUserProfileStore } from "@/store/userProfileStore";
import type { UserProfile } from "@/types/models";

export default function ProfileScreen() {
  const { theme } = useUserSettingsStore();
  const styles = createStyles(colors[theme]);

  const { profile, updateProfile } = useUserProfileStore();
  const [weight, setWeight] = useState<string>(profile?.weightKg?.toString() || "");
  const [age, setAge] = useState<string>(profile?.age?.toString() || "");
  const [height, setHeight] = useState<string>(profile?.heightCm?.toString() || "");
  const [isMale, setIsMale] = useState<boolean>(profile?.sex === "male");
  const [activityLevel, setActivityLevel] = useState<UserProfile["activityLevel"]>(
    profile?.activityLevel ?? "moderate"
  );

  const handleWeightChange = (value: string) => {
    setWeight(value);
    if (value) updateProfile({ ...profile, weightKg: parseFloat(value) });
  };

  const handleAgeChange = (value: string) => {
    setAge(value);
    if (value) updateProfile({ ...profile, age: parseInt(value) });
  };

  const handleHeightChange = (value: string) => {
    setHeight(value);
    if (value) updateProfile({ ...profile, heightCm: parseFloat(value) });
  };

  const handleSexChange = (value: boolean) => {
    setIsMale(value);
    updateProfile({ ...(profile ?? {}), sex: value ? "male" : "female" });
  };

  const handleActivityLevelChange = (value: UserProfile["activityLevel"]) => {
    setActivityLevel(value);
    updateProfile({ ...(profile ?? {}), activityLevel: value });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        <Text style={styles.title}>Profile</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Weight (kg)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter weight"
            placeholderTextColor={colors[theme].textSecondary}
            value={weight}
            onChangeText={handleWeightChange}
            keyboardType="decimal-pad"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Age (years)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter age"
            placeholderTextColor={colors[theme].textSecondary}
            value={age}
            onChangeText={handleAgeChange}
            keyboardType="number-pad"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Height (cm)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter height"
            placeholderTextColor={colors[theme].textSecondary}
            value={height}
            onChangeText={handleHeightChange}
            keyboardType="decimal-pad"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Activity level</Text>
          <View style={styles.segmentedControl}>
            {(["sedentary", "moderate", "active"] as UserProfile["activityLevel"][]).map(
              (level) => {
                const isSelected = activityLevel === level;
                return (
                  <TouchableOpacity
                    key={level}
                    style={[
                      styles.segmentButton,
                      isSelected && styles.segmentButtonActive,
                    ]}
                    onPress={() => handleActivityLevelChange(level)}
                  >
                    <Text
                      style={[
                        styles.segmentButtonText,
                        isSelected && styles.segmentButtonTextActive,
                      ]}
                    >
                      {level === "sedentary"
                        ? "Sedentary"
                        : level === "moderate"
                          ? "Moderate"
                          : "Active"}
                    </Text>
                  </TouchableOpacity>
                );
              }
            )}
          </View>
        </View>

        <View style={styles.switchGroup}>
          <Text style={styles.label}>{isMale ? "Male" : "Female"}</Text>
          <Switch
            value={isMale}
            onValueChange={handleSexChange}
            trackColor={{ false: "#767577", true: "#81c784" }}
          />
        </View>

        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>Profile Stats</Text>
          <View style={styles.statsRow}>
            <Text style={styles.statsLabel}>Weight</Text>
            <Text style={styles.statsValue}>{weight ? `${weight} kg` : "-"}</Text>
          </View>
          <View style={styles.statsRow}>
            <Text style={styles.statsLabel}>Height</Text>
            <Text style={styles.statsValue}>{height ? `${height} cm` : "-"}</Text>
          </View>
          <View style={styles.statsRow}>
            <Text style={styles.statsLabel}>Activity Level</Text>
            <Text style={styles.statsValue}>
              {activityLevel === "sedentary"
                ? "Sedentary"
                : activityLevel === "moderate"
                  ? "Moderate"
                  : "Active"}
            </Text>
          </View>
          <View style={styles.statsRow}>
            <Text style={styles.statsLabel}>Sex</Text>
            <Text style={styles.statsValue}>{isMale ? "Male" : "Female"}</Text>
          </View>
          <View style={styles.statsRow}>
            <Text style={styles.statsLabel}>Calculated Protein Goal</Text>
            <Text style={styles.statsValue}>{profile?.proteinPerKgBwGoalGrams ? `${profile?.proteinPerKgBwGoalGrams.toFixed(2)} g/kg` : "-"}</Text>
          </View>
          <View style={styles.statsRow}>
            <Text style={styles.statsLabel}>Calculated Calorie Goal</Text>
            <Text style={styles.statsValue}>{profile?.calorieGoal ? `${profile?.calorieGoal.toFixed(0)} kcal` : "-"}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (themeColors: (typeof colors)["light" | "dark"]) =>
  StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: themeColors.safeAreaBackground },
    container: { flex: 1, backgroundColor: themeColors.background },
    contentContainer: { padding: 20 },
    title: {
      color: themeColors.textPrimary,
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 20,
    },
    inputGroup: { marginBottom: 16 },
    switchGroup: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 16,
    },
    segmentedControl: {
      flexDirection: "row",
      gap: 8,
    },
    segmentButton: {
      flex: 1,
      paddingVertical: 10,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: themeColors.textSecondary,
      alignItems: "center",
      backgroundColor: themeColors.background,
    },
    segmentButtonActive: {
      backgroundColor: themeColors.backgroundSecondary,
      borderColor: themeColors.backgroundSecondary,
    },
    segmentButtonText: {
      color: themeColors.textPrimary,
      fontWeight: "600",
    },
    segmentButtonTextActive: {
      color: "#fff",
    },
    label: { color: themeColors.textPrimary, fontSize: 16, marginBottom: 8 },
    input: {
      borderWidth: 1,
      borderColor: themeColors.textSecondary,
      borderRadius: 8,
      padding: 12,
      color: themeColors.textPrimary,
      fontSize: 16,
    },
    statsCard: {
      marginTop: 24,
      padding: 16,

    },
    statsTitle: {
      color: themeColors.textPrimary,
      fontSize: 18,
      fontWeight: "600",
      marginBottom: 12,
    },
    statsRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: themeColors.textSecondary,
    },
    statsLabel: {
      color: themeColors.textSecondary,
      fontSize: 15,
    },
    statsValue: {
      color: themeColors.textPrimary,
      fontSize: 15,
      fontWeight: "500",
    },
  });
