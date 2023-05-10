import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppError } from "@utils/AppError";

import { PLAYER_COLLECTION } from "@storage/storageConfig";

import { playerStorageDTO } from "./playerStorageDTO";

export async function playerAddByGroup(newPlayers: playerStorageDTO, group: string) {
    try {
        
        await AsyncStorage.setItem(`${PLAYER_COLLECTION}-${group}`,'');
    } catch (error) {
        
    }
    
}