import React, {useEffect, useState} from 'react';

import {Text, View, StyleSheet, Pressable, FlatList, SafeAreaView} from 'react-native';

import DeckContainer from './components/deckContainer';
import AddDeck from './components/addDeck';
import {retrieveDataFromTable} from './handleData';

import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AppStackParamList, deckData} from '../App';

type SetsProps = NativeStackScreenProps<AppStackParamList, 'Set'>;

const SetsScreen = ({route, navigation}: SetsProps) => {
  const folderName = route.params.tableName;
  const capitalize = (word: string) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  };

  interface folderData {
    deckID: number;
    deckName: string;
  }

  const navigateToFlashcardsScreen = (deckName: string) => {
    navigation.navigate(
      'Flashcards',
      retrieveDataFromTable(deckName) as deckData[],
    );
  };

  const [decks, setDecks] = useState<folderData[]>([]);

  const fetchDecks = async () => {
    const decks = (await retrieveDataFromTable(
      folderName
    )) as folderData[];
    setDecks([...decks, {deckID: -1, deckName: 'AddDeck'}]);
  };

  useEffect(() => {
    fetchDecks();
  }, []);

  console.log('Decks:', decks);

  const renderItem = ({item}: {item: deckData}) => {
    if (item.deckID === -1) {
      return <AddDeck onDeckAdded={fetchDecks} />;
    } else {
      return (
        <Pressable>
          <Text>Hi</Text>
        </Pressable>
      );
    }
  };

  // TODO 1: render Data 2: add Deck (see add Folder)
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{capitalize(folderName)}</Text>
      <SafeAreaView>
        <Text>Hi</Text>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 42,
  },
});

export default SetsScreen;
