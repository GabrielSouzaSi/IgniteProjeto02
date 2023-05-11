import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppError } from "@utils/AppError";

import { PLAYER_COLLECTION } from "@storage/storageConfig";
import { playerGetByGroup } from "./PlayerGetByGroup";
import { playerStorageDTO } from "./playerStorageDTO";

export async function playerAddByGroup(
  newPlayers: playerStorageDTO,
  group: string
) {
  try {
    const storagePlayers = await playerGetByGroup(group);

    const playerAlreadyExists = storagePlayers.filter(
      (player) => player.name === newPlayers.name
    );

    if (playerAlreadyExists.length) {
      throw new AppError("Essa pessoa já está adicionada em um time aqui.");
    }

    const storage = JSON.stringify([...storagePlayers, newPlayers]);

    await AsyncStorage.setItem(`${PLAYER_COLLECTION}-${group}`, storage);
  } catch (error) {
    throw error;
  }
}
