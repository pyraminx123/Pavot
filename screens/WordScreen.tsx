/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, SafeAreaView, StyleSheet} from 'react-native';
import Card, {addCardToDatabase} from './components/Card';
import SaveButton from './components/SaveButton';

import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AppStackParamList, deckData} from '../App';
import {deleteEntryInDeck, retrieveDataFromTable} from './handleData';

type WordsProps = NativeStackScreenProps<AppStackParamList, 'Words'>;

const WordScreen = ({route, navigation}: WordsProps) => {
  const initialData = [
    ...route.params.data,
    {id: -1, term: '', definition: '', deckID: -1},
  ];
  const deckName = route.params.originalDeckName;
  const [data, setData] = useState(initialData);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => SaveButton(onSave),
    });
  }, [data]);

  const deleteCard = async (id: number) => {
    await deleteEntryInDeck(route.params.uniqueDeckName, id);
    const newData = retrieveDataFromTable(
      route.params.uniqueDeckName,
    ) as deckData[];
    setData([...newData, {id: -1, term: '', definition: '', deckID: -1}]);
  };

  const updateCard = (index: number, term: string, definition: string) => {
    setData(prevData => {
      const newData = [...prevData];
      newData[index] = {...newData[index], term, definition};
      return newData;
    });
  };

  const onSave = async () => {
    for (const item of data) {
      if (item.term && item.definition) {
        await addCardToDatabase({
          term: item.term,
          definition: item.definition,
          id: item.id,
          uniqueDeckName: route.params.uniqueDeckName,
          uniqueFolderName: route.params.uniqueFolderName,
        });
      }
    }
    navigation.navigate('Deck', {
      folderID: route.params.folderID,
      uniqueFolderName: route.params.uniqueFolderName,
      originalFolderName: route.params.originalFolderName,
    });
  };

  const renderItem = ({item, index}: {item: deckData; index: number}) => {
    return (
      <Card
        index={index}
        term={item.term}
        definition={item.definition}
        id={item.id}
        uniqueDeckName={route.params.uniqueDeckName}
        uniqueFolderName={route.params.uniqueFolderName}
        deleteFunction={() => deleteCard(item.id)}
        updateCard={updateCard}
      />
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{deckName}</Text>
      <SafeAreaView>
        <FlatList
          numColumns={1}
          data={data}
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

export default WordScreen;
