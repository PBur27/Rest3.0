import { createMMKV } from "react-native-mmkv";

// Reference your exact storage containers by their IDs
const logStorage = createMMKV({ id: "daily-log-storage-key" });
const settingsStorage = createMMKV({ id: "user-settings-storage-key" });
const exerciseStorage = createMMKV({ id: "exercise-storage-key" });

export const storageAdmin = {

  wipeDailyLogs: () => {
    logStorage.clearAll();
    console.log("🧹 [StorageAdmin]: Daily log history completely wiped.");
  },


  nukeEverything: () => {
    logStorage.clearAll();
    settingsStorage.clearAll();
    exerciseStorage.clearAll();
    console.log("☢️ [StorageAdmin]: Entire application storage container nuked.");
  }
};