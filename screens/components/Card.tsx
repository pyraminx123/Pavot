/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect} from 'react';
import {TextInput, View, StyleSheet} from 'react-native';
import DeleteButton from './deleteButton';
import {
  updateEntryInDeck,
  insertIntoDeck,
  retrieveDataFromTable,
} from '../handleData';
import {deckData} from '../../App';

const Card = (props: {
  term: string;
  definition: string;
  id: number;
  uniqueDeckName: string;
  uniqueFolderName: string;
  setData: Function;
  data: deckData[];
  deleteFunction: Function;
}) => {
  const [termInput, setTermInput] = useState(props.term);
  const [definitionInput, setDefinitionInput] = useState(props.definition);
  const [cardId, setCardId] = useState(props.id);
  const [isNew, setIsNew] = useState(false);

  const addCardToDatabase = async (term: string, definition: string) => {
    if (cardId !== -1) {
      await updateEntryInDeck(props.uniqueDeckName, cardId, term, definition);
    } else {
      await insertIntoDeck(
        props.uniqueFolderName,
        props.uniqueDeckName,
        term,
        definition,
      );
      console.log('data', props.data);
      setIsNew(true);
    }
    const newData = retrieveDataFromTable(props.uniqueDeckName) as deckData[];
    props.setData([...newData, {id: -1, term: '', definition: '', deckID: -1}]);
    console.log(props.data);
  };
  useEffect(() => {
    if (isNew) {
      const newId = props.data[props.data.length - 2].id;
      console.log('newId:', newId);
      setCardId(newId);
      setIsNew(false);
    }
  }, [isNew]);

  useEffect(() => {
    addCardToDatabase(termInput, definitionInput);
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
