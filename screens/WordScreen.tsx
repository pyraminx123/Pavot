import React, {useState} from 'react';
import {View, Text, FlatList, SafeAreaView, StyleSheet} from 'react-native';
import Card from './components/Card';

import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AppStackParamList, deckData} from '../App';
import {deleteEntryInDeck, retrieveDataFromTable} from './handleData';

type WordsProps = NativeStackScreenProps<AppStackParamList, 'Words'>;

const WordScreen = ({route}: WordsProps) => {
  const initialData = [
    ...route.params.data,
    {id: -1, term: '', definition: '', deckID: -1},
  ];
  const deckName = route.params.originalDeckName;
  const [data, setData] = useState(initialData);
  //console.log(data);

  const deleteCard = async (id: number) => {
    await deleteEntryInDeck(route.params.uniqueDeckName, id);
    const newData = retrieveDataFromTable(
      route.params.uniqueDeckName,
    ) as deckData[];
    setData([...newData, {id: -1, term: '', definition: '', deckID: -1}]);
  };
  //console.log(data);
  const renderItem = ({item}: {item: deckData}) => {
    return (
      <Card
        term={item.term}
        definition={item.definition}
        id={item.id}
        uniqueDeckName={route.params.uniqueDeckName}
        uniqueFolderName={route.params.uniqueFolderName}
        deleteFunction={() => deleteCard(item.id)}
        setData={setData}
        data={data}
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
