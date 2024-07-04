/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';

import {
  Text,
  View,
  StyleSheet,
  Pressable,
  FlatList,
  SafeAreaView,
} from 'react-native';

import DeckContainer from './components/deckContainer';
import AddDeck from './components/addDeck';
import {retrieveDataFromTable, generateUniqueTableName} from './handleData';

import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AppStackParamList, deckData} from '../App';

type DecksProps = NativeStackScreenProps<AppStackParamList, 'Deck'>;

const DecksScreen = ({route, navigation}: DecksProps) => {
  const uniqueFolderName = route.params.uniqueFolderName;
  const originalFolderName = route.params.originalFolderName;
  const capitalize = (word: string) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  };

  interface folderData {
    deckID: number;
    originalDeckName: string;
    uniqueDeckName: string;
    folderID: number;
  }

  const navigateToFlashcardsScreen = (
    uniqueDeckName: string,
    originalDeckName: string,
  ) => {
    const data = retrieveDataFromTable(uniqueDeckName) as deckData[];
    navigation.navigate('Flashcards', {data, originalDeckName});
  };

  const navigateToWordsScreen = (
    uniqueDeckName: string,
    originalDeckName: string,
  ) => {
    const data = retrieveDataFromTable(uniqueDeckName) as deckData[];
    navigation.navigate('Words', {
      data,
      originalDeckName,
      uniqueDeckName,
      uniqueFolderName,
    });
  };

  const [decks, setDecks] = useState<folderData[]>();

  const fetchDecks = async () => {
    try {
      const getDecks = (await retrieveDataFromTable(
        uniqueFolderName,
      )) as folderData[];
      setDecks([
        ...getDecks,
        {
          deckID: -1,
          originalDeckName: 'AddDeck',
          uniqueDeckName: generateUniqueTableName('AddDeck'),
          folderID: -1,
        },
      ]);
    } catch (error) {
      console.error('Error fetching decks', error);
    }
  };

  useEffect(() => {
    fetchDecks();
  }, []);

  const renderItem = ({item}: {item: folderData}) => {
    if (item.deckID === -1) {
      return <AddDeck onDeckAdded={fetchDecks} folderName={uniqueFolderName} />;
    } else {
      return (
        <Pressable
          onPress={() =>
            navigateToFlashcardsScreen(
              item.uniqueDeckName,
              item.originalDeckName,
            )
          }>
          <DeckContainer
            originalDeckName={item.originalDeckName}
            uniqueDeckName={item.uniqueDeckName}
            uniqueFolderName={uniqueFolderName}
            fetchDecks={fetchDecks}
            navigateToWordsScreen={() =>
              navigateToWordsScreen(item.uniqueDeckName, item.originalDeckName)
            }
          />
        </Pressable>
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{capitalize(originalFolderName)}</Text>
      <SafeAreaView>
        <FlatList
          numColumns={1}
          data={decks}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#EDE6C3',
  },
  title: {
    fontSize: 42,
  },
  list: {
    alignItems: 'center',
    paddingBottom: 50,
  },
});

export default DecksScreen;
