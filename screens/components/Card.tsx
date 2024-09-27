/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect} from 'react';
import {TextInput, View} from 'react-native';
import DeleteButton from './deleteButton';
import {updateEntryInDeck, insertIntoDeck} from '../handleData';
import {createStyleSheet, useStyles} from 'react-native-unistyles';
import {hexToRgba} from '../style/hexToRGBA';

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
    const wordStats = JSON.stringify({Attemps: [0, 0, 0, 0]});
    //console.log(wordStats);
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
  const {styles, theme} = useStyles(stylesheet);

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
          placeholderTextColor={hexToRgba(theme.colors.dark, 0.5)}
        />
        <TextInput
          value={definitionInput}
          onChangeText={text => setDefinitionInput(text)}
          style={styles.textInput}
          placeholder={'definition'}
          placeholderTextColor={hexToRgba(theme.colors.dark, 0.4)}
        />
      </View>
    </View>
  );
};

const stylesheet = createStyleSheet(theme => ({
  card: {
    backgroundColor: theme.colors.light,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    padding: 20,
  },
  content: {
    marginTop: 20,
  },
  textInput: {
    height: 35,
    width: 293,
    marginBottom: 10,
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.sizes.text,
    fontWeight: '300',
    color: theme.colors.dark,
    borderBottomWidth: 1.5,
    borderColor: theme.colors.dark,
  },
  containerRight: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
}));

export default Card;
export {addCardToDatabase};
