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
import {retrieveDataFromTable} from './handleData';

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
    folderID: number;
  }

  const navigateToFlashcardsScreen = (deckName: string) => {
    const data = retrieveDataFromTable(deckName) as deckData[];
    navigation.navigate('Flashcards', {data, deckName});
  };

  const [decks, setDecks] = useState<folderData[]>();

  const fetchDecks = () => {
    const getDecks = retrieveDataFromTable(folderName) as folderData[];
    setDecks([...getDecks, {deckID: -1, deckName: 'AddDeck', folderID: -1}]);
  };

  useEffect(() => {
    fetchDecks();
  }, []);

  const renderItem = ({item}: {item: folderData}) => {
    if (item.deckID === -1) {
      return <AddDeck onDeckAdded={fetchDecks} folderName={folderName} />;
    } else {
      return (
        <Pressable onPress={() => navigateToFlashcardsScreen(item.deckName)}>
          <DeckContainer
            deckName={item.deckName}
            folderName={folderName}
            fetchDecks={fetchDecks}
          />
        </Pressable>
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{capitalize(folderName)}</Text>
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
