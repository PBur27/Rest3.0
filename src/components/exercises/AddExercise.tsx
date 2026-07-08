import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Pressable, Alert } from 'react-native';
import { colors } from '@/constants/themes';
import { useUserSettingsStore } from '@/store/userSettingsStore';
import { ExerciseCategory,Exercise } from '@/types/models'; 
import * as Crypto from 'expo-crypto';

interface AddExerciseProps {
  onAddExercise: (exercise: Exercise) => void;
  onCancel?: () => void;
}

export default function AddExercise({ onAddExercise, onCancel }: AddExerciseProps) {
  const { theme } = useUserSettingsStore();
  const activeColors = colors[theme];
  const styles = createStyles(activeColors);

  const [name, setName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ExerciseCategory | null>(null);

  const categories: ExerciseCategory[] = [
    'chest',
    'arms',
    'back',
    'core',
    'legs',
    'shoulders',
    'other',
  ];



  const handleSubmit = () => {
    if (!name.trim()) {
      Alert.alert('Validation Error', 'Please enter an exercise name.');
      return;
    }
    if (!selectedCategory) {
      Alert.alert('Validation Error', 'Please select a target muscle category.');
      return;
    }

    onAddExercise({
      id: Crypto.randomUUID(),
      name: name.trim(),
      category: selectedCategory,
      isCustom: true, 
      muscleLoads: [],
    });

    
    setName('');
    setSelectedCategory(null);
  };

  return (
    <View style={styles.container} >
      <Text style={styles.title}>New Custom Exercise</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Exercise Name</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Incline Dumbbell Press"
          placeholderTextColor={activeColors.textSecondary}
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Target Category</Text>
        <View style={styles.grid}>
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <Pressable
                key={cat}
                style={[styles.gridItem, isSelected && styles.gridItemSelected]}
                onPress={() => setSelectedCategory(cat)}
              >
                <Text style={[styles.gridItemText, isSelected && styles.gridItemTextSelected]}>
                  {cat.toUpperCase()}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.buttonRow}>
        {onCancel && (
          <Pressable style={[styles.button, styles.buttonCancel]} onPress={onCancel}>
            <Text style={styles.buttonCancelText}>Cancel</Text>
          </Pressable>
        )}
        <Pressable style={[styles.button, styles.buttonSubmit]} onPress={handleSubmit}>
          <Text style={styles.buttonSubmitText}>Add Exercise</Text>
        </Pressable>
      </View>
    </View>
  );
}

const createStyles = (themeColors: typeof colors['light' | 'dark']) =>
  StyleSheet.create({
    container: {
      padding: 16,
      backgroundColor: themeColors.background,
    },
    title: {
      fontSize: 22,
      fontWeight: '700',
      color: themeColors.textPrimary,
      marginBottom: 24,
    },
    inputGroup: {
      marginBottom: 20,
    },
    label: {
      fontSize: 14,
      fontWeight: '600',
      color: themeColors.textSecondary,
      marginBottom: 8,
    },
    input: {
      height: 48,
      backgroundColor: themeColors.backgroundSecondary,
      borderRadius: 8,
      paddingHorizontal: 16,
      fontSize: 16,
      color: themeColors.textInverse,
    },
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    gridItem: {
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: themeColors.backgroundSecondary,
      backgroundColor: 'transparent',
    },
    gridItemSelected: {
      backgroundColor: themeColors.backgroundSecondary,
    },
    gridItemText: {
      fontSize: 12,
      fontWeight: '600',
      color: themeColors.textSecondary,
    },
    gridItemTextSelected: {
      color: themeColors.textInverse,
    },
    buttonRow: {
      flexDirection: 'row',
      gap: 12,
      marginTop: 16,
    },
    button: {
      flex: 1,
      height: 48,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
    },
    buttonCancel: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: themeColors.backgroundSecondary,
    },
    buttonCancelText: {
      fontSize: 16,
      fontWeight: '600',
      color: themeColors.textSecondary,
    },
    buttonSubmit: {
      backgroundColor: themeColors.backgroundRed,
    },
    buttonSubmitText: {
      fontSize: 16,
      fontWeight: '600',
      color: themeColors.textInverse,
    },
  });