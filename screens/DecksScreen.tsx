import React, {useEffect, useState} from 'react';

import {Text, View, StyleSheet, Pressable, FlatList, SafeAreaView} from 'react-native';

import DeckContainer from './components/deckContainer';
import AddDeck from './components/addDeck';
import {insertIntoDeck, retrieveDataFromTable} from './handleData';

import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AppStackParamList, deckData} from '../App';

type DecksProps = NativeStackScreenProps<AppStackParamList, 'Deck'>;
const DecksScreen = ({route, navigation}: DecksProps) => {
  const folderName = route.params.tableName;
  const capitalize = (word: string) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  };

  //insertIntoDeck('Test', 'First', 'hello', 'bonjour')

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

  const fetchDecks = () => {
    const decks = retrieveDataFromTable(
      folderName
    ) as folderData[];
    setDecks([...decks, {deckID: -1, deckName: 'AddDeck'}]);
  };

  useEffect(() => {
    fetchDecks();
  }, []);

  //console.log('Decks:', decks);

  const renderItem = ({item}: {item: folderData}) => {
    if (item.deckID === -1) {
      return <AddDeck onDeckAdded={fetchDecks} folderName={folderName} />;
    } else {
      return (
        <Pressable onPress={() => navigateToFlashcardsScreen(item.deckName)}>
          <DeckContainer name={item.deckName} />
        </Pressable>
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{capitalize(folderName)}</Text>
      <SafeAreaView>
        <FlatList numColumns={1} data={decks} renderItem={renderItem} />
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

export default DecksScreen;
