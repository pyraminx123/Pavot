/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useCallback, useLayoutEffect, useState} from 'react';
import {FlatList, TextInput, View, SafeAreaView} from 'react-native';
import Card, {addCardToDatabase} from './components/Card';
import {createStyleSheet, useStyles} from 'react-native-unistyles';

import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AppStackParamList} from '../App';
import {createDeck, changeDeckName, deleteEntryInDeck} from './handleData/deck';
import {wordObj} from './types';
import {useFocusEffect} from '@react-navigation/native';
import {useAddButtonContext} from './contexts/headerContext';
import {WordsHeader} from './components/headers';
import UploadFile from './components/UploadFile';

type WordsProps = NativeStackScreenProps<AppStackParamList, 'Words'>;

const WordScreen = ({route, navigation}: WordsProps) => {
  const uniqueDeckName = route.params.uniqueDeckName;
  //console.log('uniqueDeckName', uniqueDeckName);
  const uniqueFolderName = route.params.uniqueFolderName;

  const emptyCard = {
    deckID: -1,
    definition: '',
    difficulty: 0,
    due: new Date(),
    elapsed_days: 0,
    id: Math.random(),
    lapses: 0,
    last_review: new Date(),
    reps: 0,
    scheduled_days: -1,
    stability: -1,
    state: 0, // Ensure the state matches the wordObj type
    maturityLevel: 'Medium' as 'Medium',
    term: '',
  };
  //const currentUsedIds = route.params.data.map(card => card.id);
  //console.log(currentUsedIds);
  const initialData = route.params.data.length
    ? [...route.params.data, emptyCard]
    : [emptyCard];
  const headerTitle = route.params.data.length
    ? 'Edit Deck'
    : 'Create New Deck';
  const deckName = route.params.originalDeckName;
  const [data, setData] = useState(initialData);
  const [text, onChangeText] = useState(deckName);
  const {setHandleAddPress} = useAddButtonContext();
  //console.log('initial', data);

  useLayoutEffect(() => {
    navigation.setOptions({
      animation: 'slide_from_bottom',
      header: () => (
        <WordsHeader
          title={headerTitle}
          onSave={onSave}
          onClose={navigation.goBack}
        />
      ),
    });
  }, [text, data]);

  useFocusEffect(
    useCallback(() => {
      setHandleAddPress(() => {
        //console.log('WordScreen Add Action');
        setData(prevData => {
          const newEmptyCard = {
            deckID: -1,
            definition: '',
            difficulty: 0,
            due: new Date(),
            elapsed_days: 0,
            id: Math.random(),
            lapses: 0,
            last_review: new Date(),
            reps: 0,
            scheduled_days: -1,
            stability: -1,
            state: 0,
            maturityLevel: 'Medium' as 'Medium',
            term: '',
          };
          return [...prevData, newEmptyCard];
        });
      });
    }, [setHandleAddPress]),
  );

  const deleteCard = async (id: number, deckId: number) => {
    //console.log(data);
    if (deckId !== -1) {
      await deleteEntryInDeck(uniqueDeckName, id);
      const newData = data.filter(card => card.id !== id);
      setData(newData);
      // delete empty card
    } else {
      const newData = data.filter(card => card.id !== id);
      setData(newData);
    }
  };

  const updateCardInfo = (index: number, term: string, definition: string) => {
    setData(prevData => {
      //console.log('prev', prevData, prevData[index]);
      prevData[index].term = term;
      prevData[index].definition = definition;
      return [...prevData];
    });
  };
  // TODO differentiate between new and old cards
  const onSave = async () => {
    if (uniqueDeckName === '') {
      const newUniqueDeckName = createDeck(text, uniqueFolderName) as string;
      for (const item of data) {
        if (item.term && item.definition) {
          await addCardToDatabase({
            term: item.term,
            definition: item.definition,
            id: item.id,
            deckId: item.deckID,
            uniqueDeckName: newUniqueDeckName,
            uniqueFolderName: uniqueFolderName,
          });
        }
      }
    } else {
      for (const item of data) {
        if (item.term && item.definition) {
          await addCardToDatabase({
            term: item.term,
            definition: item.definition,
            id: item.id,
            deckId: item.deckID,
            uniqueDeckName: uniqueDeckName,
            uniqueFolderName: uniqueFolderName,
          });
        }
      }

      await changeDeckName(uniqueFolderName, text, uniqueDeckName);
    }
    navigation.goBack();
  };

  const renderItem = ({item, index}: {item: wordObj; index: number}) => {
    return (
      <Card
        index={index}
        term={item.term}
        definition={item.definition}
        id={item.id}
        uniqueDeckName={uniqueDeckName}
        uniqueFolderName={uniqueFolderName}
        deleteFunction={() => deleteCard(item.id, item.deckID)}
        updateCard={updateCardInfo}
      />
    );
  };

  const {styles, theme} = useStyles(stylesheet);

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        style={styles.title}
        value={text}
        onChangeText={txt => onChangeText(txt)}
        placeholder="Deck name"
        placeholderTextColor={theme.utils.hexToRgba(theme.colors.dark, 0.5)}
      />
      <View>
        <FlatList
          numColumns={1}
          data={data}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ListHeaderComponent={
            <UploadFile previousData={data} setData={setData} />
          }
        />
      </View>
    </SafeAreaView>
  );
};

const stylesheet = createStyleSheet(theme => ({
  container: {
    flex: 1,
    paddingHorizontal: 30,
    backgroundColor: '#FFFFFF',
  },
  title: {
    padding: 0,
    fontSize: theme.typography.sizes.title,
    fontFamily: theme.typography.fontFamily,
    color: theme.colors.dark,
    fontWeight: '400',
    borderBottomWidth: 1.5,
    borderColor: theme.colors.dark,
    marginBottom: 20,
  },
  list: {
    alignItems: 'center',
    paddingBottom: 300,
  },
}));

export default WordScreen;
