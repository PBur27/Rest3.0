import { useExerciseStore } from "../store/exerciseStore";
import { exertionCalculation } from "./exertionCalculation";
import { Exercise,LoggedExercise } from "@/types/models";

describe("exertionCalculation", () => {
  const mockExercises: Exercise[]=[
    {
      id: "exercise-1",
      name: "Bench Press",
      isCustom: false,
      isArchived: false,
      category: "chest",
      muscleLoads: [
        { muscle: "chest", load: 1 },
        { muscle: "triceps", load: 0.75 },
      ],
    },
    {
      id: "exercise-2",
      name: "Push Up",
      isCustom: false,
      isArchived: false,
      category: "chest",
      muscleLoads: [
        { muscle: "chest", load: 0.9 },
        { muscle: "triceps", load: 0.5 },
      ],
    },
  ];

  beforeEach(() => {
    useExerciseStore.setState({ exercises: mockExercises });
  });

  afterEach(() => {
    useExerciseStore.setState({ exercises: [] });
  });

  it("calculates muscle load from logged exercises", () => {
    const loggedExercises: LoggedExercise[] = [
      {
        id: "abcd",
        exerciseId: "exercise-1",
        intensity: 0.5,
        loggedAt: "2026-07-15T10:00:00.000Z",
      },
      {
        id: "efgh",
        exerciseId: "exercise-2",
        intensity: 0.8,
        loggedAt: "2026-07-15T11:00:00.000Z",
      },
    ];

    const result = exertionCalculation(loggedExercises);

    expect(result).toEqual({
      chest: 0.8*0.9 + 0.5*1,
      triceps: 0.75 * 0.5 + 0.5 * 0.8,
    });
  });
});

