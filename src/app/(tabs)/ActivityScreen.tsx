import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUserSettingsStore } from "@/store/userSettingsStore";
import { colors } from "@/constants/themes";
import RecoveryLogModal from "@/components/activity/RecoveryLogModal";

type RecoveryType = "workout" | "sleep" | "diet";

export default function ActivityScreen() {
  const { theme } = useUserSettingsStore();
  const styles = createStyles(colors[theme]);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedType, setSelectedType] = useState<RecoveryType>("workout");

  const openModal = (type: RecoveryType) => {
    setSelectedType(type);
    setModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.container}>
        <Text style={styles.headerTitle}>Activity Screen Skeleton</Text>

        <View style={styles.centerContainer}>
          <View style={styles.row}>
            <Pressable style={styles.button} onPress={() => openModal("workout")}>
              <Text style={styles.buttonText}>Workout</Text>
            </Pressable>
          </View>

          <View style={styles.row}>
            <Pressable style={styles.button} onPress={() => openModal("sleep")}>
              <Text style={styles.buttonText}>Sleep</Text>
            </Pressable>
            <Pressable style={styles.button} onPress={() => openModal("diet")}>
              <Text style={styles.buttonText}>Diet</Text>
            </Pressable>
          </View>
        </View>
      </View>

      <RecoveryLogModal
        visible={modalVisible}
        type={selectedType}
        onClose={() => setModalVisible(false)}
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
      paddingHorizontal: 16,
      paddingTop: 16,
      backgroundColor: themeColors.background,
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: "700",
      color: themeColors.textPrimary,
      marginBottom: 16,
      textAlign: "center",
    },
    centerContainer: {
      flex: 1,
      gap: 12,
      justifyContent: "center",
      alignItems: "center",
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: "100%",
      gap: 12,
    },
    button: {
      flex: 1,
      paddingVertical: 14,
      borderRadius: 12,
      backgroundColor: themeColors.backgroundSecondary,
      alignItems: "center",
      justifyContent: "center",
    },
    buttonText: {
      color: themeColors.textInverse,
      fontSize: 16,
      fontWeight: "600",
    },
  });