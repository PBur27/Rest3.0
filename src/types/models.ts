export interface UserProfile {
  name: string;
  weightKg: number;
  heightCm: number;
  age: number;
  sex: "male" | "female";
  activityLevel: "sedentary" | "moderate" | "active" ;
  
  calorieGoal: number;
  proteinPerKgBwGoalGrams: number;
}

export interface UserSettings {
  theme: "light" | "dark";
  language: "English" | "Polish";

  setTheme: (theme: "light" | "dark") => void;
  setLanguage: (language: "English" | "Polish") => void;
}

export interface DailyLog {
  id: string; // UUID
  dateString: string; // ISO date string

  exercises: LoggedExercise[];
  meals: LoggedMeals[];
  sleep: LoggedSleep[];
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

export type ExerciseCategory =
  | "chest"
  | "arms"
  | "back"
  | "core"
  | "legs"
  | "shoulders"
  | "other";
export type ExerciseCategoryFilter = ExerciseCategory | "all";

export interface MuscleLoad {
  muscle: MuscleGroup;
  load: number; // impact of the exercise on the muscle, from 0 to 1
}

export interface Exercise {
  id: string; // UUID
  name: string;
  isCustom: boolean; // false for default, true for user-added
  isArchived: boolean; // true if the exercise is archived and should not be shown in the catalog
  category: ExerciseCategory;
  muscleLoads: MuscleLoad[];
}

export interface LoggedExercise {
  id: string; // UUID
  exerciseId: string;
  intensity: number; // 0-1 scale
  loggedAt: string; // ISO time string
}

export interface LoggedSleep{
  id: string; // UUID
  bedtime: string;
  hoursSlept: number;
  loggedAt: string; // ISO time string
}

export interface LoggedMeals{
  id: string; // UUID
  calories: number;
  proteinGrams: number;
  loggedAt: string; // ISO time string
}


export interface Organism {
  front: {
    abs: number;
    biceps: number;
    calves: number;
    chest: number;
    forearms: number;
    lats: number;
    obliques: number;
    quads: number;
    shoulders: number;
    traps: number;
    triceps: number;
    ludzik: number;
  };
  back: {
    head: number;
    traps: number;
    rhomboids: number;
    shoulders: number;
    lats: number;
    triceps: number;
    forearms: number;
    erectorSpinae: number;
    glutes: number;
    hamstrings: number;
    calves: number;
    ludzik: number;
    obliques: number;
  };
}
