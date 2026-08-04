import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SvgProps } from "react-native-svg";
import { BodyPartsBack } from "./BodyPartsBack";
import { BodyPartsFront } from "./BodyPartsFront";
import { Organism } from "@/types/models";
import { useUserSettingsStore } from "@/store/userSettingsStore";
import { colors } from "@/constants/themes";

interface BodyImageProps {
  organism?: Organism;
}

export default function BodyImage({ organism }: BodyImageProps) {
  const { theme } = useUserSettingsStore();
  const styles = createStyles(colors[theme]);

  const exertion = colors[theme]?.exertion as
    | Record<string, string>
    | undefined;
  const defaultFill = exertion?.["0"] || "#8C7871";

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.contentContainer}
      horizontal
      pagingEnabled
    >
      <View style={styles.bodyContainer}>
        {Object.entries(BodyPartsFront).map(([name, Component]) => {
          const intensity =
            organism?.front?.[name as keyof typeof organism.front];
          return (
            <Component
              key={name}
              style={styles.bodyPart}
              fill={
                intensity != null
                  ? (exertion?.[String(intensity)] ?? defaultFill)
                  : defaultFill
              }
            />
          );
        })}
      </View>
      <View style={styles.bodyContainer}>
        {Object.entries(BodyPartsBack).map(([name, Component]) => {
          const intensity =
            organism?.back?.[name as keyof typeof organism.back];
          return (
            <Component
              key={name}
              style={styles.bodyPart}
              fill={
                intensity != null
                  ? (exertion?.[String(intensity)] ?? defaultFill)
                  : defaultFill
              }
            />
          );
        })}
      </View>
    </ScrollView>
  );
}

const createStyles = (themeColors: any) =>
  StyleSheet.create({
    scroll: {
      flex: 1,
    },
    contentContainer: {
      width: "200%",
    },
    bodyContainer: {
      flex: 1,
      justifyContent: "flex-start",
      alignItems: "center",
    },
    bodyPart: {
      position: "absolute",
      top: 0,
    },
  });
