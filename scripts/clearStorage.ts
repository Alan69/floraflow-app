import AsyncStorage from "@react-native-async-storage/async-storage";

const clearStorage = async () => {
  try {
    await AsyncStorage.getAllKeys().then(async (keys) => {
      await AsyncStorage.multiRemove(keys);
    });
    console.log("Successfully cleared AsyncStorage");
  } catch (err) {
    console.error("Error clearing AsyncStorage:", err);
  }
};

clearStorage();
