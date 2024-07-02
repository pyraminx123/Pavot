import React from 'react';

import {View, Text, StyleSheet} from 'react-native';
import AddWord from './addWord';
import DeleteButton from './deleteButton';
import {deleteDeck} from '../handleData';

const DeckContainer = (props: {
  originalDeckName: string;
  uniqueDeckName: string;
  uniqueFolderName: string;
  fetchDecks: Function;
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.containerLeft}>
        <Text style={styles.text}>{props.originalDeckName}</Text>
        <AddWord
          uniqueDeckName={props.uniqueDeckName}
          uniqueFolderName={props.uniqueFolderName}
          onWordAdded={() => console.log('Word added')}
        />
      </View>
      {/* here comes the chart pie */}
      <View style={styles.containerRight}>
        <DeleteButton
          deleteFunction={() =>
            deleteDeck(
              props.uniqueFolderName,
              props.uniqueDeckName,
              props.fetchDecks,
            )
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 15,
    margin: 10,
    backgroundColor: 'white',
    width: 350,
    height: 70,
    justifyContent: 'center',
  },
  containerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  containerRight: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  text: {
    fontSize: 25,
    margin: 15,
  },
});

export default DeckContainer;
