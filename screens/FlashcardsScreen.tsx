import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

import Flashcard from './components/Flashcard';

import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {AppStackParamList} from '../App';
import {retrieveDataFromTable} from './handleData';

type FlashcardsProps = NativeStackScreenProps<AppStackParamList, 'Flashcards'>;

// ?? props need to be updated, maybe in the future add example sentences
// use useState and useEffect to update props
const FlashcardsScreen = ({route}: FlashcardsProps) => {
  const data = route.params.data as wordObj[];
  const originalDeckName = route.params.originalDeckName;
  const uniqueDeckName = route.params.uniqueDeckName;

  const [terms, setTerms] = useState(data);
  //console.log('terms', route.params.data);
  const initialLength = terms.length;
  // TODO this has to be updated I believe (with wordStats)
  useEffect(() => {
    const termsWithEnding = [
      ...terms,
      {term: '', definition: '', id: initialLength + 1, deckID: -1},
    ];
    setTerms(termsWithEnding);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  interface wordObj {
    deckID: number;
    definition: string;
    term: string;
    id: number;
  }

  const changeWordStats = (isWordCorrect: boolean) => {
    const fetchWordInfo = () => {
      try {
        const wordInfo = retrieveDataFromTable(uniqueDeckName);
        console.log(isWordCorrect, wordInfo);
      } catch (error) {
        console.error(error);
      }
    };
    fetchWordInfo();
  };

  return (
    // TODO handle case where no words are added yet
    // TODO after make card before already appear but text just not visible
    // TODO there could be a problem when the id is the same
    <View style={styles.container}>
      <Text style={styles.title}>{originalDeckName}</Text>
      <GestureHandlerRootView style={styles.gestureContainer}>
        {terms.map((wordObj: wordObj, index: number) => {
          if (index === 0) {
            if (terms.length === 1) {
              return (
                <Flashcard
                  key={wordObj.id}
                  term={wordObj.term}
                  definition={wordObj.definition}
                  terms={terms}
                  setTerms={setTerms}
                  disableGesture={true}
                  changeWordStats={changeWordStats}
                />
              );
            } else {
              const nextWordObj = terms[index + 1];
              return (
                // each object, even if not rendered has to have an unique key
                <React.Fragment key={wordObj.id}>
                  <Flashcard
                    term={nextWordObj.term}
                    definition={nextWordObj.definition}
                    terms={terms}
                    setTerms={setTerms}
                    changeWordStats={changeWordStats}
                  />
                  <Flashcard
                    term={wordObj.term}
                    definition={wordObj.definition}
                    terms={terms}
                    setTerms={setTerms}
                    changeWordStats={changeWordStats}
                  />
                </React.Fragment>
              );
            }
          }
        })}
      </GestureHandlerRootView>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 42,
  },
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#EDE6C3',
  },
  gestureContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default FlashcardsScreen;
