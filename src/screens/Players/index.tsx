import { useEffect, useState, useRef } from "react";
import { Alert, FlatList, TextInput} from "react-native";
import { useRoute } from "@react-navigation/native";

import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { Filter } from "@components/Filter";
import { Header } from "@components/Header";
import { Highlight } from "@components/Highlight";
import { ButtonIcon } from "@components/ButtonIcon";
import { PlayerCard } from "@components/PlayerCard";
import { ListEmpty } from "@components/ListEmpty";

import { Container, Form, HeaderList, NumberOfPlayers } from "./styles";
import { AppError } from "@utils/AppError";
import { playerAddByGroup } from "@storage/player/playerAddByGroup";
import { playersGetByGroupAndTeam } from "@storage/player/playersGetByGroupAndTeam";
import { playerStorageDTO } from "@storage/player/playerStorageDTO";

type RouteParams = {
  group: string;
}

export function Players() {
  const [newPlayerName, setNewPlayerName] = useState(''); 
  const [team, setTeam] = useState("Time A");
  const [players, setPlayers] = useState<playerStorageDTO[]>([]);

  const route = useRoute();
  const { group } = route.params as RouteParams;

  const newPlayerNameInputRef = useRef<TextInput>(null);

  async function handleAddPlayer(){
    if(newPlayerName.trim().length === 0){
      return Alert.alert("Nova Pessoa","Informe o nome da pessoa para adicionar.");
    }

    const newPlayer = {
      name: newPlayerName,
      team
    }
    try {
      await playerAddByGroup(newPlayer, group);
      newPlayerNameInputRef.current?.blur();
      setNewPlayerName("");
      fetchPlayersByTeam();
    } catch (error) {
      if(error instanceof AppError){
        Alert.alert("Nova pessoa", error.message)
      } else {
        console.log(error);
        Alert.alert("Nova pessoa","Não foi possível adicionar!")
      }
    }
  }

    async function fetchPlayersByTeam() {
      try {
        const playersByTeam = await playersGetByGroupAndTeam(group, team);
        setPlayers(playersByTeam);
      } catch (error) {
        console.log(error);
        Alert.alert("Pessoas","Não foi possível carregar as pessoas do time selecionado.")
      }
    }

    useEffect(() => {
      console.log("useEffect executou!");
      fetchPlayersByTeam();
    },[team]);
  return (
    <Container>
      <Header showBackButton />

      <Highlight
        title={group}
        subtitle="adcione a galera e separe os times"
      />

      <Form>
        <Input inputRef={newPlayerNameInputRef} onChangeText={setNewPlayerName} value={newPlayerName} placeholder="Nome da pessoa" autoCorrect={false} onSubmitEditing={handleAddPlayer} returnKeyType="done" />

        <ButtonIcon icon="add" onPress={handleAddPlayer}/>
      </Form>
      <HeaderList>
        
        <FlatList
          data={["Time A", "Time B"]}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <Filter
              title={item}
              isActive={item === team}
              onPress={() => setTeam(item)}
            />
          )}
          horizontal
        />

        <NumberOfPlayers>{players.length}</NumberOfPlayers>
      
      </HeaderList>

      <FlatList
        data={players}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => <PlayerCard name={item.name} onRemove={() => {}}/>}
        ListEmptyComponent={() => (
          <ListEmpty
            message="Não há pessoas nesse time."
          />
        )}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[
          { paddingBottom:100},
          players.length === 0 && { flex: 1 }
        ]}
      />
      <Button title="Remover Turma" type="SECONDARY" />
    
    </Container>
  );
}
