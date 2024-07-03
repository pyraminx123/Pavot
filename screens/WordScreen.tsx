import React from 'react';
import {View, Text, FlatList, SafeAreaView} from 'react-native';

import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AppStackParamList, deckData} from '../App';

type WordsProps = NativeStackScreenProps<AppStackParamList, 'Words'>;

const WordScreen = ({route}: WordsProps) => {
  const data = route.params.data;
  const deckName = route.params.originalDeckName;

  // TODO field should be TextInput, useSate(), be able to make changes to database
  const renderItem = ({item}: {item: deckData}) => {
    return (
      <View>
        <Text>{item.term}</Text>
        <Text>{item.definition}</Text>
      </View>
    );
  };
  return (
    <View>
      <Text>{deckName}</Text>
      <SafeAreaView>
        <FlatList numColumns={1} data={data} renderItem={renderItem} />
      </SafeAreaView>
    </View>
  );
};

export default WordScreen;
