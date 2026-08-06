import { createMMKV } from "react-native-mmkv";

// Reference your exact storage containers by their IDs
const logStorage = createMMKV({ id: "daily-log-storage" });
const settingsStorage = createMMKV({ id: "user-settings-storage" });
const exerciseStorage = createMMKV({ id: "exercise-storage" });

export const storageAdmin = {
  wipeDailyLogs: () => {
    logStorage.clearAll();
    console.log("🧹 [StorageAdmin]: Daily log history completely wiped.");
  },

  nukeEverything: () => {
    logStorage.clearAll();
    settingsStorage.clearAll();
    exerciseStorage.clearAll();
    console.log(
      "☢️ [StorageAdmin]: Entire application storage container nuked.",
    );
  },

  printLogStorage: () => {
    const keys = logStorage.getAllKeys();

    console.log(
      `\n=================== MMKV LOG DUMP (${keys.length} keys) ===================`,
    );

    keys.forEach((key) => {
      const raw = logStorage.getString(key);
      console.log(`\n🔑 Key: [${key}]`);

      if (!raw) {
        console.log("  (empty)");
        return;
      }

      try {
        const parsed = JSON.parse(raw);
        console.log(JSON.stringify(parsed, null, 2));
      } catch {
        console.log(raw);
      }
    });

    console.log(
      `\n==================================================================\n`,
    );
  },
};
