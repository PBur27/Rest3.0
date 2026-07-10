export const calculateRecoveryIndex = (sleepHours: number, proteinPerKgBwGrams: number, calories: number, calorieGoal: number, proteinPerKgBwGoalGrams: number) => {

      const sleepScore = 1 / (1 + 5**-(sleepHours - 7))
      const proteinScore = 1 / (1 + 500**-(proteinPerKgBwGrams - proteinPerKgBwGoalGrams))
      const calorieScore = 1 / (1 + 1.005**-(calories - calorieGoal))
      // all scores are between 0 and 1

      const recoveryIndex = (sleepScore + proteinScore + calorieScore) / 3
      return recoveryIndex
}