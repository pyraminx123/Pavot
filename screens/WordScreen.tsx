import React from 'react';
import {View, Text, FlatList, SafeAreaView, StyleSheet} from 'react-native';
import Card from './components/Card';

import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AppStackParamList, deckData} from '../App';

type WordsProps = NativeStackScreenProps<AppStackParamList, 'Words'>;

const WordScreen = ({route}: WordsProps) => {
  // TODO update deckID
  const data = [
    ...route.params.data,
    {id: -1, term: '', definition: '', deckID: -1},
  ];
  const deckName = route.params.originalDeckName;
  console.log(data);

  // TODO make a component card so trhat it is reusable and append one after flatlist
  // TODO field should be TextInput, useSate(), be able to make changes to database, append empty card regardless if data is empty or not
  const renderItem = ({item}: {item: deckData}) => {
    return <Card />;
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{deckName}</Text>
      <SafeAreaView style={styles.list}>
        <FlatList numColumns={1} data={data} renderItem={renderItem} />
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
  },
});

export default WordScreen;
