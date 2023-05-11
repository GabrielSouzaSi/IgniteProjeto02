import AsyncStorage from "@react-native-async-storage/async-storage";

import { PLAYER_COLLECTION } from "@storage/storageConfig";
import { playerStorageDTO } from "./playerStorageDTO";

export async function playerGetByGroup(group: string) {
  try {
    const storage = await AsyncStorage.getItem(`${PLAYER_COLLECTION}-${group}`);

    const player: playerStorageDTO[] = storage ? JSON.parse(storage) : [];

    return player;
  } catch (error) {
    throw error;
  }
}
