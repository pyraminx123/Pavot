import React from 'react';

import {Text, View, StyleSheet} from 'react-native';

import DeckContainer from './components/deckContainer';

const SetsScreen = ({route, navigation}) => {
  const data = route.params.data;
  const tableName = route.params.tableName;
  console.log(data);
  const capitalize = (word: String) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  };

  interface DeckData {
    deckID: Number;
    deck: String;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{capitalize(tableName)}</Text>
      {data.map((deckData: DeckData) => {
        return <DeckContainer name={deckData.deck} key={+deckData.deckID} />;
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
