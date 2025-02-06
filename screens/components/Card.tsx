/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect} from 'react';
import {TextInput, View, PixelRatio} from 'react-native';
import DeleteButton from './deleteButton';
import {changeTermOrDef} from '../handleData/deck';
import {insertIntoDeck} from '../handleData/deck';
import {createStyleSheet, useStyles} from 'react-native-unistyles';

interface cardInfo {
  term: string;
  definition: string;
  id: number;
  deckId: number;
  uniqueDeckName: string;
  uniqueFolderName: string;
}

// TODO update the update and insert functions
const addCardToDatabase = async (cardProps: cardInfo) => {
  if (cardProps.deckId !== -1) {
    await changeTermOrDef(
      cardProps.uniqueDeckName,
      cardProps.id,
      cardProps.term,
      cardProps.definition,
    );
  } else {
    //console.log(wordStats);
    await insertIntoDeck(
      cardProps.uniqueFolderName,
      cardProps.uniqueDeckName,
      cardProps.term,
      cardProps.definition,
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
        <View style={styles.textInputContainer}>
          <TextInput
            value={termInput}
            onChangeText={text => setTermInput(text)}
            style={styles.textInput}
            placeholder={'term'}
            placeholderTextColor={theme.utils.hexToRgba(theme.colors.dark, 0.5)}
          />
        </View>
        <View style={styles.textInputContainer}>
          <TextInput
            value={definitionInput}
            onChangeText={text => setDefinitionInput(text)}
            style={styles.textInput}
            placeholder={'definition'}
            placeholderTextColor={theme.utils.hexToRgba(theme.colors.dark, 0.4)}
          />
        </View>
      </View>
    </View>
  );
};

const borderRadius = PixelRatio.roundToNearestPixel(10);

const stylesheet = createStyleSheet(theme => ({
  card: {
    width: '100%',
    backgroundColor: theme.colors.light,
    borderRadius: borderRadius,
    alignItems: 'center',
    marginTop: 20,
    padding: 20,
  },
  content: {
    marginTop: 10,
  },
  textInputContainer: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 20,
  },
  textInput: {
    flex: 1,
    padding: 0,
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.sizes.text,
    includeFontPadding: false,
    textAlignVertical: 'center',
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
