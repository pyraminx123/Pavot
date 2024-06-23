import React from 'react';

import {View, Text, StyleSheet} from 'react-native';
import AddWord from './addWord';

const DeckContainer = (props: {deckName: string; folderName: string}) => {
  return (
    <View style={styles.container}>
      <View style={styles.containerLeft}>
        <Text style={styles.text}>{props.deckName}</Text>
        <AddWord
          deckName={props.deckName}
          folderName={props.folderName}
          onWordAdded={() => console.log('Word added')}
        />
      </View>
      {/* here comes the chart pie */}
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
  text: {
    fontSize: 25,
    margin: 15,
  },
});

export default DeckContainer;
