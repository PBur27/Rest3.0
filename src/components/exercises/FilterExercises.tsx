import React, { useState } from 'react';
import { StyleSheet, Text, View, Switch, Pressable, Modal, FlatList } from 'react-native';
import { colors } from '@/constants/themes';
import { useUserSettingsStore } from '@/store/userSettingsStore';
import { ExerciseCategoryFilter} from '@/types/models'

interface FilterExercisesProps {
  selectedCategory: ExerciseCategoryFilter;
  onCategoryChange: (category: ExerciseCategoryFilter) => void;
  isCustomOnly: boolean;
  onCustomChange: (value: boolean) => void;
}

export default function FilterExercises({
  selectedCategory,
  onCategoryChange,
  isCustomOnly,
  onCustomChange,
}: FilterExercisesProps) {
  const { theme } = useUserSettingsStore();
  const activeColors = colors[theme];
  const styles = createStyles(activeColors);

  const [modalVisible, setModalVisible] = useState(false);

  const categories: { label: string; value: ExerciseCategoryFilter }[] = [
    { label: 'All Categories', value: 'all' },
    { label: 'Chest', value: 'chest' },
    { label: 'Arms', value: 'arms' },
    { label: 'Back', value: 'back' },
    { label: 'Core', value: 'core' },
    { label: 'Legs', value: 'legs' },
    { label: 'Shoulders', value: 'shoulders' },
    { label: 'Other', value: 'other' },
  ];

  const currentLabel = categories.find(cat => cat.value === selectedCategory)?.label || 'All Categories';

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.label}>Category</Text>
        <Pressable style={styles.dropdownTrigger} onPress={() => setModalVisible(true)}>
          <Text style={styles.dropdownTriggerText}>{currentLabel}</Text>
          <Text style={styles.dropdownArrow}>▾</Text>
        </Pressable>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Custom Only</Text>
        <Switch
          trackColor={{ false: activeColors.backgroundRed, true: activeColors.backgroundSecondary }}
          thumbColor={isCustomOnly ? activeColors.textInverse : activeColors.textInverse}
          ios_backgroundColor={activeColors.backgroundTertiary}
          onValueChange={onCustomChange}
          value={isCustomOnly}
        />
      </View>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
          <View style={styles.modalContent}>
            <View style={{ width: '100%' }}>
              <Text style={styles.modalTitle}>Select Category</Text>
              <FlatList
                data={categories}
                keyExtractor={(item) => item.value}
                renderItem={({ item }) => {
                  const isSelected = item.value === selectedCategory;
                  return (
                    <Pressable
                      style={[styles.modalItem, isSelected && styles.modalItemSelected]}
                      onPress={() => {
                        onCategoryChange(item.value);
                        setModalVisible(false);
                      }}
                    >
                      <Text style={[styles.modalItemText, isSelected && styles.modalItemTextSelected]}>
                        {item.label}
                      </Text>
                      {isSelected && <Text style={styles.checkmark}>✓</Text>}
                    </Pressable>
                  );
                }}
              />
            </View>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const createStyles = (themeColors: typeof colors['light' | 'dark']) =>
  StyleSheet.create({
    container: {
      padding: 16,
      backgroundColor: themeColors.backgroundTertiary,
      gap: 16,
      marginVertical: 8,
      width: '100%',
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    label: {
      fontSize: 16,
      fontWeight: '600',
      color: themeColors.textInverse,
    },
    dropdownTrigger: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: themeColors.background,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 8,
      width: 160,
    },
    dropdownTriggerText: {
      fontSize: 14,
      fontWeight: '500',
      color: themeColors.textPrimary,
    },
    dropdownArrow: {
      fontSize: 12,
      color: themeColors.textSecondary,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 24,
    },
    modalContent: {
      backgroundColor: themeColors.background,
      borderRadius: 16,
      padding: 16,
      width: '100%',
      maxHeight: '60%',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 5,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: themeColors.textPrimary,
      marginBottom: 16,
      textAlign: 'center',
    },
    modalItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 14,
      paddingHorizontal: 12,
      borderRadius: 8,
    },
    modalItemSelected: {
      backgroundColor: themeColors.backgroundSecondary,
    },
    modalItemText: {
      fontSize: 16,
      color: themeColors.textPrimary,
    },
    modalItemTextSelected: {
      color: themeColors.textInverse,
      fontWeight: '600',
    },
    checkmark: {
      fontSize: 16,
      color: themeColors.textInverse,
    },
  });