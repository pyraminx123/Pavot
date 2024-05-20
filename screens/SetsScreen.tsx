import React from 'react';

import {Text, View, StyleSheet, Pressable} from 'react-native';

import DeckContainer from './components/deckContainer';
import {retrieveDataFromTable} from './handleData';

import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {AppStackParamList, deckData} from '../App';

type SetsProps = NativeStackScreenProps<AppStackParamList, 'Set'>;

const SetsScreen = ({route, navigation}: SetsProps) => {
  const decks = route.params.decks;
  const folderName = route.params.tableName;
  console.log(decks);
  const capitalize = (word: String) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  };

  interface DeckData {
    deckID: Number;
    deck: String;
  }

  const navigateToFlashcardsScreen = (deckName: string) => {
    navigation.navigate(
      'Flashcards',
      retrieveDataFromTable(deckName) as deckData[],
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{capitalize(folderName)}</Text>
      {decks.map((deckData: DeckData) => {
        return (
          <Pressable onPress={() => navigateToFlashcardsScreen('Unidad1')}>
            <DeckContainer name={deckData.deck} key={+deckData.deckID} />
          </Pressable>
        );
      })}
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
