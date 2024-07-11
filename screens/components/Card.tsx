/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect} from 'react';
import {TextInput, View, StyleSheet} from 'react-native';
import DeleteButton from './deleteButton';
import {updateEntryInDeck, insertIntoDeck} from '../handleData';

interface cardInfo {
  term: string;
  definition: string;
  id: number;
  deckId: number;
  uniqueDeckName: string;
  uniqueFolderName: string;
}

const addCardToDatabase = async (cardProps: cardInfo) => {
  if (cardProps.deckId !== -1) {
    await updateEntryInDeck(
      cardProps.uniqueDeckName,
      cardProps.id,
      cardProps.term,
      cardProps.definition,
    );
  } else {
    const wordStats = JSON.stringify({Attemps: [0, 0, 0, 1]});
    console.log(wordStats);
    await insertIntoDeck(
      cardProps.uniqueFolderName,
      cardProps.uniqueDeckName,
      cardProps.term,
      cardProps.definition,
      wordStats,
    );
  }
};

const Card = (props: {
  index: number;
  term: string;
  definition: string;
  id: number;
  uniqueDeckName: string;
  uniqueFolderName: string;
  deleteFunction: Function;
  updateCard: Function;
}) => {
  const [termInput, setTermInput] = useState(props.term);
  const [definitionInput, setDefinitionInput] = useState(props.definition);

  useEffect(() => {
    props.updateCard(props.index, termInput, definitionInput);
  }, [termInput, definitionInput]);

  return (
    <View style={styles.card}>
      <View style={styles.containerRight}>
        <DeleteButton deleteFunction={() => props.deleteFunction()} />
      </View>
      <View style={styles.content}>
        <TextInput
          value={termInput}
          onChangeText={text => setTermInput(text)}
          style={styles.textInput}
          placeholder={'term'}
          placeholderTextColor={'rgba(0, 0, 0, 0.5)'}
        />
        <TextInput
          value={definitionInput}
          onChangeText={text => setDefinitionInput(text)}
          style={styles.textInput}
          placeholder={'definition'}
          placeholderTextColor={'rgba(0, 0, 0, 0.5)'}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#83B4E1',
    borderRadius: 25,
    width: 345,
    alignItems: 'center',
    margin: 10,
  },
  content: {
    marginTop: 40,
  },
  textInput: {
    height: 50,
    width: 300,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 10,
    marginBottom: 10,
  },
  containerRight: {
    position: 'absolute',
    right: 10,
    top: 10,
    marginBottom: 100,
  },
});

export default Card;
export {addCardToDatabase};
