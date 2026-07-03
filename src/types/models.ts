
export interface UserProfile {
  name: string;
  weightKg: number;
  heightCm: number;
  sex: 'male' | 'female' 
}

export type MuscleGroup =
  | "abs"
  | "biceps"
  | "calves"
  | "chest"
  | "erectorSpinae"
  | "forearms"
  | "glutes"
  | "hamstrings"
  | "lats"
  | "obliques"
  | "quads"
  | "rhomboids"
  | "shoulders"
  | "traps"
  | "triceps";


export type exerciseCategory = "chest" | "arms" | "back" | "core" | "legs" | "shoulders" | "cardio" | "other";

export interface MuscleLoad {
  muscle: MuscleGroup;
  weight: number; // impact of the exercise on the muscle, from 0 to 1
}

export interface Exercise {
  id: string; // UUID
  name: string;
  isCustom: boolean; // false for default, true for user-added
  category: exerciseCategory;
  muscleLoads: MuscleLoad[];
}

export interface Routine {
  id: string; //UUID
  name: string;
  exerciseIds: string[]; 
}