/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, SafeAreaView, StyleSheet} from 'react-native';
import Card, {addCardToDatabase} from './components/Card';
import SaveButton from './components/SaveButton';

import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AppStackParamList, deckData} from '../App';
import {deleteEntryInDeck, retrieveDataFromTable} from './handleData';
import AddCard from './components/addCard';

type WordsProps = NativeStackScreenProps<AppStackParamList, 'Words'>;

const WordScreen = ({route, navigation}: WordsProps) => {
  //const currentUsedIds = route.params.data.map(card => card.id);
  //console.log(currentUsedIds);
  const initialData = [
    ...route.params.data,
    {id: -1, term: '', definition: '', deckID: -1},
  ];
  const deckName = route.params.originalDeckName;
  const [data, setData] = useState(initialData);
  //console.log('initial', data);

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
    setData([
      ...newData,
      {id: Math.random(), term: '', definition: '', deckID: -1},
    ]);
  };

  const updateCard = (index: number, term: string, definition: string) => {
    setData(prevData => {
      //console.log('prev', prevData, prevData[index]);
      prevData[index].term = term;
      prevData[index].definition = definition;
      return prevData;
    });
  };

  const onSave = async () => {
    for (const item of data) {
      if (item.term && item.definition) {
        await addCardToDatabase({
          term: item.term,
          definition: item.definition,
          id: item.id,
          deckId: item.deckID,
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
          ListFooterComponent={AddCard({data: data, setData: setData})}
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
