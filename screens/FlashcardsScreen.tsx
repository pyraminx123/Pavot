import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text, Pressable} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

import Flashcard from './components/Flashcard';

import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {AppStackParamList} from '../App';
import {runOnJS} from 'react-native-reanimated';
import {retrieveWordFromDeck, updateWordStats} from './handleData';
import type {wordObj, wordStats} from './types';

type FlashcardsProps = NativeStackScreenProps<AppStackParamList, 'Flashcards'>;

// ?? props need to be updated, maybe in the future add example sentences
// use useState and useEffect to update props
const FlashcardsScreen = ({route}: FlashcardsProps) => {
  const data = route.params.data as wordObj[];
  const originalDeckName = route.params.originalDeckName;
  const uniqueDeckName = route.params.uniqueDeckName;

  const [terms, setTerms] = useState(data);
  const [termsStack, setTermsStack] = useState(terms as wordObj[]);
  useEffect(() => {
    const termsWithEnding = [
      ...terms,
      {
        term: '',
        definition: '',
        id: Math.random(),
        deckID: -1,
        wordStats: '{"Attemps":[0,0,0,0]}',
      },
    ] as wordObj[];
    setTerms(termsWithEnding);
    setTermsStack(termsWithEnding);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const changeWordStats = async (
    isWordCorrect: boolean,
    wordObj: wordObj[],
  ) => {
    try {
      const wordStats = JSON.parse(Object(wordObj).wordStats) as wordStats[];
      //console.log('stats', Object(wordStats).Attemps);
      const attemps = Object(wordStats).Attemps;
      attemps.shift(); // removes first item
      attemps.push(isWordCorrect ? 1 : 0);
      Object(wordStats).Attemps = attemps;
      await updateWordStats(
        uniqueDeckName,
        Object(wordObj).id,
        JSON.stringify(wordStats),
      );
      //console.log(wordStats);
      const updatedWordObject = retrieveWordFromDeck(
        uniqueDeckName,
        Object(wordObj).id,
      );
      setTerms(prevTerms => {
        prevTerms.map(term => {
          Object(terms).id === Object(wordObj).id ? updatedWordObject : term;
        });
        return prevTerms;
      });
      return '';
    } catch (error) {
      console.error('Some error ocurred trying to update wordStats', error);
      return '';
    }
  };

  // here the async/await are very important
  const triggerChangeWordStats = async (
    isWordCorrect: boolean,
    wordObj: wordObj[],
  ) => {
    'worklet';
    await runOnJS(changeWordStats)(isWordCorrect, wordObj);
  };

  // useEffect(() => {
  //   terms.map(term => {
  //     if (term.deckID !== -1) {
  //       const wordAttemps = Object(
  //         JSON.parse(Object(term).wordStats) as wordStats[],
  //       ).Attemps;
  //       console.log(wordAttemps);
  //       if (wordAttemps.includes(0)) {
  //         setTermsStack(prevData => {
  //           return [...prevData, term];
  //         });
  //       } else {
  //         return term;
  //       }
  //     } else {
  //       return term;
  //     }
  //   });
  // }, [terms]);

  return (
    // TODO handle case where no words are added yet
    // TODO after make card before already appear but text just not visible
    <View style={styles.container}>
      <Text style={styles.title}>{originalDeckName}</Text>
      <GestureHandlerRootView style={styles.gestureContainer}>
        {termsStack.length > 0 && (
          <>
            <Pressable style={styles.card} />
            <Flashcard
              currentWordObj={termsStack[0]}
              key={termsStack[0].id}
              termsStack={termsStack}
              setTermsStack={setTermsStack}
              disableGesture={termsStack.length === 1}
              changeWordStats={triggerChangeWordStats}
            />
          </>
        )}
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
  card: {
    width: 320,
    height: 200,
    backgroundColor: 'white',
    borderRadius: 15,
    borderWidth: 3,
    backfaceVisibility: 'hidden',
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default FlashcardsScreen;
